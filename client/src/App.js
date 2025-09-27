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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Payment from "./Payment";
import TransactionHistory from "./TransactionHistory"; 

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log("Stripe Key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);   // now its working, don't worry about this



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
                <Elements stripe={stripePromise}>
                    <AppLayout>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/transactions" element={<TransactionPage />} />
                            <Route path="/help" element={<HelpCentre />} />
                            <Route path="/recurring-payment" element={<RecurringPayment />} />
                            <Route path="/smart-savings" element={<SmartSavings />} />
                            <Route path="/payment" element={<Payment />} />
                            <Route path="/transaction-history" element={<TransactionHistory />} />
                            <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
                            {/*  <Route path="/profile" element={<Profile />} /> */}
                        </Routes>
                    </AppLayout>
                </Elements>
            </Container>
        </Router>
    );
}

export default App;