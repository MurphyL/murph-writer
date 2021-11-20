import React, {Suspense} from 'react';
import { Helmet } from 'react-helmet-async';

export function DynamicModule({ title, children }) {
    return (
        <Suspense fallback="loading……">
            <Helmet>
                <title>{(title ? `${title} - ` : '') + process.env.REACT_APP_TITLE}</title>
            </Helmet>
            {children}
        </Suspense>
    );
}