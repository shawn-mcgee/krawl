<script lang='ts'>
    import { Card, Center, Loader, Space, Stack, Text, Title } from '@svelteuidev/core'
    import * as Phone from '../script/Phone'

    export let brews
</script>

{#if !brews}
    <Center override={{height:'100%'}}>
        <Loader variant='dots'/>
    </Center>
{:else}
    <Stack overflow={{margin:'0, 12, 0, 12'}}>
        {#each brews as brew}
            <Card>
                <Card.Section first>
                    <Title order={3}><b>{brew.name}</b></Title>
                </Card.Section>
                <Space h='sm'/>
                {#if brew.street   }<Text><em>{brew.street   }</em></Text>{/if}
                {#if brew.address_2}<Text><em>{brew.address_2}</em></Text>{/if}
                {#if brew.address_3}<Text><em>{brew.address_3}</em></Text>{/if}
                <Space h='xs'/>
                {#if brew.phone    }<Text>{Phone.format(brew.phone, brew.location)}</Text>{/if}
            </Card>
        {/each}
    </Stack>
{/if}



