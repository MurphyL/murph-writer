const fs = require('fs');
const Ajv = require("ajv");
const path = require('path');
const uuid = require('uuid');
const dayjs = require('dayjs');
const jsonfile = require('jsonfile');

const DB_SUFFIX = '.json';

const TS_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const root = process.env.RESTIFY_DATABASE || '/usr/murph/restify/demo';

const schemaValidate = new Ajv().compile({
    type: "object",
});

const filter = (items = [], property = 'name', pattern) => {
    if (pattern) {
        return items.filter(item => new RegExp(pattern).test(item[property]))
    }
    return items;
};

exports.show_schemas = (pattern) => {
    const items = fs.readdirSync(root);
    const schemas = filter(items, 'name', pattern).map(file => {
        const { ctime, mtime } = fs.lstatSync(path.resolve(root, file));
        return {
            name: path.basename(file, DB_SUFFIX),
            ct: dayjs(ctime).format(TS_FORMAT),
            mt: dayjs(mtime).format(TS_FORMAT)
        };
    });
    return { action: 'show schemas', schemas };
};

exports.create_schema = ({ schema }, { settings }) => {
    const file = path.resolve(root, `${schema}${DB_SUFFIX}`);
    const result = { action: 'create schema', unique: schema };
    if (fs.existsSync(file)) {
        return { ...result, status: 'schema exists' };
    }
    jsonfile.writeFileSync(file, {
        _id: uuid.v4(),
        _settings: Object.assign({}, settings),
        _collections: []
    });
    return {
        ...result,
        status: 'schema created'
    }
};

exports.drop_schema = ({ schema }) => {
    const result = { action: 'drop schema', unique: schema };
    fs.unlinkSync(path.resolve(root, `${schema}${DB_SUFFIX}`));
    return {
        ...result,
        status: 'schema droped'
    }
};

exports.show_collections = ({ schema, pattern }) => {
    const file = path.resolve(root, `${schema}${DB_SUFFIX}`);
    const result = { action: 'show collections', unique: schema };
    if (!fs.existsSync(file)) {
        return { ...result, status: 'schema not exists' };
    }
    const { ctime } = fs.lstatSync(file);
    const values = jsonfile.readFileSync(file);
    const { _collections: collections } = values;
    if (pattern) {
        return { collections, pattern };
    } else {
        return {
            ...result,
            ct: dayjs(ctime).format(TS_FORMAT),
            collections
        };
    }
};

exports.create_collection = ({ schema }, { collection, settings }) => {
    const file = path.resolve(root, `${schema}${DB_SUFFIX}`);
    const result = { action: 'create collection', unique: `${schema}/${collection}` };
    if (!fs.existsSync(file)) {
        return { ...result, status: 'schema not exists' };
    }
    const database = jsonfile.readFileSync(file);
    const values = Object.assign(database, {
        _collections: [...database._collections, {
            _id: uuid.v4(),
            _name: collection,
            _settings: Object.assign({}, settings)
        }]
    });
    jsonfile.writeFileSync(file, values, { spaces: 4 });
    return { ...result, status: 'collection created' };
};

exports.search_collection = ({ schema, collection }) => {
    const file = path.resolve(root, `${schema}${DB_SUFFIX}`);
    const result = { type: 'collection', unique: `${schema}/${collection}` };
    if (!fs.existsSync(file)) {
        return { ...result, status: 'schema not exists' };
    }
    const { _collections = [] } = jsonfile.readFileSync(file);
    const target = _collections.find(({ _name }) => _name === collection);
    if (target) {
        return { ...result, rows: target.rows };
    } else {
        return { ...result, status: 'collection not exists' };
    }
};