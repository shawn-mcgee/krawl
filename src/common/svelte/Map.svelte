<script>
    import { onMount, onDestroy, createEventDispatcher } from 'svelte'
    import { BREWS_ARRAY, BREWS_INDEX } from '../script/store/Brews'
    import * as Location from '../script/Location'
    import * as Phone from '../script/Phone'
    import * as L from 'leaflet'
    import 'phosphor-icons'

    const dispatch = createEventDispatcher()

    let mapElement
    let unsubscribeBrewsArray
    let unsubscribeBrewsIndex

    let MAP
    let START
    let SELECTED
    let UNSELECTED

    onMount  (_onMount  )
    onDestroy(_onDestroy)

    function _onMount() {
        MAP = L.map(mapElement).setView([0, 0], 0)

        // use openstreetmap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(MAP)

        // start marker
        START = L.marker([0, 0], {
            draggable:true,
            autoPan  :true
        }).addTo(MAP)

        _recolor(START, 'color0')
        START.bindTooltip('<i class="ph-house"></i><b> Start</b>')

        SELECTED   = L.layerGroup().addTo(MAP)
        UNSELECTED = L.layerGroup().addTo(MAP)

        Location.get().then((location) => {
            START.setLatLng([location.latitude, location.longitude]    )
            MAP  .setView  ([location.latitude, location.longitude], 10)
            dispatch('update', location)

            MAP  .on('click'  , _onClick)
            START.on('moveend', _onDrag )
        })

        unsubscribeBrewsArray = BREWS_ARRAY.subscribe(_onBrewsArrayChanged)
        unsubscribeBrewsIndex = BREWS_INDEX.subscribe(_onBrewsIndexChanged)
    }

    function _onDestroy() {
        unsubscribeBrewsArray()
        unsubscribeBrewsIndex()
    }

    // stack overflow hack to recolor marker ,
    // must implement a css :global(img.color)
    // for each color
    function _recolor(marker, color) {
        marker._icon.classList.add(color)
    }

    function _onBrewsArrayChanged(brewsArray) {
        _update()
    }

    function _onBrewsIndexChanged(brewsIndex) {
        _update()
    }

    function _update() {
        SELECTED  .clearLayers()
        UNSELECTED.clearLayers()
        if($BREWS_ARRAY.length <= 0)
            return;

        const focus = L.latLngBounds(
            START.getLatLng(),
            START.getLatLng()
        )

        let index = 0
        for(let brew of $BREWS_ARRAY) {
            const marker = L.marker([
                brew.location.latitude ,
                brew.location.longitude,
            ])

            const _index = index
            if(index++ == $BREWS_INDEX) {
                marker.addTo(  SELECTED  )
                _recolor(marker, 'color1')
                focus.extend([
                    brew.location.latitude ,
                    brew.location.longitude,
                ])

                _popup(marker, brew).openPopup()
                marker.on('popupclose', () => {
                    if($BREWS_INDEX == _index)
                        $BREWS_INDEX = -1
                })
            } else {
                marker.addTo( UNSELECTED )
                if($BREWS_INDEX < 0) {
                    focus.extend([
                        brew.location.latitude ,
                        brew.location.longitude,
                    ])
                    marker.on('click'     , (event) => {
                        L.DomEvent.stopPropagation(event)
                        $BREWS_INDEX = _index
                    })
                }
                _tooltip(marker, brew)
            }
        }
        MAP.flyToBounds(focus, {padding:[64, 32]})
    }

    function _tooltip(marker, brew) {
        return marker.bindTooltip(
            `<b>${brew.name}</b>` + 
            (brew.street    ? `<br/><em>${brew.street   }</em>` : '') +
            (brew.address_2 ? `<br/><em>${brew.address_2}</em>` : '') +
            (brew.address_3 ? `<br/><em>${brew.address_3}</em>` : '')
            // (brew.phone ? `<br/>${Phone.format(brew.phone, brew.location)}` : '')
        )
    }

    function _popup  (marker, brew) {
        return marker.bindPopup(
            `<b>${brew.name}</b>` +  
            (brew.street    ? `<br/><em>${brew.street   }</em>` : '') +
            (brew.address_2 ? `<br/><em>${brew.address_2}</em>` : '') +
            (brew.address_3 ? `<br/><em>${brew.address_3}</em>` : '')
            // (brew.phone     ? `<br/>${Phone.format(brew.phone, brew.location)}` : '')
            // (brew.website_url ? `<br/><iframe width=300 height=640 src="${brew.website_url}"/>` : '')
            , {
                keepInView  : true ,
                closeOnClick: false,
            }
        )
    }

    function _onClick(event) {
        console.log('click')
        console.log($BREWS_INDEX)
        if($BREWS_INDEX >= 0)
            return;
        START.setLatLng(event.latlng)
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

<div id='map' bind:this={mapElement}/>

<style>
    #map {
        height: 100%;/*512px;*/
    }
    /* stackoverflow hack to recolor marker */
    :global(img.color0) { filter: hue-rotate(150deg); }
    :global(img.color1) { filter: hue-rotate( 90deg); }
</style>