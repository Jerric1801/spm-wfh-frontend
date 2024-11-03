import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

//components
import NavBar from '../components/layout/NavBar';

//pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Request from '../pages/Request';
import Personal from '../pages/Personal';

import { ScheduleProvider } from '../context/ScheduleContext';

const AppRoutes = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token'); 
            if (token) {
                const decodedToken = JSON.parse(atob(token.split('.')[1])); 
                if (decodedToken.exp * 1000 < Date.now()) { 
                    localStorage.removeItem('jwtToken'); 
                    navigate('/login'); 
                    alert('Your session has expired. Please log in again.'); 
                }
            }
        };

        // Check token expiration on initial load and periodically
        checkTokenExpiration();
        const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute

        return () => clearInterval(intervalId); // Clean up interval on unmount
    }, [navigate]);

    const renderNavBar = () => {
        if (location.pathname !== "/") {
            return (
                <div className="w-[10vw] h-screen shadow-md">
                    <NavBar />
                </div>
            );
        }
        return null;
    };

    const getMainContentClass = () => {
        return location.pathname.includes('/') ? "w-full h-screen" : "w-[90vw] h-screen";
    };

    return (
        <div className="full-viewport-container bg-white flex font-os">
            {renderNavBar()}
            <div className={getMainContentClass()}>
                <Routes>
                    <Route path="/" element={<Login />} /> {/* Login route first */}
                    <Route path="/dashboard" element={ 
                        <ScheduleProvider>
                            <Dashboard />
                        </ScheduleProvider>
                    } />
                    <Route path="/request" element={<Request />} />
                    <Route path="/personal" element={<Personal />} />
                </Routes>
            </div>
        </div>
    );
};

export default AppRoutes;