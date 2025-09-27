import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import Navbar from "./Navbar"; // Import Navbar component
import Login from "./Login"; // Login page
import Signup from "./Signup"; // Signup page
import Home from "./Home"; // Home page
import TransactionPage from "./TransactionPage"; // Transactions page
import HelpCentre from "./HelpCentre"; // Help Center page
import RecurringPayment from "./RecurringPayment"; // Recurring Payment page
import SmartSavings from "./SmartSavings"; // Smart Savings page
import Logout from "./Logout"; // Logout component

function AppLayout({ children }) {
    const location = useLocation();

    // Hide Navbar for Login and Signup pages
    const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

    return (
        <>
            {!hideNavbar && <Navbar />}
            <div>{children}</div>
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
                        <Route path="/home" element={<Home />} />
                        <Route path="/transactions" element={<TransactionPage />} />
                        <Route path="/help" element={<HelpCentre />} /> {/* Ensure the route matches Navbar */}
                        <Route path="/recurring-payment" element={<RecurringPayment />} />
                        <Route path="/smart-savings" element={<SmartSavings />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
                      {/*  <Route path="/profile" element={<Profile />} /> */}
                    </Routes>
                </AppLayout>
            </Container>
        </Router>
    );
}

export default App;
