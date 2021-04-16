<script context="module">
    export const definitions = {
        unique: "skill",
        tab: true,
        shortname: "技能",
        sort: 5000,
    };
</script>

<script>
    import { ajax } from "../../../utils/global.utils.svelte";
    export let book = {};

    let ts = Date.now();

    const save = (e, _id) => {
        if (e.code === "Enter" && e.ctrlKey) {
            e.preventDefault();
            ajax([ "post", "/skills", {
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
        Array.from(document.querySelectorAll('.skills .skill')).forEach(item => {
            item.classList.remove("current");
        });
        e.target.parentElement.classList.add("current");
    };

    const deleteEvent = (_id) => {
        ajax(['delete', `/skills/${_id}`])
            .then(() => {
                ts = Date.now();
            });
    }

    const appendEvent = (skills, index, flag) => {
        const items = [];
        (skills || []).forEach(({ _id }, i) => {
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
        ajax(['post', `/skills/append`, items])
            .then(() => {
                ts = Date.now();
            });
    };
</script>

<svelte:head>
    <title>{`技能 - ${book.title || "未命名书籍"} - 书本详情`}</title>
</svelte:head>

<div class="skills">
    {#key ts}
        {#await ajax(["get", '/skills'])}
            <div>Loading...</div>
        {:then skills}
            {#if skills.length > 0}
                {#each skills as { _id, content }, index}
                    <div class="skill" data-row-index={index + 1}>
                        <div class="editor" contenteditable on:focus={(e) => focus(e, index)} on:keydown={(e) => save(e, _id)}>{content}</div>
                        <div class="toolbar">
                            <div class="wrapper">
                                <span>按快捷键【Ctrl + Enter】保存</span>
                                <button on:click={() => appendEvent(skills, index, 0)}>前置</button>
                                <button on:click={() => appendEvent(skills, index, 1)}>追加</button>
                                <button on:click={() => deleteEvent(_id)}>删除</button>
                            </div>
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="skill current">
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
    .skills {
        position: relative;
    }
    .skills .skill {
        position: relative;
        margin: 10px 10px 10px 50px;
        line-height: 20px;
    }
    .skills .skill::before {
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
    .skills .skill::before {
        content: attr(data-row-index);
    }
    .skills .skill .editor {
        padding: 3px 5px;
        outline: none;
        border: 1px solid #fff;
    }
    .skills .skill.current .editor {
        border: 1.3px solid #cfcfcf;
    }
    .skills .skill .toolbar {
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
    .skills .skill.current .toolbar {
        visibility: visible; 
    }
    .skills .skill .toolbar .wrapper {
        padding: 5px 8px;
    }
</style>
