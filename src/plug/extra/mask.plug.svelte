<div class="mask-plug" on:click>
    <slot />
</div>

<style>
    .mask-plug {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        user-select: none;
        background-color: rgba(20, 20, 20, 0.3);
    }
</style>