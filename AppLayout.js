import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

function AppLayout({ children }) {
    const location = useLocation();

    // Hide Navbar for Login and Signup pages
    const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <>
            {/* Conditionally render Navbar */}
            {!hideNavbar && <Navbar />}
            {children}
        </>
    );
}

export default AppLayout;
