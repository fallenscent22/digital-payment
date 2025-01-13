import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import TransactionPage from './TransactionPage';
import Home from './Home';
import HelpCentre from './HelpCentre';
import RecurringPayment from './RecurringPayment';
import SmartSavings from './SmartSavings';

function NavigationBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Digital Payment
                </Typography>
                <Button color="inherit" component={Link} to="/home">Home</Button>
                <Button color="inherit" component={Link} to="/transactions">Transaction</Button>
                <Button color="inherit" component={Link} to="/recurring-payment">Recurring Payment</Button>
                <Button color="inherit" component={Link} to="/smart-savings">Smart Savings</Button>
                <Button color="inherit" component={Link} to="/signup">Signup</Button>
                <Button color="inherit" component={Link} to="/helpcentre">Help Centre</Button>
            </Toolbar>
        </AppBar>
    );
}

function AppLayout({ children }) {
    const location = useLocation();

    // Hide Navbar for Login and Signup pages
    const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <>
            {!hideNavbar && <NavigationBar />}
            {children}
        </>
    );
}

function App() {
    return (
        <Router>
            <Container maxWidth="lg">
                <AppLayout>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/transactions" element={<TransactionPage />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/helpcentre" element={<HelpCentre />} />
                        <Route path="/recurring-payment" element={<RecurringPayment />} />
                        <Route path="/smart-savings" element={<SmartSavings />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </AppLayout>
            </Container>
        </Router>
    );
}

export default App;