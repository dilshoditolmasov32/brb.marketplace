/** Steps of the installment application, in order. Labels: application.steps.<key> */
export const APPLICATION_STEPS = [
  'product',
  'details',
  'documents',
  'review',
  'confirmation',
] as const

/** Demonstration format; the real rule comes from the backend */
export const APPLICATION_DOCUMENT_PATTERN = /^[A-Z]{2}\d{7}$/
