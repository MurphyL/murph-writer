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
    store.find({}, function (err, docs) {
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


app.delete('/books/:unique', (req, res) => {
    res.json({code: 0, test: ture, params: req.params });
});

app.post('/books', (req, res) => {
    const { _id, ...book } = req.body;
    if(_id) {
        store.update({ _id }, book, {}, function (err) {
            if (err) {
                console.error(err);
                return res.json({
                    code: 1, message: '数据更新失败！'
                });
            }
            res.send({ code: 0, message: '' });
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