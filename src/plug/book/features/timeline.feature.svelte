<script>
    export let book = {};
</script>

<svelte:head>
    <title>{`时间线 - ${book.title || '未命名书籍'} - 书本详情`}</title>
</svelte:head>

<div class="timeline">
    <span>时间线</span>
</div>