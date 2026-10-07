/* eslint-disable no-console -- CLI script: progress output is intended */
// Generates a typed $fetch SDK from an OpenAPI schema.
// Run: npm run api-gen
//
// config.json:
//   schema         URL of the schema (http/https) or a path relative to this folder
//   outputPath     folder for the generated files, relative to this folder
//   outputFile     SDK file name; types go to <name>.types.ts next to it
//   rmMethodPrefix strip the "<tag>_" prefix from operationIds (products_list -> products.list)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'))
const { schema: schemaSource, outputFile, outputPath, rmMethodPrefix } = config

const outputDir = path.resolve(__dirname, outputPath)
const typesFileName = outputFile.replace(/\.ts$/, '.types.ts')

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete']

async function loadSchema() {
  if (/^https?:\/\//.test(schemaSource)) {
    const response = await fetch(schemaSource, { headers: { Accept: 'application/json' } })
    if (!response.ok) {
      throw new Error(`Could not fetch the schema: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, schemaSource), 'utf8'))
}

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9_$]/g, '_').replace(/^[0-9]/, '_$&')
}

// Method name: operationId, otherwise built from the HTTP method and path
function buildMethodName(operation, apiPath, method) {
  if (operation.operationId) return sanitizeName(operation.operationId)

  const pathParts = apiPath.split('/').filter((p) => p && !p.startsWith('{'))
  const name =
    method +
    pathParts
      .map((part) =>
        part
          .split(/[-_]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(''),
      )
      .join('')
  return sanitizeName(name)
}

// Prefer application/json, otherwise the first content type
function pickContentType(content) {
  const types = Object.keys(content || {})
  if (types.length === 0) return null
  return types.includes('application/json') ? 'application/json' : types[0]
}

// Parameters may be inline or a $ref into components.parameters
function resolveParameter(schema, parameter) {
  if (!parameter.$ref) return parameter
  const name = parameter.$ref.split('/').pop()
  return schema.components?.parameters?.[name] ?? parameter
}

// Responses may be inline or a $ref into components.responses
function resolveResponse(schema, response) {
  if (!response?.$ref) return response
  const name = response.$ref.split('/').pop()
  return schema.components?.responses?.[name] ?? response
}

function buildMethodLine(schema, apiPath, method, operation) {
  const pathParams = (apiPath.match(/{([^}]+)}/g) || []).map((p) => p.slice(1, -1))
  const parameters = (operation.parameters || []).map((p) => resolveParameter(schema, p))
  const queryParams = parameters.filter((p) => p.in === 'query')
  const hasQuery = queryParams.length > 0
  const isQueryRequired = queryParams.some((p) => p.required)
  const requestContentType = ['post', 'put', 'patch'].includes(method)
    ? pickContentType(operation.requestBody?.content)
    : null
  const isMultipart = requestContentType === 'multipart/form-data'

  // Success response type: the first 2xx with content, otherwise void
  let responseType = 'void'
  const successEntry = Object.entries(operation.responses || {}).find(([code]) =>
    /^2\d\d$/.test(code),
  )
  if (successEntry) {
    const [code, response] = successEntry
    const responseContentType = pickContentType(resolveResponse(schema, response)?.content)
    if (responseContentType) {
      responseType = `paths['${apiPath}']['${method}']['responses']['${code}']['content']['${responseContentType}']`
    }
  }

  const args = pathParams.map((p) => `${p}: string | number`)
  if (requestContentType) {
    const bodyType = isMultipart
      ? 'FormData'
      : `NonNullable<paths['${apiPath}']['${method}']['requestBody']>['content']['${requestContentType}']`
    args.push(`body: ${bodyType}`)
  }
  if (hasQuery) {
    args.push(
      `query${isQueryRequired ? '' : '?'}: paths['${apiPath}']['${method}']['parameters']['query']`,
    )
  }

  // The last argument of every method is raw $fetch options;
  // spreading it last lets a caller override anything (headers, query, signal ...)
  const argCount = args.length
  args.push('options?: NitroFetchOptions<NitroFetchRequest>')

  const urlTemplate =
    pathParams.length > 0
      ? '`' + pathParams.reduce((acc, p) => acc.replace(`{${p}}`, `\${${p}}`), apiPath) + '`'
      : `'${apiPath}'`

  const fetchOptions = [`method: '${method.toUpperCase()}'`]
  if (requestContentType) fetchOptions.push('body')
  if (hasQuery) fetchOptions.push('query')
  fetchOptions.push('...options')

  return {
    code: `(${args.join(', ')}) => fetcher<${responseType}>(${urlTemplate}, { ${fetchOptions.join(', ')} })`,
    argCount,
  }
}

async function generate() {
  console.log(`Loading schema: ${schemaSource}`)
  const schema = await loadSchema()
  if (!schema.paths) throw new Error('The OpenAPI schema has no paths')

  fs.mkdirSync(outputDir, { recursive: true })

  console.log('Generating types (openapi-typescript)...')
  const ast = await openapiTS(schema)
  const banner = `// Auto-generated from ${schemaSource}\n// Do not edit by hand — run \`npm run api-gen\` to regenerate.\n\n`
  fs.writeFileSync(path.join(outputDir, typesFileName), banner + astToString(ast))

  console.log('Generating SDK methods...')
  const groups = {}
  const methodMeta = {}

  for (const [apiPath, pathItem] of Object.entries(schema.paths)) {
    if (!pathItem) continue

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method]
      if (!operation) continue

      const groupName = sanitizeName((operation.tags || ['default'])[0])
      let methodName = buildMethodName(operation, apiPath, method)
      if (rmMethodPrefix && methodName.startsWith(`${groupName}_`)) {
        methodName = methodName.slice(groupName.length + 1)
      }

      const { code, argCount } = buildMethodLine(schema, apiPath, method, operation)
      groups[groupName] ??= []
      groups[groupName].push(`    ${methodName}: ${code},`)
      methodMeta[groupName] ??= {}
      methodMeta[groupName][methodName] = { verb: method, args: argCount }
    }
  }

  let sdk = banner
  sdk += `import type { $Fetch, NitroFetchOptions, NitroFetchRequest } from 'nitropack'\n`
  sdk += `import type { paths } from './${typesFileName.replace(/\.ts$/, '')}'\n\n`
  sdk += `export const createSdk = (fetcher: $Fetch<unknown, NitroFetchRequest>) => ({\n`
  for (const [groupName, methods] of Object.entries(groups)) {
    sdk += `  ${groupName}: {\n${methods.join('\n')}\n  },\n`
  }
  sdk += `})\n\n`
  sdk += `export type ApiSdk = ReturnType<typeof createSdk>\n\n`
  sdk += `// SDK method metadata: HTTP verb and the number of own arguments (without options)\n`
  sdk += `export const sdkMethodMeta = ${JSON.stringify(methodMeta, null, 2)} as const\n`

  fs.writeFileSync(path.join(outputDir, outputFile), sdk)

  const methodCount = Object.values(groups).reduce((sum, m) => sum + m.length, 0)
  console.log(`Done: ${methodCount} methods in ${Object.keys(groups).length} groups
  - Types: ${path.join(outputDir, typesFileName)}
  - SDK:   ${path.join(outputDir, outputFile)}`)
}

generate().catch((error) => {
  console.error('API generation failed:', error)
  process.exit(1)
})
