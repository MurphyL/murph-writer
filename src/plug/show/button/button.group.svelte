<script>
    import Button from './button.plug.svelte';
    export let items;
</script>

<div class="button-group">
    {#if items && Array.isArray(items) && items.length> 0}
        {#each items as {click, ...props}}
            {#if click}
                <Button {...props} on:click={click} />
            {:else}
                <Button {...props} />
            {/if}
            
        {/each}
    {/if}
</div>

<style>
    .button-group :global(button) {
        margin: 0 3px;
    }
</style>

