<script context="module">
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import Child from "./collapse.child.svelte";

    export const CollapseItem = Child;
</script>

<script>
    export let active = 0;
    let num = 0;

    const activedItem = writable(active);
    setContext("items:active", activedItem);
    setContext("items:createIndex", () => num++);
    
    $: active = $activedItem;
</script>

<div class="collapse-plug" data-active-index={active}>
    <slot />
</div>

<style>
    .collapse-plug {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
    }
    .collapse-plug :global(.collapse-child:last-child) {
        border-bottom: none;
    }
</style>
