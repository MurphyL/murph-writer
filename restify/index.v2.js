const fs = require('fs');
const path = require('path');

const Application = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-body');

const jsonfile = require('jsonfile');

const app = new Application();

const port = process.env.RESTIFY_PORT || 3001;
const store = process.env.RESTIFY_STORE || '/usr/restify';
const prefix = process.env.RESTIFY_PREFIX || '';

const router = new Router({ prefix });

app.use(bodyParser({
    multipart: true,
    urlencoded: true
}));

app.use(async (ctx, next) => {
    ctx.set('X-API-Server', 'Restify');
    next();
});

router.get('/_desc', (ctx, next) => {
    ctx.body = fs.readdirSync(store).map(x => ({
        name: path.basename(x, '.json'),
        file: path.resolve(store, x)
    }));
    next();
});

router.get('/:database/_desc', (ctx, next) => {
    const { database } = ctx.params;
    const location = path.resolve(store, `${database}.json`);
    ctx.body = [jsonfile.readFileSync(location)];
    next();
});

router.get('/:database/_cat', (ctx, next) => {
    ctx.body = ctx.params;
    const { database } = ctx.params;
    console.log('/:database/_cat', database);
    next();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
    console.log('Restify serving on port:', prefix, port);
});