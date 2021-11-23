import React, { useState } from 'react';

import styles from './create-toolbar.module.css';

export default function Toolbar({ name, submit, children }) {
    const [unique, setUnique] = useState(null);
    const [message, setMessage] = useState(null);
    const doCreate = () => {
        setMessage(null);
        if (null === unique || unique.length === 0) {
            return setMessage({ text: `请输入${name}名称` });
        }
        (typeof (submit) === 'function') && submit(unique);
    };
    return (
        <div className={styles.root}>
            <label htmlFor="unique">{name}名称：</label>
            <input type="text" id="unique" onChange={e => setUnique(e.target.value.trim())} />
            <button onClick={() => doCreate()}>创建{name}</button>
            {children}
            {message && <span className={styles.message}>{message.text}</span>}
        </div>
    );
}