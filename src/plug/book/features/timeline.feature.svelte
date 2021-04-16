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

    const save = (e, _id) => {
        console.log(e, _id);
        if (e.code === "Enter" && e.ctrlKey) {
            e.preventDefault();
            ajax([ "post", "/events", {
                    _id,
                    content: (e.target.textContent || '').trim(),
            }]).then(() => {
                ts = Date.now();
                e.target.blur();
            });
        }
        focus(e);
    };

    const focus = (e) => {
        Array.from(document.querySelectorAll('.timeline .event')).forEach(item => {
            item.classList.remove("current");
        });
        e.target.parentElement.classList.add("current");
    };

    const deleteEvent = (_id) => {
        ajax(['delete', `/events/${_id}`])
            .then(() => {
                ts = Date.now();
            });
    }

    const appendEvent = (events, index, flag) => {
        const items = [];
        (events || []).forEach(({ _id }, i) => {
            if(flag === 0) {
                if(index === i) {
                    items.push({ 
                        sort: items.length,
                        content: `新建事件 - ${Date.now()}` 
                    });
                }
                items.push({ sort: items.length, _id });
            } else {
                items.push({ sort: items.length, _id });
                if(index === i) {
                    items.push({ 
                        sort: items.length,
                        content: `新建事件 - ${Date.now()}` 
                    });
                }
            }
        });
        ajax(['post', `/events/append`, items])
            .then(() => {
                ts = Date.now();
            });
    };
</script>

<svelte:head>
    <title>{`时间线 - ${book.title || "未命名书籍"} - 书本详情`}</title>
</svelte:head>

<div class="timeline">
    {#key ts}
        {#await ajax(["get", '/events'])}
            <div>Loading...</div>
        {:then events}
            {#each events as { _id, content }, index}
                <div class="event" data-row-index={index + 1}>
                    <div class="editor" contenteditable on:focus={(e) => focus(e, index)} on:keydown={(e) => save(e, _id)}>{content}</div>
                    <div class="toolbar">
                        <div class="wrapper">
                            <button on:click={() => appendEvent(events, index, 0)}>前置</button>
                            <button on:click={() => appendEvent(events, index, 1)}>追加</button>
                            <button on:click={() => deleteEvent(_id)}>删除</button>
                        </div>
                    </div>
                </div>
            {/each}
        {:catch error}
            <div>Error: {error.message}</div>
        {/await}
    {/key}
</div>

<style>
    .timeline {
        position: relative;
    }
    .timeline .event {
        position: relative;
        margin: 10px 10px 10px 50px;
        line-height: 20px;
    }
    .timeline .event::before {
        display: inline-block;
        position: absolute;
        top: 3px;
        left: -40px;
        margin-right: 10px;
        width: 35px;
        color: grey;
        text-align: right;
        line-height: 22px;
    }
    .timeline .event::before {
        content: attr(data-row-index);
    }
    .timeline .event .editor {
        padding: 3px 5px;
        outline: none;
        border: 1px solid #fff;
    }
    .timeline .event.current .editor {
        border: 1.3px solid #cfcfcf;
    }
    .timeline .event .toolbar {
        position: absolute;
        right: 0;
        line-height: 25px;
        visibility: hidden;
        text-align: right;
        background: #ffffff;
        border: 1.3px solid #cfcfcf;
        border-top: none;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        z-index: 999;
    }
    .timeline .event.current .toolbar {
        visibility: visible; 
    }
    .timeline .event .toolbar .wrapper {
        padding: 5px 8px;
    }
</style>
