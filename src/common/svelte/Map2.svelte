<script context='module'>
    import { writable, get } from 'svelte/store'
    import * as Phone from '../script/Phone'
    import * as L from 'leaflet'
    import 'phosphor-icons'

    const MAP     = writable()
    const START   = writable()
    const MARKERS = writable()

    export async function BREWS(location, brews) {
        get(MARKERS).clearLayers()

        get(START).setLatLng([
            location.latitude ,
            location.longitude,
        ])

        let BOUNDS = L.latLngBounds(
            get(START).getLatLng(),
            get(START).getLatLng()
        )

        for(let brew of brews) {
            const marker = L.marker([
                brew.latitude ,
                brew.longitude
            ]).addTo(get(MARKERS))

            BOUNDS.extend([
                brew.latitude ,
                brew.longitude
            ])

            _tooltip(marker, brew)
            _popup  (marker, brew)
        }

        get(MAP).flyToBounds(BOUNDS)
    }

    function _tooltip(marker, brew) {
        marker.bindTooltip(
            `<b>${brew.name}</b>` + 
            (brew.street    ? `<br/><em>${brew.street   }</em>` : '') +
            (brew.address_2 ? `<br/><em>${brew.address_2}</em>` : '') +
            (brew.address_3 ? `<br/><em>${brew.address_3}</em>` : '') +
            (brew.phone ? `<br/>${Phone.format(brew.phone, brew.location)}` : '')
        )
    }

    function _popup  (marker, brew) {
        marker.bindPopup(
            `<b>${brew.name}</b>` +  
            (brew.street    ? `<br/><em>${brew.street   }</em>` : '') +
            (brew.address_2 ? `<br/><em>${brew.address_2}</em>` : '') +
            (brew.address_3 ? `<br/><em>${brew.address_3}</em>` : '') +
            (brew.phone     ? `<br/>${Phone.format(brew.phone, brew.location)}` : '')
            // (brew.website_url ? `<br/><iframe width=300 height=640 src="${brew.website_url}"/>` : '')
        )
    }

</script>

<!-- Too much jank with svelte stores going on here for TypeScript to keep up -->
<script>
    import { onMount, createEventDispatcher } from 'svelte'
    import * as Location from '../script/Location'

    const dispatch = createEventDispatcher()

    let div

    onMount(_init)

    function _init() {
        MAP.set(L.map(div).setView([0, 0], 0))

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(get(MAP))

        START  .set(L.marker([0, 0], {draggable:true, autoPan:true}).addTo(get(MAP)))
        MARKERS.set(L.layerGroup()                                  .addTo(get(MAP)))

        // stack overflow hack to recolor marker
        get(START)._icon.classList.add('start')
        get(START).bindTooltip('<i class="ph-house"></i><b> Start</b>')

        Location.get().then((location) => {
            get(START).setLatLng([location.latitude, location.longitude]    )
            get(MAP  ).setView  ([location.latitude, location.longitude], 10)
            dispatch('update', location)

            get(MAP  ).on('click'  , _onClick)
            get(START).on('moveend', _onDrag )
        })
    }

    function _onClick(event) {
        get(START).setLatLng(event.latlng)
        Location.ll2Geo(
            event.latlng.lat,
            event.latlng.lng
        ).then((location) => dispatch('update', location))
    }

    function _onDrag (event) {
        const latlng = event.target.getLatLng()
        Location.ll2Geo(
            latlng.lat,
            latlng.lng
        ).then((location) => dispatch('update', location))
    }
</script>

<div id='map' bind:this={div}/>

<style>
    #map {
        height: 100%;/*512px;*/
    }
    /* stackoverflow hack to recolor marker */
    :global(img.start) { filter: hue-rotate(120deg); }
</style>