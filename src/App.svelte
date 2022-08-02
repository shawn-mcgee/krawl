<script lang='ts'>
  import { SvelteUIProvider, Card, Grid, Stack } from '@svelteuidev/core'
  import Map from './common/svelte/Map.svelte'
  import Map2, {BREWS} from './common/svelte/Map2.svelte';
  import Itinerary from './common/svelte/Itinerary.svelte';

  import * as Brewery from './common/script/Brewery'

  let _brews

  function update(event) {
    const location = event.detail
    _brews=undefined
    Brewery.get(location).then((brews) => {
      _brews = brews
      BREWS(location, brews)
    })
  }
</script>

<SvelteUIProvider withGlobalStyles withNormalizeCSS themeObserver='light'>
  <Grid cols={3} override={{width: '100vw', height: '100vh'}}>
    <Grid.Col span={1} override={{'max-height':'100vh', 'overflow-y':'auto'}}>
        <Itinerary brews={_brews}/>
    </Grid.Col>
    <Grid.Col span={2} >
        <Map2 on:update={update}/>
    </Grid.Col>
  </Grid>  
</SvelteUIProvider>

