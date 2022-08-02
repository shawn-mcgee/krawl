export async function get(geo, n:number=6,of:number=6) {
    return await fetch(`https://api.openbrewerydb.org/breweries?by_dist=${geo.latitude},${geo.longitude}&per_page=${of}`)
    .then((data) => data.json())
    .then((json) => {
        let a = [ ]
        let b = [ ]
        for(let brew of json)
            a.push(brew)
        while(n > 0) {
            let i = rand(0, a.length)
            b.push(a.splice(i, 1)[0])
            n --
        }
        return b
    })
}

function rand(a, b) {
    a = Math.ceil (a);
    b = Math.floor(b);
    return Math.floor(Math.random() * (b - a) + a);
}