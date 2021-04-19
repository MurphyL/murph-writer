import cors from 'cors';
import express from 'express';

import shelljs from 'shelljs';

import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';

const db = lowdb(new FileSync('public/res/db.json'));

db.defaults({ books: [] })
    .set('ts', Date.now())
    .write();

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

shelljs.mkdir('-p', 'public/res');

app.get('/:kind', (req, res) => {
    const docs = db.get(req.params.kind).take(10).value();
    res.json({code: 0, payload: docs});
});

app.get('/:kind/:unique', (req, res) => {
    const { params } = req;
    const doc = db.get(params.kind).find(params).value();
    res.json({code: 0, payload: doc});
});


app.delete('/:kind/:_id', (req, res) => {
    const { params } = req;
    const doc = db.get(params.kind).remove(params).write();
    res.json({code: 0, payload: { doc } });
});

app.post('/:kind', (req, res) => {
    console.log(req.params.kind);
    const collection = db.get(req.params.kind); 
    const { _id, ...item } = req.body;
    Object.assign(item, req.params);
    if(_id) {
        const count = collection.find({ _id }).assign(req.body).write();
        res.send({ code: 0, payload: { _id, count } });
    } else {
        const ts = Date.now();
        const doc = collection.push({...item, sort: ts, ts}).write()
        res.send({ code: 0, payload: doc });
    }
});

app.post('/:kind/append', (req, res) => {
    const { kind } = req.params;
    res.json({ code: 0, payload: { kind, type: 'append' } });
});

app.listen(port, () => {
    console.log(`Seve on ${port}`);
});