<script context="module">
    export const definitions = {
        unique: "role",
        tab: true,
        top: true,
        shortname: "角色",
        sort: 2500,
    };
</script>

<script>
    import { ajax } from "../../../utils/global.utils.svelte";
    export let book = {};

    let ts = Date.now();

    const save = (e, _id) => {
        if (e.code === "Enter" && e.ctrlKey) {
            e.preventDefault();
            ajax([ "post", "/roles", {
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
        Array.from(document.querySelectorAll('.roles .role')).forEach(item => {
            item.classList.remove("current");
        });
        e.target.parentElement.classList.add("current");
    };

    const deleteEvent = (_id) => {
        ajax(['delete', `/roles/${_id}`])
            .then(() => {
                ts = Date.now();
            });
    }

    const appendEvent = (roles, index, flag) => {
        const items = [];
        (roles || []).forEach(({ _id }, i) => {
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
        ajax(['post', `/roles/append`, items])
            .then(() => {
                ts = Date.now();
            });
    };
</script>

<svelte:head>
    <title>{`技能 - ${book.title || "未命名书籍"} - 书本详情`}</title>
</svelte:head>

<div class="roles">
    {#key ts}
        {#await ajax(["get", '/roles'])}
            <div>Loading...</div>
        {:then roles}
            {#if roles.length > 0}
                {#each roles as { _id, content }, index}
                    <div class="role" data-row-index={index + 1}>
                        <div class="editor" contenteditable on:focus={(e) => focus(e, index)} on:keydown={(e) => save(e, _id)}>{content}</div>
                        <div class="toolbar">
                            <div class="wrapper">
                                <span>按快捷键【Ctrl + Enter】保存</span>
                                <button on:click={() => appendEvent(roles, index, 0)}>前置</button>
                                <button on:click={() => appendEvent(roles, index, 1)}>追加</button>
                                <button on:click={() => deleteEvent(_id)}>删除</button>
                            </div>
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="role current">
                    <div class="editor current" contenteditable on:keydown={(e) => save(e)}>技能描述</div>
                    <div class="toolbar">
                        <div class="wrapper">
                            <span>按快捷键【Ctrl + Enter】保存</span>
                        </div>
                    </div>
                </div>
            {/if}
        {:catch error}
            <div>Error: {error.message}</div>
        {/await}
    {/key}
</div>

<style>
    .roles {
        position: relative;
    }
    .roles .role {
        position: relative;
        margin: 10px 10px 10px 50px;
        line-height: 20px;
    }
    .roles .role::before {
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
    .roles .role::before {
        content: attr(data-row-index);
    }
    .roles .role .editor {
        padding: 3px 5px;
        outline: none;
        border: 1px solid #fff;
    }
    .roles .role.current .editor {
        border: 1.3px solid #cfcfcf;
    }
    .roles .role .toolbar {
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
    .roles .role.current .toolbar {
        visibility: visible; 
    }
    .roles .role .toolbar .wrapper {
        padding: 5px 8px;
    }
</style>
