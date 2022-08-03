<script lang='ts'>
    import { ActionIcon, Button, Card, Center, Grid, Group, Loader, Space, Stack, Text, Title } from '@svelteuidev/core'
    import {BREWS_ARRAY, BREWS_INDEX} from '../script/store/Brews'
    import * as Phone from '../script/Phone'
</script>

{#if $BREWS_ARRAY.length <= 0}
    <Center override={{height:'100%'}}>
        <Loader variant='dots'/>
    </Center>
{:else}
    <Stack overflow={{margin:'0, 12, 0, 12'}}>
        {#each $BREWS_ARRAY as brew, id}
            <Card shadow='xl' override={{padding:'32px'}}>
                <Card.Section first>
                    <Button fullSize on:click={() => $BREWS_INDEX = id} color='blue' variant={$BREWS_INDEX==id?'gradient':'subtle'} gradient={{from:'orange', to:'pink', deg:105}}>
                        <Title order={4}>
                            <b>{brew.name}</b>
                        </Title>
                    </Button>
                </Card.Section>
                <Space h='md'/>
                <Card.Section>
                    {#if brew.street   }<Text size='lg' weight='semibold'>{brew.street   }</Text>{/if}
                    {#if brew.address_2}<Text size='lg' weight='semibold'>{brew.address_2}</Text>{/if}
                    {#if brew.address_3}<Text size='lg' weight='semibold'>{brew.address_3}</Text>{/if}
                    {#if brew.city || brew.state}
                        <Text size='lg' weight ='semibold'>
                            {#if brew.city              }{brew.city }{/if}
                            {#if brew.city && brew.state},{/if}
                            {#if brew.state             }{brew.state}{/if}
                        </Text>
                    {/if}
                    <Space h='xs'/>
                    <Grid cols={9}>
                        <Grid.Col span={1}>
                        {#if brew.phone       }<Text align='right'>Phone</Text>{/if}
                        {#if brew.website_url }<Text align='right'>  Web</Text>{/if}
                        </Grid.Col>
                        <Grid.Col span={8}>
                            {#if brew.phone      }<Text color='orange'>{Phone.format(brew.phone, brew.location)}</Text>{/if}
                            {#if brew.website_url}<Text color='pink' on:click={()=> window.open(brew.website_url)}>{brew.website_url}</Text>{/if}
                        </Grid.Col>
                    </Grid>
                </Card.Section>
            </Card>
        {/each}
    </Stack>
{/if}

<style>
    .card {
        padding: 8px 8px 8px 8px
    }
</style>



