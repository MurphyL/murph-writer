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

app.get('/books', (req, res) => {
    store.find({ kind: 'book' }, function (err, docs) {
        if (err) {
            console.error(err);
            return res.json({
                code: 1, message: '查询数据失败'
            });
        }
        res.json({code: 0, payload: docs});
    });
});

app.get('/books/:unique', (req, res) => {
    store.findOne({ ...req.params, kind: 'book' }, function (err, doc) {
        if (err) {
            console.error(err);
            return res.json({
                code: 1, message: '查询数据失败'
            });
        }
        res.json({code: 0, payload: doc});
    });
});


app.delete('/books/:_id', (req, res) => {
    store.remove({ ...req.params, kind: 'book' }, {}, function (err, count) {
        if (err) {
            return res.json({
                code: 1, message: '数据删除失败'
            });
        }
        res.json({code: 0, payload: { ...req.params, count } });
    });
});

app.post('/books', (req, res) => {
    const { _id, ...book } = req.body;
    Object.assign(book, { kind: 'book' });
    if(_id) {
        store.update({ _id }, book, {}, function (err, count) {
            if (err) {
                console.error(err);
                return res.json({
                    code: 1, message: '数据更新失败！'
                });
            }
            res.send({ code: 0, payload: { _id, count } });
        });
    } else {
        store.insert([req.body || {}], function (err) {
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

app.listen(port, () => {
    console.log(`Seve on ${port}`);
});