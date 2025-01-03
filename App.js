import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import TransactionPage from './TransactionPage';
import Home from './Home';
import HelpCentre from './HelpCentre';

function NavigationBar() {
    const location = useLocation();
    const hideNavBar = location.pathname === '/login' || location.pathname === '/signup';

    if (hideNavBar) return null;

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Digital Payment
                </Typography>
                <Button color="inherit" component={Link} to="/home">Home</Button>
                <Button color="inherit" component={Link} to="/transactions">Transaction</Button>
                <Button color="inherit" component={Link} to="/signup">Signup</Button>
                <Button color="inherit" component={Link} to="/helpcentre">Help Centre</Button>
            </Toolbar>
        </AppBar>
    );
}

function App() {
    return (
        <Router>
            <Container maxWidth="lg">
                <NavigationBar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/transactions" element={<TransactionPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/helpcentre" element={<HelpCentre />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;