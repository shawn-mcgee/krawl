import parsePhoneNumber from 'libphonenumber-js/max'
import type { Location } from './Location'

export function format(phone: string, location: Location) {
    return parsePhoneNumber(phone, location.ISO).formatNational().replaceAll(' ','-')
}