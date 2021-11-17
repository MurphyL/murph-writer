const path = require('path');
const restify = require('json-server');

const server = restify.create();

const middlewares = restify.defaults({
    static: path.resolve(process.cwd(), 'public')
});

server.use(middlewares);
server.use(restify.bodyParser);

server.use((req, res, next) => {
    switch (req.method) {
        case 'POST':
            req.body.cts = Date.now();
            break;
        case 'PUT':
        case 'PATCH':
            req.body.uts = Date.now();
            break;
    }
    next();
});

const db = path.resolve(process.cwd(), 'test/data/db.json');

console.log('- Database: ', db);

server.use('/api', restify.router(db));

const port = process.env.RESTIFY_PORT || 3001;

server.listen(port, () => {
    console.log('- Restify serving on port:', port)
});