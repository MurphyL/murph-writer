<script context="module">
    export const definitions = {
        unique: "config",
        tab: true,
        shortname: "设置",
        sort: 9000,
        top: true,
    };
</script>

<script>
    export let book = {};
</script>

<svelte:head>
    <title>{`通用设置 - ${book.title || "未命名书籍"} - 书本详情`}</title>
</svelte:head>

<div class="config">
    <div>帮助</div>
</div>
