<script lang='ts'>
    import * as Phone    from '../script/Phone'
    import * as Brewery  from '../script/Brewery'
    import * as Location from '../script/Location'

    import { onMount } from 'svelte'
    
    import * as L from 'leaflet'
    import 'phosphor-icons'
    import { Grid, Header,  Card, Loader, Center, Text, Title, AppShell, Space } from '@svelteuidev/core';

    let div

    let MAP
    let HOME
    let MARKERS

    let BREWS

    onMount(() => {
        MAP = L.map(div).setView([0, 0], 10)

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(MAP)

        HOME    = L.marker([1, 1], {draggable:true, autoPan:true}).addTo(MAP)
        MARKERS = L.layerGroup()                                  .addTo(MAP)

        HOME._icon.classList.add('home')
        HOME.bindTooltip('<i class="ph-house"></i><b> Start</b>')

        Location.get().then((geo : any) => {
            HOME.setLatLng([geo.latitude, geo.longitude]    )
            MAP .setView  ([geo.latitude, geo.longitude], 15)
            update(MAP, HOME, MARKERS, geo)
        })

        HOME.on('moveend', async (event) => {
            const geo = await Location.ll2Geo(
                HOME.getLatLng().lat,
                HOME.getLatLng().lng
            )
            //HOME.setLatLng(HOME.getLatLng())
            // MAP.flyTo     (HOME.getLatLng())
            update(MAP, HOME, MARKERS, geo)
        })

        MAP.on('click', async (event) => {
            const geo = await Location.ll2Geo(
                event.latlng.lat,
                event.latlng.lng
            ).then()
            HOME.setLatLng(event.latlng)
            // MAP.flyTo     (event.latlng)
            update(MAP, HOME, MARKERS, geo)
        })
    })

    function update(MAP:L.Map, HOME:L.Marker, MARKERS:L.LayerGroup, geo:any) {
        MARKERS.clearLayers()

        let bounds = L.latLngBounds(
            HOME.getLatLng(),
            HOME.getLatLng()
        )

        Brewery.get(geo).then((brews) => {
            BREWS = undefined
            for(let brew of brews) {
                brew.geo = {
                    country: geo.country,
                    latitude : brew.latitude ,
                    longitude: brew.longitude,
                }

                const marker = L.marker([
                    brew.latitude ,
                    brew.longitude
                ]).addTo(MARKERS)

                bounds.extend([
                    brew.latitude ,
                    brew.longitude
                ])

                const tooltip = marker.bindTooltip(
                    `<b>${brew.name}</b>` + 
                    (brew.street    ? `<br/><em>${brew.street   }</em>` : '') +
                    (brew.address_2 ? `<br/><em>${brew.address_2}</em>` : '') +
                    (brew.address_3 ? `<br/><em>${brew.address_3}</em>` : '') +
                    (brew.phone ? `<br/>${Phone.format(brew.phone, geo)}` : '')
                )

                const popup = marker.bindPopup(
                    `<b>${brew.name}</b>` +  
                    (brew.street    ? `<br/><em>${brew.street   }</em>` : '') +
                    (brew.address_2 ? `<br/><em>${brew.address_2}</em>` : '') +
                    (brew.address_3 ? `<br/><em>${brew.address_3}</em>` : '') +
                    (brew.phone     ? `<br/>${Phone.format(brew.phone, geo)}` : '') +
                    (brew.website_url ? `<br/><iframe width=300 height=640 src="${brew.website_url}"/>` : '')
                )
            }
            MAP.flyToBounds(bounds)
            BREWS = brews
        })
    }
    
</script>

<AppShell>
    <Header slot="header" height={60} override={{ p: '$mdPX' }}>
		<Title>KRAWL</Title>
	</Header>
    <Grid cols={3}>
        <Grid.Col span={1}>
            {#if !BREWS}
                <Center override={{height: '100vh'}}>
                    <Loader variant='dots' size='xl'/>
                </Center>
            {:else}
                {#each BREWS as brew}
                <Card>
                    <Title order={3}>
                        <b on:click={()=>window.open(brew.website_url)}>{brew.name}</b>
                    </Title>
                    <Space h='sm'/>
                    {#if brew.street   }<Text><em>{brew.street   }</em></Text>{/if}
                    {#if brew.address_2}<Text><em>{brew.address_2}</em></Text>{/if}
                    {#if brew.address_3}<Text><em>{brew.address_3}</em></Text>{/if}
                    <Space h='xs'/>
                    {#if brew.phone    }<Text>{Phone.format(brew.phone, brew.geo)}</Text>{/if}
                </Card>
                <Space h='md'/>
                    
                {/each}
            {/if}
        </Grid.Col>
        <Grid.Col span={2}>
            <div id='map' bind:this={div}/>
        </Grid.Col>
    </Grid>
    
</AppShell>





<style>
    #map {
        height: calc(100vh - 100px);/*512px;*/
    }
    :global(img.home) { filter: hue-rotate(120deg); }
</style>

