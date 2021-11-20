// const serve = require('koa-static');
const logger = require('koa-logger');

const Application = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-body');

const db = require('./support/database-kits');

const app = new Application();

const port = process.env.RESTIFY_PORT || 3001;
const prefix = process.env.RESTIFY_API_PREFIX || '';

const router = new Router({ prefix });

app.use(bodyParser({
    multipart: true,
    urlencoded: true
}));

app.use(async (ctx, next) => {
    await next();
    ctx.set('X-Restify-Meta', 'Restify');
});

router.get('/_cat', (ctx) => {
    ctx.body = db.show_databases();
});

router.post('/:schema/_schema', (ctx) => {
    ctx.body = db.create_database(ctx.params, ctx.request.body);
});

router.del('/:schema/_schema', (ctx) => {
    ctx.body = db.drop_database(ctx.params);
});

router.get('/:schema/_collections', (ctx) => {
    ctx.body = db.show_tables(ctx.params);
});

router.post('/:schema/_collections', (ctx) => {
    ctx.body = db.create_table(ctx.params, ctx.request.body);
});

app.use(logger());
// app.use(serve('./build'));
app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

app.listen(port, () => {
    console.log('Restify serving on', prefix, port);
});