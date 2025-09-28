import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box } from '@mui/material';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function formatINR(amount) {
    return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found in localStorage.");
            return;
        }
        console.log("Fetching transactions with token:", token);
        axios.get(`${REACT_APP_API_BASE_URL}/api/transactions`, { params: { token } })
            .then(res => {
                console.log("Transaction API response:", res.data);
                setTransactions(res.data || []);
            })
            .catch((err) => {
                console.error("Error fetching transactions:", err);
                setTransactions([]);
            });
    }, []);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom style={{ color: '#3f51b5' }}>
                Transaction History
            </Typography>
            <Box mt={3}>
                {transactions.length === 0 ? (
                    <Typography variant="body2">No transactions found.</Typography>
                ) : (
                    [...transactions]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((tx, idx) => (
                            <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="body1">Amount: {formatINR(tx.amount)}</Typography>
                                <Typography variant="body1">Receiver: {tx.receiverName} ({tx.receiverPhoneNumber})</Typography>
                                <Typography variant="body2">Date: {tx.date ? new Date(tx.date).toLocaleString() : ''}</Typography>
                            </Paper>
                        ))
                )}
            </Box>
        </Container>
    );
}

export default TransactionHistory;