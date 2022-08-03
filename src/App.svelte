<script lang='ts'>
  import { SvelteUIProvider, Card, Grid, Stack } from '@svelteuidev/core'
  import Map from './common/svelte/Map.svelte'
  import Itinerary from './common/svelte/Itinerary.svelte'

  import { BREWS_ARRAY, BREWS_INDEX, insert, remove } from './common/script/store/Brews'

  import * as Brewery from './common/script/Brewery'

  function update(event) {
    const location = event.detail
    
    $BREWS_ARRAY = [ ]
    $BREWS_INDEX = - 1
    
    Brewery.get(location).then((brews) => {
      $BREWS_ARRAY = brews
    })
  }
</script>

<SvelteUIProvider withGlobalStyles withNormalizeCSS themeObserver='light'>
  <Grid cols={3} override={{width: '100vw', height: '100vh'}}>
    <Grid.Col span={1} override={{'max-height':'100vh', 'overflow-y':'auto'}}>
        <Itinerary/>
    </Grid.Col>
    <Grid.Col span={2} >
        <Map on:update={update}/>
    </Grid.Col>
  </Grid>  
</SvelteUIProvider>

