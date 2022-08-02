import type { CountryCode } from "libphonenumber-js"

export type Location = {
    ISO : CountryCode,
    latitude : string | number,
    longitude: string | number,
}

export function get() {
    return new Promise(async (RESOLVE, REJECT) => {
        if('geolocation' in navigator)
            navigator.geolocation.getCurrentPosition(
                async (location) => {
                    RESOLVE(await ll2Geo(
                        location.coords.latitude,
                        location.coords.longitude
                    ))
                },
                async (error) => {
                    console.warn('[Location.GET] Geolocation is unavailable, defaulting to ip-geo')
                    RESOLVE(await ip2Geo())
                })
        else {
            console.warn('[Location.GET] Geolocation is unavailable, defaulting to ip-geo')
            RESOLVE(await ip2Geo())
        }
    })
}

export async function ip2Geo(ip?:string) : Promise<Location> {
    const url = ip ?
        `https://get.geojs.io/v1/ip/geo/${ip}.json` :
        `https://get.geojs.io/v1/ip/geo.json`       ;
    return await fetch(url)
    .then((data) => data.json())
    .then((json) => {
        return {
            ISO: json.country_code?.toUpperCase(),
            latitude : json.latitude,
            longitude: json.longitude
        }
    })
}

export async function ll2Geo(lat:number, lng:number) : Promise<Location> {
    const url = `https://nominatim.openstreetmap.org/reverse` +
    `?format=json`  +
    `&lat=${ lat }` +
    `&lon=${ lng }` ;

    return await fetch(url)
    .then((data) => data.json())
    .then((json) => {
        return {
            ISO: json.address.country_code?.toUpperCase(),
            latitude : lat,
            longitude: lng
        }
    });
}