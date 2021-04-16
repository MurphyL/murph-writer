<script context="module">
    export const definitions = {
        unique: "map",
        tab: true,
        shortname: "地图",
        sort: 3000,
    };
</script>

<script>
    export let book = {};
</script>

<svelte:head>
    <title>{`地图 - ${book.title || "未命名书籍"} - 书本详情`}</title>
</svelte:head>

<div class="map">
    <span>地图</span>
</div>
