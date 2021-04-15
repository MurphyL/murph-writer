<script>
    export let book = {};
</script>

<svelte:head>
    <title>{`基础信息 - ${book.title || '未命名书籍'} - 书本详情`}</title>
</svelte:head>

<div class="info">
    <pre>
        <code>{ JSON.stringify(book, null, '  ') }</code>
    </pre>
</div>