<script context="module">
    import { get as read, writable } from "svelte/store";

    import axios from "axios";

    const store = writable(_APP_ENV || {});

    const env = (unique) => {
        return read(store)[unique];
    };

    export const title = (name) => {
        return `${name || "未命名页面"} | ${env("APP_TITLE")}`;
    };

    const instance = axios.create({
        baseURL: env('AJAX_ROOT'),
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
    });

    export const ajax = ([method = "get", url, params]) => {
        return instance({ method, url, data: params }).then(
            ({ data: { code, payload, message }, status }) => {
                if (status === 200 && code === 0) {
                    return payload;
                }
                throw new Error(message || "操作失败");
            }
        );
    };
</script>
