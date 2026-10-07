/** Demonstration input formats shared by the forms; the real rules come from the backend */

/** Uzbek mobile number without spaces: +998901234567 */
export const PHONE_PATTERN = /^\+998\d{9}$/
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PASSWORD_MIN_LENGTH = 8
