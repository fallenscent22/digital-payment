import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import TransactionPage from './TransactionPage';
import Home from './Home';
import HelpCentre from './HelpCentre';
import RecurringPayment from './RecurringPayment';
import SmartSavings from './SmartSavings';
import AppLayout from './AppLayout';  // Import the AppLayout component
import Logout from './Logout';  // Import the Logout component

function App() {
    return (
        <Router>
            <Container maxWidth="lg">
                <AppLayout>  {/* Wrap routes in AppLayout */}
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/transactions" element={<TransactionPage />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/helpcentre" element={<HelpCentre />} />
                        <Route path="/recurring-payment" element={<RecurringPayment />} />
                        <Route path="/smart-savings" element={<SmartSavings />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </AppLayout>
            </Container>
        </Router>
    );
}

export default App;
