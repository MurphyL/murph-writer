<script context="module">
    export const definitions = {
        unique: "editor",
        tab: true,
        shortname: "创作",
        sort: 1000,
        top: true,
    };
</script>

<script>
    export let book = {};
</script>

<svelte:head>
    <title>{`基础信息 - ${book.title || "未命名书籍"} - 书本详情`}</title>
</svelte:head>

<div class="editor">
    <div class="instance"></div>
    <div class="files"></div>
</div>

<style>
    .editor {
        display: flex;
        min-height: 300px;
        height: 100%;;
        border: 1px solid #cfcfcf;
    }
    .editor .instance {
        flex: 1;
    }
    .editor .files {
        border-left: 1px solid #cfcfcf;
        width: 300px;
    }
</style>
