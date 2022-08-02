import parsePhoneNumber from 'libphonenumber-js/max'

export function format(phone, geo) {
    return parsePhoneNumber(phone, geo.country.toUpperCase()).formatInternational()
}