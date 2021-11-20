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

exports.show_databases = (pattern) => {
    const items = fs.readdirSync(root);
    return filter(items, 'name', pattern).map(file => {
        const { ctime, mtime } = fs.lstatSync(path.resolve(root, file));
        return {
            name: path.basename(file, DB_SUFFIX),
            ct: dayjs(ctime).format(TS_FORMAT),
            mt: dayjs(mtime).format(TS_FORMAT)
        };
    });
};

exports.create_database = ({ schema }, { settings }) => {
    const file = path.resolve(root, `${schema}${DB_SUFFIX}`);
    jsonfile.writeFileSync(file, {
        _id: uuid.v4(),
        _settings: {
            ...settings
        },
        _collections: []
    });
    return {
        uuid: uuid.v4(),
        type: 'schema',
        unique: schema,
        settings: Object.assign({}, settings),
        status: 'created'
    }
};

exports.drop_database = ({ schema }) => {
    fs.unlinkSync(path.resolve(root, `${schema}${DB_SUFFIX}`));
    return {
        type: 'database',
        name: schema,
        status: 'droped'
    }
};

exports.show_tables = ({ schema, pattern }) => {
    const file = path.resolve(root, `${schema}${DB_SUFFIX}`);
    const { ctime } = fs.lstatSync(file);
    const values = jsonfile.readFileSync(file);
    const { _collections: collections } = values;
    if (pattern) {
        return { collections };
    } else {
        return { ct: dayjs(ctime).format(TS_FORMAT), collections };
    }
};

exports.create_table = ({ schema }, { collection, settings }) => {
    const file = path.resolve(root, `${schema}${DB_SUFFIX}`);
    const database = jsonfile.readFileSync(file);
    const values = Object.assign(database, {
        _collections: [...database._collections, {
            _id: uuid.v4(),
            _name: collection,
            _settings: Object.assign({}, settings)
        }]
    });
    jsonfile.writeFileSync(file, values, { spaces: 4 });
    return {
        uuid: uuid.v4(),
        type: 'collection',
        unique: `${schema}/${collection}`,
        settings: Object.assign({}, settings),
        status: 'created'
    }
};