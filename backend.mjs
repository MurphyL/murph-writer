import cors from 'cors';
import DataBase from 'nedb';
import mkdirp from 'mkdirp';
import express from 'express';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mkdirp.sync('public/res');

const store = new DataBase({
    filename: 'public/res/meta.nedb',
    autoload: true
});

app.get('/:kind', (req, res) => {
    store.find(req.params).sort({ sort: 1 }).limit(10).exec((err, docs) => {
        if (err) {
            console.error(err);
            return res.json({
                code: 1, message: '查询数据失败'
            });
        }
        res.json({code: 0, payload: docs});
    });
});

app.get('/:kind/:unique', (req, res) => {
    store.findOne(req.params, function (err, doc) {
        if (err) {
            console.error(err);
            return res.json({
                code: 1, message: '查询数据失败'
            });
        }
        res.json({code: 0, payload: doc});
    });
});


app.delete('/:kind/:_id', (req, res) => {
    store.remove({ ...req.params }, {}, function (err, count) {
        if (err) {
            return res.json({
                code: 1, message: '数据删除失败'
            });
        }
        res.json({code: 0, payload: { ...req.params, count } });
    });
});

app.post('/:kind', (req, res) => {
    const { _id, ...item } = req.body;
    Object.assign(item, req.params);
    if(_id) {
        store.update({ _id }, { $set: item }, {}, function (err, count) {
            if (err) {
                console.error(err);
                return res.json({
                    code: 1, message: '数据更新失败！'
                });
            }
            res.send({ code: 0, payload: { _id, count } });
        });
    } else {
        const ts = Date.now();
        store.insert([{...item, sort: ts, ts}], function (err) {
            if (err) {
                console.error(err);
                return res.json({
                    code: 1, message: '数据插入失败！'
                });
            }
            res.send({ code: 0 });
        });
    }
});

app.post('/:kind/append', (req, res) => {
    const { kind } = req.params;
    (req.body || []).forEach(({ _id, sort, content }) => {
        const ts = Date.now();
        if(_id) {
            store.update({ _id }, { $set: { sort, ts } }, {}, (err) => {
                if (err) {
                    console.error(err);
                    return res.json({
                        code: 1, message: '数据更新失败！'
                    });
                }
            });
        } else {
            store.insert([{ kind, content, ts, sort }], (err) => {
                if (err) {
                    console.error(err);
                    return res.json({
                        code: 1, message: '数据插入失败！'
                    });
                }
            });
        }
    });
    res.json({ code: 0 });
});

app.listen(port, () => {
    console.log(`Seve on ${port}`);
});