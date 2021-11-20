import React from 'react';
import { selectorFamily, useRecoilValue } from 'recoil';

import { Link, useParams } from "react-router-dom";

import axios from 'axios';

import CreateToolbar from 'plug/toolbar/create-toolbar.module';

import styles from './collections.module.css';

export const fetchCollection = selectorFamily({
    key: 'fetch-collection',
    get: (unique) => async () => {
        const { data, status } = await axios.get(`/api/${unique}/_collections`);
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
    const { collections = [] } = useRecoilValue(fetchCollection(database));
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
                                <Link to={`/${database}/collections/${row._name}/_doc`}>{row._name}</Link>
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
    const { database } = useParams();
    return (database);
}