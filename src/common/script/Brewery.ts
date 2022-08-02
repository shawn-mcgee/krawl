export async function get(geo, n:number=6) {
    return await fetch(`https://api.openbrewerydb.org/breweries?by_dist=${geo.latitude},${geo.longitude}&per_page=${n}&by_type=brewpub`)
    .then((data) => data.json())
    .then((json) => {
        return json
    })
}