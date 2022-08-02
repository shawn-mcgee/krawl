import { writable, get } from 'svelte/store'
export const BREWS_ARRAY = writable([ ])
export const BREWS_INDEX = writable(- 1)

export function insert(brew, at=get(BREWS_INDEX)) {
    const brews = get(BREWS_ARRAY)
    if(at >= 0) {
        brews.splice(at, 0, brew)
        BREWS_ARRAY.set(  brews )
    }
}

export function remove(brew, at=get(BREWS_INDEX)) {
    const brews = get(BREWS_ARRAY)
    if(brew)
        at = brews.indexOf(brew)
    if(at >= 0) {
        brews.splice( at , 1 )
        BREWS_ARRAY.set(brews)
    }
}
