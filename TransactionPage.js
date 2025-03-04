import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, TextField, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled(Paper)({
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',  
    borderRadius: '10px',
});

function TransactionPage() {
    const [user, setUser] = useState(null);
    const [receiverPhoneNumber, setReceiverPhoneNumber] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneNumberLoading, setPhoneNumberLoading] = useState(false);
    const [debouncedPhoneNumber, setDebouncedPhoneNumber] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/api/user', {
                    params: { token },
                });
                setUser(response.data.user);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        if (!debouncedPhoneNumber) return;

        const fetchReceiverData = async () => {
            setReceiverName('');
            setPhoneNumberLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/get-receiver', {
                    params: {  phoneNumber: debouncedPhoneNumber ,token:localStorage.getItem('token') },
                });
                setReceiverName(response.data.name || 'Receiver not found');
            } catch (error) {
                console.error('Error fetching receiver data:', error);
                setReceiverName('Error fetching receiver details');
            } finally {
                setPhoneNumberLoading(false);
            }
        };

        fetchReceiverData();
    }, [debouncedPhoneNumber]);

    const handleReceiverPhoneNumberChange = (e) => {
        const phoneNumber = e.target.value;
        setReceiverPhoneNumber(phoneNumber);
        setMessage('');
        if (phoneNumber) {
            // Debouncing the input to reduce API calls
            clearTimeout(window.debounceTimeout);
            window.debounceTimeout = setTimeout(() => {
                setDebouncedPhoneNumber(phoneNumber);
            }, 500); // Adjust the debounce delay as needed
        } else {
            setReceiverName('');
        }
    };

    const handleSendMoney = async () => {
        const parsedAmount = parseFloat(amount);
        if (!receiverPhoneNumber || isNaN(parsedAmount) || parsedAmount <= 0) {
            setMessage('Please enter a valid Phone Number and a positive amount.');
            return;
        }
        if (!receiverName || receiverName === 'Receiver not found') {
            setMessage('Please confirm the receiver\'s details before proceeding.');
            return;
        }

        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/send-money', {
                receiverPhoneNumber,
                amount: parsedAmount,
                token,
            });
            setMessage('Transaction successful!');
            setTimeout(() => navigate('/home'), 2000);
        } catch (error) {
            setMessage('Transaction failed. Please try again.');
            console.error('Error sending money:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <PageContainer elevation={3}>
                <Typography variant="h4" gutterBottom style={{ color: '#3f51b5' }}>
                    Transaction Page
                </Typography>
                {user && (
                    <Box>
                        <Typography variant="h6">Name: {user.name}</Typography>
                        <Typography variant="h6">Email: {user.email}</Typography>
                        <Typography variant="body1">User ID: {user.userId}</Typography>
                        <Typography variant="body1">UPI ID: {user.upiId}</Typography>
                       {/* <Typography variant="body1">Phone Number: {user.phoneNumber}</Typography>*/}
                        <Typography variant="body1">Balance: ${user.balance}</Typography>
                    </Box>
                )}
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
                    {phoneNumberLoading? (
                        <CircularProgress size={24} style={{ marginTop: 10 }} />
                    ) : (
                        receiverName && (
                            <Typography variant="body2" color="textSecondary" mt={1}>
                                Receiver Name: {receiverName}
                            </Typography>
                        )
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
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendMoney}
                            fullWidth
                            disabled={loading || phoneNumberLoading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Send Money'}
                        </Button>
                    </Box>
                    {message && (
                        <Typography variant="body2" color={message.includes('successful') ? 'primary' : 'error'} mt={2}>
                            {message}
                        </Typography>
                    )}
                </Box>
            </PageContainer>
        </Container>
    );
}

export default TransactionPage;
