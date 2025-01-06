import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './main.css';
import { Home, Ticker } from './pages';

import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import theme from './theme/mantineTheme';
import { NavBar } from './components';
import DashBoard from './pages/DashBoard';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import SectorAnalysis from './pages/SectorWise';
import Calculator from './pages/Calculator';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <Suspense fallback={<>Loading</>}>

                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    gutter={8}
                    toastOptions={{
                        duration: 5000,
                    }}
                />
                <BrowserRouter>
                    <NavBar />
                    <Routes>
                        <Route path="/:ticker" element={<Ticker />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<DashBoard />} />
                        <Route path='/login' element={<Login />} />
                        <Route path="/sector" element={<SectorAnalysis />} />
                        <Route path="/calculator" element={<Calculator />} />
                    </Routes>
                </BrowserRouter>
            </Suspense>
        </MantineProvider>
        <MantineProvider theme={theme}></MantineProvider>
    </React.StrictMode>,
);
