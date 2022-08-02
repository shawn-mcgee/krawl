<script lang='ts'>
  import { SvelteUIProvider } from '@svelteuidev/core'
  import Map from './common/svelte/Map.svelte'
</script>

<SvelteUIProvider withGlobalStyles withNormalizeCSS themeObserver='light'>
  <Map/>
</SvelteUIProvider>

