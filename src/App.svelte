<script lang='ts'>

  import { SvelteUIProvider } from '@svelteuidev/core'

  import * as Location from './common/Location'
  import * as L from 'leaflet'

  let map;

  Location.get().then((geo: any) => {
    const _map = L.map(map).setView([geo.latitude, geo.longitude], 18)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(_map);

    L.marker([geo.latitude, geo.longitude]).addTo(_map)

    fetch(`https://api.openbrewerydb.org/breweries?by_dist=${geo.latitude},${geo.longitude}&per_page=50`)
    .then((data) => data.json())
    .then((json) => {
      for(let brew of json) {
        L.marker([brew.latitude, brew.longitude]).addTo(_map)
      }
      
    })
  })

</script>

<SvelteUIProvider withGlobalStyles withNormalizeCSS themeObserver='dark'>
  <div id='map' bind:this={map}/>
</SvelteUIProvider>

<style>
  #map {
    height: 100vh;
  }
</style>

