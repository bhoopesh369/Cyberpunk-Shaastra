import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './main.css';
import { Home } from './pages';

import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import theme from './theme/mantineTheme';
import DashBoard from './pages/DashBoard';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <Suspense fallback={<>Loading</>}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<DashBoard />} />
                    </Routes>
                </BrowserRouter>
            </Suspense>
        </MantineProvider>
        <MantineProvider theme={theme}></MantineProvider>
    </React.StrictMode>,
);
