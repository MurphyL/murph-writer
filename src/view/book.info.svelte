<script context="module">
    const url = "http://localhost:7501/books";

    const [ NAME, COMPONENT ] = [ 0, 1 ];

    const features = {
        info: ["信息", Info],
        map: [ "地图", Map ],
        skill: [ "技能",  Skill ],
        item: [ "物品", Item ],
    };
</script>

<script>
    import { ajax } from "../utils/global.utils.svelte";

    import Info from '../plug/book/features/info.feature.svelte';
    import Item from '../plug/book/features/item.feature.svelte';
    import Map from '../plug/book/features/map.feature.svelte';
    import Skill from '../plug/book/features/skill.feature.svelte';

    export let unique;
    export let feature = 'info';
</script>

<div class="book-info">
    {#await ajax(['get', `${url}/${unique}`])}
        <p>数据加载中……</p>
    {:then book}
        {#if features[feature]}
            <header class="navi">
                <div class="breadcrumb">
                    <a href="/books">列表</a>
                    <span>/</span>
                    <a href="/books/{unique}">{book.title || '未命名书籍'}</a>
                    <span>/</span>
                    <span>{features[feature][NAME]}</span>
                </div>
                <div class="features">
                    <a href="/books/{unique}/info" class:active={feature === 'info'}>{features['info'][NAME]}</a>
                    {#each (book.features || []) as key}
                        <a href="/books/{unique}/{key}" class:active={feature === key}>{features[key][NAME]}</a>
                    {/each}
                </div>
            </header>
            <div class="board">
                <div class="tab-body">
                    <svelte:component this={features[feature][COMPONENT]} book={book}/>
                </div>
            </div>
        {:else}
            <div>出错了？ feature = {feature}</div>
        {/if}
    {:catch error}
        <p>数据加载出错：{error.message}</p>
    {/await}
</div>

<style>
    .book-info .navi {
        display: flex;
        line-height: 30px;
    }
    .book-info .navi .features {
        flex: 1;
        text-align: right;
    }
    .book-info .navi .features a {
        padding: 0 10px;
    }
</style>