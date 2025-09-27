import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const PageContainer = styled(Paper)({
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
});

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function formatINR(amount) {
    return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function RecurringPayment() {
    const [receiverPhoneNumber, setReceiverPhoneNumber] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneNumberLoading, setPhoneNumberLoading] = useState(false);
    const [debouncedPhoneNumber, setDebouncedPhoneNumber] = useState('');
    const [recurringPayments, setRecurringPayments] = useState([]);

    useEffect(() => {
        // Fetch all recurring payments for logged-in user
        const token = localStorage.getItem('token');
        if (!token) return;
        axios.get(`${REACT_APP_API_BASE_URL}/api/user`, { params: { token } })
            .then(res => {
                setRecurringPayments(res.data.recurringPayments || []);
            })
            .catch(() => setRecurringPayments([]));
    }, []);

    const handleReceiverPhoneNumberChange = (e) => {
        const phoneNumber = e.target.value;
        setReceiverPhoneNumber(phoneNumber);
        setMessage('');
        clearTimeout(window.debounceTimeout);
        if (phoneNumber.length === 10) {
            window.debounceTimeout = setTimeout(() => {
                setDebouncedPhoneNumber(phoneNumber);
            }, 500);
        } else {
            setReceiverName('');
        }
    };

    useEffect(() => {
        if (debouncedPhoneNumber.length !== 10) return;
        const fetchReceiverData = async () => {
            setReceiverName('');
            setPhoneNumberLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${REACT_APP_API_BASE_URL}/api/get-receiver`, {
                    params: { phoneNumber: debouncedPhoneNumber, token },
                });
                setReceiverName(response.data.name || 'Receiver not found');
            } catch (error) {
                setReceiverName('Error fetching receiver details');
            } finally {
                setPhoneNumberLoading(false);
            }
        };
        fetchReceiverData();
    }, [debouncedPhoneNumber]);

    const handleSchedulePayment = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setLoading(true);
        try {
            await axios.post(`${REACT_APP_API_BASE_URL}/api/recurring-payment`, { receiverPhoneNumber, amount, frequency, token });
            setMessage('Recurring payment scheduled');
            // Optionally refresh recurring payments list
            const res = await axios.get(`${REACT_APP_API_BASE_URL}/api/user`, { params: { token } });
            setRecurringPayments(res.data.recurringPayments || []);
        } catch (error) {
            setMessage('Failed to schedule recurring payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <PageContainer elevation={3}>
                <Typography variant="h4" gutterBottom style={{ color: '#3f51b5' }}>
                    Recurring Payment
                </Typography>
                <Box mt={3}>
                    <TextField
                        label="Receiver Phone Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={receiverPhoneNumber}
                        onChange={handleReceiverPhoneNumberChange}
                        required
                    />
                    {phoneNumberLoading && <CircularProgress size={24} />}
                    {receiverName && !phoneNumberLoading && (
                        <Typography variant="body2" color={receiverName === 'Receiver not found' ? 'error' : 'textSecondary'} mt={1}>
                            Receiver Name: {receiverName}
                        </Typography>
                    )}
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <TextField
                        label="Frequency"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        required
                    >
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                    </TextField>
                    <Box mt={2}>
                        <Button variant="contained" color="primary" onClick={handleSchedulePayment} fullWidth disabled={loading}>
                            {loading ? 'Scheduling...' : 'Schedule Payment'}
                        </Button>
                    </Box>
                    {message && (
                        <Typography variant="body2" color={message.includes('successfully') ? 'primary' : 'error'} mt={2}>
                            {message}
                        </Typography>
                    )}
                </Box>
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>My Recurring Payments</Typography>
                    {recurringPayments.length === 0 ? (
                        <Typography variant="body2">No recurring payments found.</Typography>
                    ) : (
                        recurringPayments.map((rp, idx) => (
                            <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="body1">Receiver: {rp.receiverName || rp.receiverId}</Typography>
                                <Typography variant="body1">Amount: {formatINR(rp.amount)}</Typography>
                                <Typography variant="body1">Frequency: {rp.frequency}</Typography>
                                <Typography variant="body2">
                                    Next Payment: {rp.nextPaymentDate ? new Date(rp.nextPaymentDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : ''}
                                </Typography>
                            </Paper>
                        ))
                    )}
                </Box>
            </PageContainer>
        </Container>
    );
}

export default RecurringPayment;