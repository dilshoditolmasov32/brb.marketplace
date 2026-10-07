// @ts-check
import prettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({ ignores: ['app/api/apiMethods*.ts'] }, prettier, {
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'vue/no-v-html': 'error',
    // Colors come from design tokens only, e.g. bg-primary instead of bg-[#e52716]
    'vue/no-restricted-class': ['error', '/\\[#[0-9a-fA-F]{3,8}\\]/'],
  },
})
