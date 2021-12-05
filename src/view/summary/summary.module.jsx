import React from 'react';
import { selector, useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';

import { Link } from "react-router-dom";

import axios from 'axios';

import restify from 'plug/rest-utils';

import CreateToolbar from 'plug/toolbar/create-toolbar.module';

import styles from './summary.module.css';

export const summary = selector({
    key: 'restify-summary',
    get: () => {
        return restify.get().then(({ status, data }) => {
            return status === 200 ? { status, schemas: data } : { status };
        }).catch(({ message, response }) => {
            console.error('Github API 调用出错：', message, response);
            return { status: response.status || 500, message: response.message || message };
        }).finally(() => {
            console.log('摘要信息查询完成！');
        });
    }
});

export default function Summary() {
    const data = useRecoilValue(summary);
    const refresh = useRecoilRefresher_UNSTABLE(summary);
    console.log(process.env);
    if (data.status === 404) {
        return (
            <div>数据库不存在， 立即 <button onClick={() => {
                if (window.confirm(`立即创建数据库！`)) {
                    restify.put().then(({ status }) => {
                        if (status === 201) {
                            console.log('创建成功，刷新数据');
                            refresh();
                        } else {
                            console.log('创建失败');
                        }
                    }).catch(err => {
                        console.log('创建出错：', err.message);
                    })
                }
            }}>创建</button> 数据库？</div>
        );
    }
    const dropDatabase = (id) => {
        if (window.confirm(`确定要删除数据库【${id}】吗？`)) {
            axios.delete(`/api/_drop/${id}`);
        }
    };
    return (
        <div className={styles.root}>
            <CreateToolbar name="数据库" submit={console.log} />
            {(data.schemas.length === 0) ? (
                <div>没有集合，立即创建一个？</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Database</th>
                            <th>Modified</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data.schemas || []).map(({ name, ct, mt }, index) => (
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
            )}

        </div>
    );
};
