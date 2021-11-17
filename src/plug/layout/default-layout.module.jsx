import React from 'react';
import { Outlet, Link } from "react-router-dom";

import styles from './default-layout.module.css';

export default function DefaultLayout() {
    return (
        <div className={styles.root}>
            <header>
                <Link to="/">Summary</Link>
            </header>
            <main className={styles.body}>
                <Outlet />
            </main>
        </div>
    );
};