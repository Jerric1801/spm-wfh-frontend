import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//pages
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard';


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;