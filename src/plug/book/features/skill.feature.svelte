<script context="module">
    export const definitions = {
        unique: "skill",
        tab: true,
        shortname: "技能",
        sort: 5000,
    };
</script>

<script>
    export let book = {};
</script>

<svelte:head>
    <title>{`技能 - ${book.title || "未命名书籍"} - 书本详情`}</title>
</svelte:head>

<div class="skill">
    <span>技能</span>
</div>
