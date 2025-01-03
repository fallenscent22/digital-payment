import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, TextField, Button } from '@mui/material';
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
    const [receiverUpiId, setReceiverUpiId] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/user', {
                    params: { token }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleSendMoney = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/send-money', { receiverUpiId, amount, token });
            setMessage('Transaction successful');
            navigate('/home'); // Navigate to home page to refresh transaction history
        } catch (error) {
            setMessage('Transaction failed');
            console.error('Error sending money:', error);
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
                        <Typography variant="h6">Welcome, {user.email}</Typography>
                        <Typography variant="body1">User ID: {user.userId}</Typography>
                        <Typography variant="body1">UPI ID: {user.upiId}</Typography>
                        <Typography variant="body1">Balance: ${user.balance}</Typography>
                    </Box>
                )}
                <Box mt={3}>
                    <TextField
                        label="Receiver UPI ID"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={receiverUpiId}
                        onChange={(e) => setReceiverUpiId(e.target.value)}
                        required
                    />
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
                        <Button variant="contained" color="primary" onClick={handleSendMoney} fullWidth>
                            Send Money
                        </Button>
                    </Box>
                    {message && (
                        <Typography variant="body2" color="error" mt={2}>
                            {message}
                        </Typography>
                    )}
                </Box>
            </PageContainer>
        </Container>
    );
}

export default TransactionPage;