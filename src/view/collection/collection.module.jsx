import React, { Suspense } from 'react';
import { selectorFamily, useRecoilValue } from 'recoil';

import { Helmet } from 'react-helmet-async';
import { useParams } from "react-router-dom";

import axios from 'axios';

import styles from './collection.module.css';

export const fetchCollection = selectorFamily({
    key: 'fetch-collection',
    get: (unique) => async () => {
        const { data, status } = await axios.get(`/api/${unique}/_desc`);
        if (status === 200) {
            return data;
        } else {
            return null;
        }
    }
});

function Collection() {
    const { unique } = useParams();
    const rows = useRecoilValue(fetchCollection(unique));
    return (
        <div className={styles.root}>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>title</th>
                        <th>author</th>
                        <th>ts</th>
                    </tr>
                </thead>
                <tbody>
                    {(rows || []).map((row, index) => (
                        <tr key={index}>
                            <td>{row.id}</td>
                            <td>{row.title}</td>
                            <td>{row.author}</td>
                            <td>{new Date(row.uts || row.cts).toDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default function Board() {
    return (
        <Suspense fallback="loading……">
            <Helmet>
                <title>摘要 - {process.env.REACT_APP_TITLE}</title>
            </Helmet>
            <Collection />
        </Suspense>
    );
}