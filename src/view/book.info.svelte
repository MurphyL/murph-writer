<script>
    import { getTopFeatures, getFeatureComponent } from "../plug/book/features.plug.svelte";
    import { ajax } from "../utils/global.utils.svelte";

    export let unique;
    export let feature = 'editor';

</script>

<div class="book-info">
    {#await ajax(['get', `/books/${unique}`])}
        <p>数据加载中……</p>
    {:then book}
        <header class="navi">
            <div class="breadcrumb">
                <a href="/books">列表</a>
                <span>/</span>
                <a href="/books/{unique}">{book.title || '未命名书籍'}</a>
            </div>
            <div class="features">
                {#each getTopFeatures(book.features) as { unique: key, shortname }}
                    <a href="/books/{unique}/{key}" class:active={feature === key}>{shortname}</a>
                {/each}
            </div>
        </header>
        <div class="board">
            <div class="tab-body">
                <svelte:component this={getFeatureComponent(feature)} book={book}/>
            </div>
        </div>
    {:catch error}
        <p>数据加载出错：{error.message}</p>
    {/await}
</div>

<style>
    .book-info {
        height: 100%;
    }
    .book-info .navi {
        display: flex;
        padding: 5px;
        line-height: 30px;
    }
    .book-info .navi .features {
        flex: 1;
        text-align: right;
    }
    .book-info .navi .features a {
        padding: 0 10px;
    }
    .book-info .board {
        padding: 10px;
    }
</style>