<script>
    import { getContext } from "svelte";

    export let title = "undefined";

    const id = getContext("items:createIndex")();

    const activedItem = getContext("items:active");

    $: active = $activedItem === id;
</script>

<div class="collapse-child" class:active data-child-index={id}>
    <div class="title" on:click={() => activedItem.set(id)}>
        <span>{title}</span>
    </div>
    <div class="body">
        <slot />
    </div>
</div>

<style>
    .collapse-child {
        border-bottom: 1px solid #d9d9d9;
    }
    .collapse-child .title {
        text-indent: 6px;
        line-height: 30px;
        cursor: pointer;
        user-select: none;
    }
    .collapse-child .body {
        display: none;
        padding: 10px;
    }
    .collapse-child.active .body {
        display: block;
        border-top: 1px solid #d9d9d9;
    }
</style>
