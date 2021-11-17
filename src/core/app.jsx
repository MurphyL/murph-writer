import React from 'react';
import { RecoilRoot } from 'recoil';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, useRoutes } from "react-router-dom";

import DefaultLayout from 'plug/layout/default-layout.module';

import Summary from 'view/summary/summary.module';
import Collection from 'view/collection/collection.module';

const Views = () => useRoutes([{
    path: '/',
    element: <DefaultLayout />,
    children: [{
        index: true,
        element: <Summary />,
    }, {
        path: 'collections/:unique',
        element: <Collection />,
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