const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { QRCodeCanvas } from 'qrcode.react'; // QR code library

const FormContainer = styled(Paper)({
    padding: '20px',
    marginTop: '50px',
    textAlign: 'center',
    backgroundImage: 'url(/digitalwalletbackground.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [qrCodeData, setQrCodeData] = useState(null); // For storing QR code data
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value && !validateEmail(value)) {
            setEmailError('Enter a valid email');
        } else {
            setEmailError('');
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        if (value && !validatePhoneNumber(value)) {
            setPhoneError('Enter a valid phone number');
        } else {
            setPhoneError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setEmailError('');
        setPhoneError('');
        setError('');

        if (!validateEmail(email)) {
            setEmailError('Enter a valid email');
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            setPhoneError('Enter a valid phone number');
            return;
        }

        try {
            const response = await axios.post(`${REACT_APP_API_BASE_URL}/api/register`, { name, email, password, phoneNumber });
          //  const { qrCode } = response.data; // Expecting `qrCode` from backend
          //  setQrCodeData(qrCode);
           // Show QR code before redirect
            setQrCodeData(response.data.upiId);
            alert('Signup Successful!');
            navigate('/login'); // Optionally navigate to login page after signup
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
                <Box mb={3}>
                    <img src="/logo.png" alt="Logo" style={{ width: '150px', height: 'auto' }} />
                </Box>

                <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
                    Digital Payment
                </Typography>

                {qrCodeData ? (
                    <Box textAlign="center" mt={4}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                            Your QR Code:
                        </Typography>
                        <QRCodeCanvas value={qrCodeData} size={200} />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/login')}
        >
            Proceed to Login
        </Button>
    </Box>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={handleEmailChange}
                            error={!!emailError}
                            helperText={emailError}
                            required
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                style: { color: 'white' },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{ style: { color: 'white' } }}
                        />
                        <TextField
                            label="Phone Number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            error={!!phoneError}
                            helperText={phoneError}
                            required
                            InputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
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
                )}
            </FormContainer>
        </Container>
    );
}

export default Signup;
