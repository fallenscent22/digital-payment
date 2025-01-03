import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, TextField, Button, MenuItem } from '@mui/material';
import { styled } from '@mui/system';

const PageContainer = styled(Paper)({
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
});

function RecurringPayment() {
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState('');
    const [message, setMessage] = useState('');

    const handleSchedulePayment = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/recurring-payment', { receiverId, amount, frequency, token });
            setMessage('Recurring payment scheduled');
        } catch (error) {
            setMessage('Failed to schedule recurring payment');
            console.error('Error scheduling recurring payment:', error);
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
                        label="Receiver ID"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={receiverId}
                        onChange={(e) => setReceiverId(e.target.value)}
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
                        <Button variant="contained" color="primary" onClick={handleSchedulePayment} fullWidth>
                            Schedule Payment
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

export default RecurringPayment;