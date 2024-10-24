import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

//components
import NavBar from '../components/layout/NavBar'

//pages
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard';
import Request from '../pages/Request';
import Personal from '../pages/Personal';

import { ScheduleProvider } from '../context/ScheduleContext';

const AppRoutes = () => {
    const location = useLocation();

    const renderNavBar = () => {
        if (!location.pathname.includes('/login')) {
            return (
                <div className="w-[10vw] h-screen shadow-md">
                    <NavBar />
                </div>
            );
        }
        return null;
    };

    const getMainContentClass = () => {
        return location.pathname.includes('/login') ? "w-full h-screen" : "w-[90vw] h-screen";
    };

    return (
        <div className="full-viewport-container bg-white flex font-os">
            {renderNavBar()}
            <div className={getMainContentClass()}>
                <Routes>
                    <Route path="/" element={
                        <ScheduleProvider>
                            <Dashboard />
                        </ScheduleProvider>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/request" element={<Request />} />
                    <Route path="/personal" element={<Personal />} />
                </Routes>
            </div>
        </div>
    );
};

export default AppRoutes;