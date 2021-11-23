import React from 'react';
import { RecoilRoot } from 'recoil';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, useRoutes } from "react-router-dom";

import { DynamicModule } from 'plug/dynamic';

import DefaultLayout from 'plug/layout/default-layout.module';

import Summary from 'view/summary/summary.module';
import { Collections, Collection } from 'view/collections/collections.module';

const Views = () => useRoutes([{
    path: '/',
    element: <DefaultLayout />,
    children: [{
        index: true,
        element: <DynamicModule title="摘要"><Summary /></DynamicModule>,
    }, {
        path: ':database/collections',
        element: <DynamicModule title="集合"><Collections /></DynamicModule>,
    }, {
        path: ':database/collections/:collection/_search',
        element: <DynamicModule title="数据"><Collection /></DynamicModule>,
    }, {
        path: '*',
        element: <div>404</div>
    }]
}]);

export default function App() {
    return (
        <HelmetProvider>
            <RecoilRoot>
                <BrowserRouter>
                    <Views />
                </BrowserRouter>
            </RecoilRoot>
        </HelmetProvider>
    );
}