import React from 'react';
import { selector, useRecoilValue } from 'recoil';

import { Link } from "react-router-dom";

import axios from 'axios';

import CreateToolbar from 'plug/toolbar/create-toolbar.module';

import styles from './summary.module.css';

export const summary = selector({
    key: 'restify-summary',
    get: () => {
        return axios.get('/api/_cat').then(({ status, data }) => {
            return status === 200 ? data : null;
        }).catch(err => {
            console.error('Github API 调用出错：', err.message);
            return null;
        }).finally(() => {
            console.log('摘要信息查询完成！');
        });
    }
});

export default function Summary() {
    const databases = useRecoilValue(summary);
    const createDatabase = (id) => {
        axios.post(`/api/${id}/_schema`, {
            create: 'id',
            type: 'database'
        })
    };
    const dropDatabase = (id) => {
        if(window.confirm(`确定要删除数据库【${id}】吗？`)) {
            axios.delete(`/api/${id}/_schema`);
        }
    };
    return (
        <div className={styles.root}>
            <CreateToolbar name="数据库" submit={createDatabase} />
            <table>
                <thead>
                    <tr>
                        <th>Database</th>
                        <th>Modified</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {(databases || []).map(({ name, ct, mt }, index) => (
                        <tr key={index}>
                            <td><Link to={`/${name}/collections`}>{name}</Link></td>
                            <td>{ct || mt}</td>
                            <td>
                                <button onClick={() => dropDatabase(name)}>删除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
