<script>
    import { Route } from "tinro";

    import BookList from '../view/book.list.svelte';
    import BookInfo from '../view/book.info.svelte';

</script>

<Route>
    <Route path="/editor">
        <div>editor</div>
    </Route>
    <Route path="/books/*">
        <Route path="/">
            <BookList />
        </Route>
        <Route path="/:unique/*" let:meta>
            <Route path="/">
                <BookInfo {...meta.params} />
            </Route>
            <Route path="/:feature" let:meta>
                <BookInfo {...meta.params} />
            </Route>
        </Route>
    </Route>
    <Route fallback>
        <div>404</div>
    </Route>
</Route>
