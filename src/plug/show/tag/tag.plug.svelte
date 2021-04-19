<script>
    export let text = "？";
    export let url = null;
</script>

{#if url}
    <a class="tag" href={url}>{text}</a>    
{:else}
    <span class="tag">{text}</span>    
{/if}

<style>
    .tag {
        margin: 0 3px;
        padding: 3px 5px;
        font-size: 12px;
        border: 1px solid #cfcfcf;
        border-radius: 3px;
        user-select: none;
        text-decoration: none;
    }
</style>
