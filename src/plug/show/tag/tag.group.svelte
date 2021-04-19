<script>
    import Tag from './tag.plug.svelte';

    export let items = [];
</script>

{#each items as item}
    <Tag {...item} />
{:else}
    <p>Nothing here!</p>
{/each}

