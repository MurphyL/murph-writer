<script>
    export let error = '未知错误！';
</script>

<div class="error">
    <span>{ (error instanceof Error) ? `错误信息：${error.message}` : error  }</span>
</div>