import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const FormContainer = styled(Paper)({
    padding: '20px',
    marginTop: '50px',
    textAlign: 'center',
    backgroundImage: 'url(/digitalwalletbackground.jpg)', // Reference the background image from the public directory
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', { email, password, phoneNumber });
            alert('Signup Successful!');
            navigate('/login'); // Navigate to the login page after signup
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Email already registered');
            } else {
                setError('Signup Failed');
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <FormContainer elevation={3}>
                {/* Logo Section */}
                <Box mb={3}>
                    <img src="/logo.png" alt="Logo" style={{ width: '150px', height: 'auto' }} />
                </Box>

                {/* Headline */}
                <Typography variant="h4" gutterBottom>
                    Digital Payment
                </Typography>

                {/* Signup Form */}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    <FormControlLabel
                        control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                        label="Remember me"
                    />
                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}
                    <Box mt={2}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Signup
                        </Button>
                    </Box>
                </form>
            </FormContainer>
        </Container>
    );
}

export default Signup;