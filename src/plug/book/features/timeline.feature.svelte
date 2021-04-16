<script context="module">
    export const definitions = {
        unique: "timeline",
        tab: true,
        top: true,
        shortname: "时间线",
        sort: 2000,
    };
</script>

<script>
    import { ajax } from "../../../utils/global.utils.svelte";
    export let book = {};

    let ts = Date.now();

    const save = (e, sort, _id) => {
        if (e.code === "Enter" && e.ctrlKey) {
            e.preventDefault();
            ajax([ "post", "/events", {
                    _id, sort,
                    content: (e.target.textContent || '').trim(),
            }]).then(() => {
                ts = Date.now();
                e.target.blur();
            });
        }
    };
</script>

<svelte:head>
    <title>{`时间线 - ${book.title || "未命名书籍"} - 书本详情`}</title>
</svelte:head>

<div class="timeline">
    {#key ts}
        {#await ajax(["get", `/events`])}
            <div>Loading...</div>
        {:then events}
            {#each events as { _id, content }, index}
                <div class="event saved" contenteditable data-row-index={index + 1} on:keydown={(e) => save(e, index, _id)} bind:textContent={content}/>
            {/each}
            <div contenteditable class="event create" on:keydown={(e) => save(e, events.length)}>创建事件</div>
        {:catch error}
            <div>Error: {error.message}</div>
        {/await}
    {/key}
</div>

<style>
    .timeline .event {
        margin: 10px;
        padding: 3px 5px;
    }
    .timeline .event::before {
        display: inline-block;
        margin-right: 10px;
        width: 35px;
        color: grey;
        text-align: right;
    }
    .timeline .event:focus {
        outline: #cfcfcf auto 1px;
    }
    .timeline .event.create {
        color: grey;
    }
    .timeline .event.saved::before {
        content: attr(data-row-index);
    }
    .timeline .event.create::before {
        content: "NEW";
        font-size: 12px;
    }
    .timeline .event.create:focus {
        color: #000;
    }
</style>
