import { EMAIL_PATTERN, PHONE_PATTERN } from '~/constants/validation'

/** Demonstration field checks shared by the forms; the real rules come from the backend */

const compact = (value: string) => value.replace(/\s+/g, '')

/** At least a first and a last name */
export const isFullName = (value: string) => value.trim().split(/\s+/).filter(Boolean).length >= 2

/** Uzbek mobile number, spaces allowed: +998 90 123 45 67 */
export const isPhone = (value: string) => PHONE_PATTERN.test(compact(value))

/** Empty is fine: the address is optional wherever this is used */
export const isOptionalEmail = (value: string) => !value.trim() || EMAIL_PATTERN.test(value.trim())

export const hasMinLength = (value: string, min: number) => value.trim().length >= min

/** Phone number as a tel: link target */
export const toTelHref = (phone: string) => `tel:${compact(phone)}`
