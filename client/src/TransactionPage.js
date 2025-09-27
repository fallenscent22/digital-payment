import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, TextField, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-scanner';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

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
    const [receiverUpiId, setReceiverUpiId] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneNumberLoading, setPhoneNumberLoading] = useState(false);
    const [debouncedPhoneNumber, setDebouncedPhoneNumber] = useState('');
    const [scanMode, setScanMode] = useState(false);

    const stripe = useStripe();
    const elements = useElements();
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

    const handleReceiverPhoneNumberChange = (e) => {
        const phoneNumber = e.target.value;
        setReceiverPhoneNumber(phoneNumber);
        setMessage('');
        clearTimeout(window.debounceTimeout);
        if (phoneNumber.length === 10) { // Only query when 10 digits
            window.debounceTimeout = setTimeout(() => {
                setDebouncedPhoneNumber(phoneNumber);
            }, 500);
        } else {
            setReceiverName('');
        }
    };

    useEffect(() => {
        if (debouncedPhoneNumber.length !== 10) return; // Only fetch if 10 digits

        const fetchReceiverData = async () => {
            setReceiverName('');
            setPhoneNumberLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/get-receiver', {
                    params: { phoneNumber: debouncedPhoneNumber, token: localStorage.getItem('token') },
                });
                setReceiverName(response.data.name || 'Receiver not found');
            } catch (error) {
                console.error('Error fetching receiver data:', error.response);
                setReceiverName('Error fetching receiver details');
            } finally {
                setPhoneNumberLoading(false);
            }
        };

        fetchReceiverData();
    }, [debouncedPhoneNumber]);

    const handleScan = async (data) => {
        if (data?.text) {
            const scannedUpi = data.text.trim();
            console.log("Scanned UPI ID:", scannedUpi);

            try {
                const response = await axios.get('http://localhost:5000/api/get-receiver', {
                    params: { upiId: scannedUpi, token: localStorage.getItem('token') },
                });

                setReceiverPhoneNumber(response.data.phoneNumber || "");
                setReceiverName(response.data.name || "Receiver not found");
                setReceiverUpiId(response.data.upiId || ""); //added newly
                setScanMode(false);
            } catch (error) {
                console.error('Error fetching receiver data:', error);
                setReceiverName('Error fetching receiver details');
            }
        }
    };

    const toggleScanner = () => {
        setScanMode(!scanMode);
        setReceiverPhoneNumber('');
        setReceiverName('');
    };

    const handleError = (err) => {
        console.error('QR Scan Error:', err);
    };

    const handleSendMoney = async () => {
        const parsedAmount = parseFloat(amount);
        // Prevent sending money to self
        if (receiverPhoneNumber === user?.phoneNumber) {
            setMessage("You cannot send money to yourself.");
            return;
        }

        // Balance check
        if (user && parsedAmount > user.balance) {
            setMessage(`Insufficient balance. Your balance is ${formatINR(user.balance)}.`);
            return;
        }
        if (!receiverPhoneNumber || isNaN(parsedAmount) || parsedAmount <= 0) {
            setMessage('Please enter a valid Phone Number and a positive amount.');
            return;
        }
        if (!receiverName || receiverName === 'Receiver not found') {
            setMessage('Please confirm the receiver\'s details before proceeding.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("User not authenticated");
            return;
        }

        setLoading(true);
        try {
            //Creating PaymentIntent from backend
            const { data } = await axios.post("http://localhost:5000/api/payment/create-payment-intent", {
                amount: parsedAmount,
            });

            // to Confirm payment on client side
            const clientSecret = data.clientSecret;
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                setMessage("Card element not found.");
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (result.error) {
                setMessage(`Payment failed: ${result.error.message}`);
            } else if (result.paymentIntent?.status === "succeeded") {
                await axios.post("http://localhost:5000/api/send-money", {
                    receiverPhoneNumber,
                    receiverUpiId,
                    amount: parsedAmount,
                    token,
                });

                setMessage("✅ Transaction successful!");
                setTimeout(() => navigate("/home"), 2000);
            }
        } catch (error) {
            console.error("Error in payment flow:", error);
            setMessage("Transaction failed. Please try again.");
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
                        <Typography variant="body1">Balance: ${user.balance}</Typography>
                    </Box>
                )}
                <Box mt={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <TextField
                            label="Receiver Phone Number/UPI ID"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={receiverPhoneNumber}
                            onChange={handleReceiverPhoneNumberChange}
                            required
                        />
                        <Button
                            variant="outlined"
                            onClick={toggleScanner}
                            sx={{ height: 56 }}
                        >
                            {scanMode ? 'Close Scanner' : 'Scan QR'}
                        </Button>
                    </Box>
                </Box>

                {scanMode && (
                    <Box mb={2}>
                        <Typography variant="h6">Scan QR Code</Typography>
                        <QrReader
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}
                        />
                    </Box>
                )}
                {phoneNumberLoading && <CircularProgress size={24} />}
                {receiverName && !phoneNumberLoading && (
                    <Typography variant="body2" mb={2}>Receiver Name: {receiverName}</Typography>
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
                    <Typography variant="body1" mb={1}>Card Details:</Typography>
                    <CardElement
                        options={{
                            style: {
                                base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                                invalid: { color: '#9e2146' },
                            },
                        }}
                    />
                </Box>

                <Box mt={3}>
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
                    <Typography
                        variant="body2"
                        color={message.includes('successful') ? 'primary' : 'error'}
                        mt={2}
                    >
                        {message}
                    </Typography>
                )}
            </PageContainer>
        </Container>
    );
}

export default TransactionPage;