<script context="module">
    export const definitions = {
        unique: "item",
        tab: true,
        shortname: "物品",
        sort: 4000,
    };
</script>

<script>
    export let book = {};
</script>

<svelte:head>
    <title>{`物品 - ${book.title || "未命名书籍"} - 书本详情`}</title>
</svelte:head>

<div class="item">
    <span>物品</span>
</div>
