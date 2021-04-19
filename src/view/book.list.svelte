<script>
    import { title, ajax } from "../utils/global.utils.svelte";

    import { getSampleFeatures } from '../plug/book/features.plug.svelte';

    import Loading from '../plug/extra/loading.plug.svelte';

    import Link from '../plug/show/link/link.plug.svelte';
    import Error from '../plug/show/error/error.plug.svelte';
    import TagGroup from '../plug/show/tag/tag.group.svelte';
    import DataTable from '../plug/show/data-table/data-table.plug.svelte';
    import ButtonGroup from '../plug/show/button/button.group.svelte';

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
        ajax(['post', '/books', (params || {})])
            .then(createCancel)
            .catch(e => { alert(e.message) });
    };
    const deleteBook = (_id) => {
        ajax(['delete', `/books/${_id}`])
            .then(createCancel)
            .catch(e => { alert(e.message) });
    };

    const columns = [
        {
            label: '标题', 
            path: 'title',
            component: Link,
            props: (value, { unique }) => {
                return { text: value, url: `/books/${unique}` };
            }
        }, 
        {
            label: '可选特征', 
            path: 'features', 
            component: TagGroup,
            props: (values) => { 
                return { 
                    items: values.map(item => ({ 
                        text: features[item], url: `/features/${item}` 
                    }))
                };
            }
        }, 
        {label: '备注', path: 'summary'}, 
        {
            label: '操作',
            component: ButtonGroup,
            props: (values, { unique }) => {
                return { items: [{
                    text: '编辑',
                    click: (e) => { console.log('edit', unique, e); }
                }, {
                    text: '删除',
                    click: () => { deleteBook(unique); }
                }] };
            }
        }
    ];
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
        {#await ajax(['get', '/books'])}
            <Loading message="正在加载故事列表……" />
        {:then rows}
            <DataTable cols={columns} rows={rows || []} />
        {:catch error}
            <Error {error} />
        {/await}
    {/key}
</div>
<style>
    .books-view {
        margin: 10px;
        height: calc(100% - 10px * 2);
    }
</style>
