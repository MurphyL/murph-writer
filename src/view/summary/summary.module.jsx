import React, { Suspense } from 'react';
import { selector, useRecoilValue } from 'recoil';

import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";

import axios from 'axios';

import styles from './summary.module.css';

export const dbSummary = selector({
    key: 'db-summary',
    get: () => {
        return axios.get('/api/_desc').then(({ status, data }) => {
            return status === 200 ? data : null;
        }).catch(err => {
            console.error('Github API 调用出错：', err.message);
            return null;
        }).finally(() => {
            console.log('摘要信息查询完成！');
        });
    }
});

function Summary() {
    const databases = useRecoilValue(dbSummary);
    return (
        <div className={styles.root}>
            <table>
                <thead>
                    <tr>
                        <th>Object</th>
                        <th>Type</th>
                        <th>Size</th>
                    </tr>
                </thead>
                <tbody>
                    {(databases || []).map(({name}, index) => (
                        <tr key={index}>
                            <td><Link to={`/collections/${name}`}>{name}</Link></td>
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
            <Summary />
        </Suspense>
    );
}