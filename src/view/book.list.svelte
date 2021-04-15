<script>
    import { title, ajax } from "../utils/global.utils.svelte";

    let showCreate = false;

    let ts = Date.now();

    const features = {
        map: "地图",
        skill: "技能",
        item: "物品",
    };

    let params = {
        features: []
    };

    const url = "http://localhost:7501/books";

    const createCancel = () => {
        showCreate = false;
        Object.keys(params).forEach((key) => {
            delete params[key];
        })
        params.features = [];
        ts = Date.now();
    };
    const createBook = (e) => {
        e.preventDefault();
        if(!params.unique || !params.title) {
            return alert('【故事的全局ID】和【给故事取个名字】必须填写');
        }
        ajax(['post', url, (params || {})])
            .then(createCancel)
            .catch(e => { alert(e.message) });
    };
    const deleteBook = (_id) => {
        ajax(['delete', `${url}/${_id}`])
            .then(createCancel)
            .catch(e => { alert(e.message) });
    };
</script>

<svelte:head>
    <title>{title("全部故事")}</title>
</svelte:head>

<div class="books-view">
    <div class="toolbar">
        <button disabled={showCreate} on:click={() => (ts = Date.now())}>查询</button>
        <button disabled={showCreate} on:click={() => (showCreate = true)}>新增故事</button>
    </div>
    {#key ts}
        {#await ajax(['get', url])}
            <p>数据加载中……</p>
        {:then rows}
            <table class="book-list">
                <thead>
                    <th width="10%">ID</th>
                    <th width="10%">标题</th>
                    <th width="10%">特征</th>
                    <th width="10%">备注</th>
                    <th width="10%">操作</th>
                </thead>
                <tbody>
                    {#each rows as row, index}
                        {#if params['_id'] !== row['_id']}
                            <tr data-row-index={index}>
                                <td>
                                    <a href="/books/{ row.unique }" alt="书本详情">{ row.unique }</a>
                                </td>
                                <td>{ row.title }</td>
                                <td>
                                    <div class="features">
                                        {#each (row.features || []) as feature, i }
                                            <span class="feature">{features[feature]}</span>
                                        {/each}
                                    </div>
                                </td>
                                <td>{ row.summary }</td>
                                <td>
                                    <button on:click={ () => { params = row; showCreate = true; } }>修改</button>
                                    <button on:click={ () => deleteBook(row._id) }>删除</button>
                                </td>
                            </tr>
                        {/if}
                    {/each}
                    {#if showCreate}
                        <tr>
                            <td>
                                <input type="text" placeholder="英语名称" bind:value={params.unique}>
                            </td>
                            <td>
                                <input type="text" placeholder="中文名称" bind:value={params.title}>
                            </td>
                            <td>
                                {#each Object.entries(features) as [key, value], i }
                                    <label for={key}>
                                        <input id={key} type="checkbox" value={key}  bind:group={params.features} />
                                        <span>{value}</span>
                                    </label>
                                {/each}
                            </td>
                            <td>
                                <input type="text" placeholder="书本描述" bind:value={params.summary} />
                            </td>
                            <td>
                                <button on:click={createBook}>保存</button>
                                <button on:click={createCancel}>取消</button>
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        {:catch error}
            <p>数据加载出错：{error.message}</p>
        {/await}
    {/key}
</div>
<style>
    .book-list {
        margin: 10px 0;
        width: 100%;
        border-collapse: collapse;
    }
    .book-list, .book-list td, .book-list th {
        padding: 5px;
        border: 1px solid black;
        text-align: left;
        line-height: 24px;
    }
    .book-list .features .feature {
        margin: 0 3px;
        padding: 3px 5px;
        font-size: 12px;
        border: 1px solid #cfcfcf;
        border-radius: 3px;
        user-select: none;
    }
</style>
