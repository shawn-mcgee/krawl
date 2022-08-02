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
            <Card>
                <div class='card'>
                    <Card.Section first>
                        <Button fullSize on:click={() => $BREWS_INDEX = id} variant={$BREWS_INDEX==id?'gradient':'outline'}>
                            <Title order={4}>
                                <b>{brew.name}</b>
                            </Title>
                        </Button>                        
                    </Card.Section>
                    <Space h='xs'/>
                    {#if brew.street   }<Text size='lg'>{brew.street   }</Text>{/if}
                    {#if brew.address_2}<Text size='lg'>{brew.address_2}</Text>{/if}
                    {#if brew.address_3}<Text size='lg'>{brew.address_3}</Text>{/if}
                    {#if brew.city || brew.state}
                        <Text size='lg'>
                            {#if brew.city              }{brew.city }{/if}
                            {#if brew.city && brew.state},{/if}
                            {#if brew.state             }{brew.state}{/if}
                        </Text>
                    {/if}
                    <Space h='xs'/>
                    <Grid cols={6}>
                        <Grid.Col span={1}>
                        {#if brew.phone       }<Text>Phone:</Text>{/if}
                        {#if brew.website_url }<Text>Web:</Text>{/if}
                        </Grid.Col>
                        <Grid.Col span={5}>
                            {#if brew.phone      }<Text>{Phone.format(brew.phone, brew.location)}</Text>{/if}
                            {#if brew.website_url}<a href={brew.website_url}><Text>{brew.website_url}</Text></a>{/if}
                        </Grid.Col>
                    </Grid>
                </div>
            </Card>
        {/each}
    </Stack>
{/if}

<style>
    .card {
        padding: 8px 8px 8px 8px
    }

    .card.selected {
        background-color: white;
    }

</style>



