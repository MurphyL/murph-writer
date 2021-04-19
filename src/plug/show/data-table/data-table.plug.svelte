<script context="module">
    import pathGet from "lodash/get";
</script>

<script>
    export let cols = [];
    export let rows = [];
</script>

<table class="data-table">
    <thead>
        {#each cols as col, ci}
            <th width="10%" data-column-index={ci}
                >{col.label || "未命名字段"}</th
            >
        {/each}
    </thead>
    <tbody>
        {#if rows.length === 0}
            <tr>
                <td colspan={cols.length}>
                    <div>暂无数据</div>
                </td>
            </tr>
        {:else}
            {#each rows as row, ri}
                <tr data-row-index={ri}>
                    {#each cols as { path, events, ...col }, ci}
                        <td data-column-index={ci} data-path={path}>
                            {#if col.component}
                                <svelte:component this={col.component} {...col.props(pathGet(row, path) || row, row)}/>
                            {:else}
                                {pathGet(row, path, "")}
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        {/if}
    </tbody>
</table>

<style>
    .data-table {
        margin: 10px 0;
        width: 100%;
        border-collapse: collapse;
    }
    .data-table,
    .data-table thead th,
    .data-table tbody td {
        padding: 5px;
        border: 1px solid black;
        text-align: left;
        line-height: 24px;
    }
</style>
