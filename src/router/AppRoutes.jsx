import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//components
import NavBar from '../components/layout/NavBar'

//pages
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard';
import Request from '../pages/Request';

const AppRoutes = () => {
    return (
        <div className="full-viewport-container bg-white flex font-os">
            <BrowserRouter>
                <div className="w-[10vw] h-screen shadow-md">
                    <NavBar />
                </div>
                <div className="w-[90vw] h-screen">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/request" element={<Request />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default AppRoutes;