<script>
    export let text = 'Hello';
</script>

<button on:click>{text}</button>

<style>
    button {
        user-select: none;
    }
</style>