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

export async function ip2Geo(ip?:string) {
    const url = ip ?
        `https://get.geojs.io/v1/ip/geo/${ip}.json` :
        `https://get.geojs.io/v1/ip/geo.json`       ;
    return await fetch(url)
    .then((data) => data.json())
    .then((json) => {
        return {
            country: json.country_code,
            latitude : json.latitude,
            longitude: json.longitude
        }
    })
}

export async function ll2Geo(lat:number, lon:number) {
    const url = `https://nominatim.openstreetmap.org/reverse` +
    `?format=json`  +
    `&lat=${ lat }` +
    `&lon=${ lon }` ;

    return await fetch(url)
    .then((data) => data.json())
    .then((json) => {
        return {
            country: json.address.country_code,
            latitude : lat,
            longitude: lon
        }
    });
}