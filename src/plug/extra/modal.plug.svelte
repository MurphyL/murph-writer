<script>
    import Close from "svelte-icons/io/IoIosClose.svelte";
    import Mask from "./mask.plug.svelte";
    import { createEventDispatcher } from "svelte";

    export let title = null;

    export let show = false;

    export let showClose = true;

    const dispatch = createEventDispatcher();

    const postEvents = (type, e) => {
        dispatch(type, e);
    }
</script>

{#if show}
    <Mask on:click={(e) => postEvents('close', e)} ></Mask>
    <div class="modal-plug" role="dialog" aria-modal="true">
        <div class="header">
            <div class="title">
                {#if title}{title}{/if}
            </div>
            <div class="actions">
                {#if showClose}
                    <div class="action" on:click={(e) => postEvents('close', e)}>
                        <Close />
                    </div>
                {/if}
            </div>
        </div>
        <div class="body">
            <slot name="body" />
        </div>
        {#if $$slots.footer}
            <div class="footer">
                <div class="elements">
                    <slot name="footer" />
                </div>
            </div>
        {/if}
    </div>
{/if}

<style>
    .modal-plug {
        position: absolute;
		left: 50%;
		top: 35%;
        min-width: 50%;
        max-height: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        border-radius: 2px;
    }
    .modal-plug .header {
        display: flex;
        margin: 0;
        padding: 0;
        user-select: none;
        line-height: 45px;
        border-bottom: 1px solid #cfcfcf;
    }
    .modal-plug .header .title {
        flex: 1;
        font-size: 14px;
        text-indent: 12px;
    }
    .modal-plug .header .actions .action {
        margin: 5px;
        width: 35px;
        height: 35px;
        cursor: pointer;
        opacity: 0.5;
    }
    .modal-plug .header .actions .action:hover {
        opacity: 0.9;
    }
    .modal-plug .header :global(svg) {
        margin: 10%;
        width: 80%;
        height: 80%;
    }
    .modal-plug .body {
        margin: 0;
        padding: 5px;
    }
    .modal-plug .footer {
        margin: 0;
        padding: 5px;
        text-align: right;
        user-select: none;
        border-top: 1px solid #efefef;
        line-height: 30px;
    }
    .modal-plug .footer .elements {
        margin-right: 12px;
    }
</style>
