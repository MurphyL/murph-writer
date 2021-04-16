<script context="module">
    export const definitions = {
        unique: "help",
        tab: true,
        shortname: "帮助",
        sort: 9000,
        top: true,
    };
</script>

<script>
    export let book = {};
</script>

<svelte:head>
    <title>{`帮助 - ${book.title || "未命名书籍"} - 书本详情`}</title>
</svelte:head>

<div class="info">
    <div>帮助</div>
</div>
