import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper,InputAdornment, IconButton} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);  // New state for password visibility
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[6-9]\d{9}$/; // Matches a 10-digit Indian phone number starting with 6-9
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
            await axios.post('http://localhost:5000/api/register', { name, email, password, phoneNumber });
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
                <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
                    Digital Payment
                </Typography>

                {/* Signup Form */}
                <form onSubmit={handleSubmit}>
                <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        InputProps={{
                            style: { color: 'white' }, // Set typed text color to white
                        }}
                        InputLabelProps={{
                            style: { color: 'white' }, // Set placeholder text color to white
                        }}
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
                        InputProps={{
                            style: { color: 'white' }, // Set typed text color to white
                        }}
                        InputLabelProps={{
                            style: { color: 'white' }, // Set placeholder text color to white
                        }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type={showPassword ? 'text' : 'password'}  // Toggle password visibility
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            style: { color: 'white' },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ), // Set typed text color to white
                        }}
                        InputLabelProps={{
                            style: { color: 'white' }, // Set placeholder text color to white
                        }}
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
                        InputProps={{
                            style: { color: 'white' }, // Set typed text color to white
                        }}
                        InputLabelProps={{
                            style: { color: 'white' }, // Set placeholder text color to white
                        }}
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