import React from 'react';
import { selectorFamily, useRecoilValue } from 'recoil';

import { Link, useParams } from "react-router-dom";

import axios from 'axios';

import CreateToolbar from 'plug/toolbar/create-toolbar.module';

import styles from './collections.module.css';

const showCollection = selectorFamily({
    key: 'show-collections',
    get: (unique) => async () => {
        const { data, status } = await axios.get(`/api/${unique}/_collections`);
        if (status === 200) {
            return data;
        } else {
            return null;
        }
    }
});

const searchCollection = selectorFamily({
    key: 'search-collection',
    get: ({ database, collection }) => async () => {
        const { data, status } = await axios.get(`/api/${database}/${collection}/_search`);
        if (status === 200) {
            return data;
        } else {
            return null;
        }
    }
});

const createCollection = (database, unique) => {
    axios.post(`/api/${database}/_collections`, {
        collection: unique,
        type: 'database'
    })
};

export function Collections() {
    const { database } = useParams();
    const { collections = [] } = useRecoilValue(showCollection(database));
    return (
        <div className={styles.root}>
            <CreateToolbar name="集合" submit={(unique) => createCollection(database, unique)} />
            <table>
                <thead>
                    <tr>
                        <th>Collection</th>
                        <th>Modified</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {(collections || []).map((row, index) => (
                        <tr key={index}>
                            <td>
                                <Link to={`/${database}/collections/${row._name}/_search`}>{row._name}</Link>
                            </td>
                            <td>{row.ct}</td>
                            <td>
                                <button>删除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export function Collection() {
    const rows = useRecoilValue(searchCollection(useParams()));
    console.log(rows);
    return 'x - collection';
}