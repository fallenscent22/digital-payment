import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const FormContainer = styled(Paper)({
    padding: '20px',
    marginTop: '50px',
    textAlign: 'center',
});

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async () => {
        try {
            await axios.post('http://localhost:5000/api/forgot-password', { email, phoneNumber });
            setMessage('Password reset instructions have been sent to your email or phone.');
        } catch (error) {
            setMessage('Failed to send reset instructions.');
        }
    };

    return (
        <Container maxWidth="sm">
            <FormContainer elevation={3}>
                <Typography variant="h4" gutterBottom>
                    Forgot Password
                </Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Typography variant="body1" gutterBottom>
                    OR
                </Typography>
                <TextField
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Box mt={2}>
                    <Button variant="contained" color="primary" onClick={handleReset} fullWidth>
                        Reset Password
                    </Button>
                </Box>
                {message && (
                    <Box mt={2}>
                        <Typography variant="body2" color="textSecondary">
                            {message}
                        </Typography>
                    </Box>
                )}
            </FormContainer>
        </Container>
    );
}

export default ForgotPassword;