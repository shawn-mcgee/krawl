import type { Location } from "./Location"

export async function get(location: Location, n:number=6,of:number=6) {
    return await fetch(`https://api.openbrewerydb.org/breweries?by_dist=${location.latitude},${location.longitude}&per_page=${of}`)
    .then((data) => data.json())
    .then((json) => {
        let a = [ ]
        let b = [ ]
        for(let brew of json)
            a.push({...brew, location: {
                ISO: location.ISO,
                latitude : brew.latitude ,
                longitude: brew.longitude,
            }})
        while(n > 0) {
            let i = next(0, a.length)
            b.push(a.splice(i, 1)[0])
            n --
        }
        return b
    })
}

function next(a, b) {
    return a; // ignore randomness for now
    // a = Math.ceil (a);
    // b = Math.floor(b);
    // return Math.floor(Math.random() * (b - a) + a);
}