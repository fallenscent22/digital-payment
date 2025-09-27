import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, InputAdornment, IconButton} from '@mui/material';
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

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);  // New state for password visibility
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${REACT_APP_API_BASE_URL}/api/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            alert('Login Successful!');
            navigate('/home'); // Navigate to the home page after login
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Invalid email or password');
            } else {
                setError('Login Failed');
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

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        InputProps={{
                            style: { color: 'white' }, // Set the typed text color to white
                        }}
                        InputLabelProps={{
                            style: { color: 'white' }, // Set the label (placeholder) text color to white
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
                            style: { color: 'white' }, // Set the typed text color to white
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{
                            style: { color: 'white' }, // Set the label (placeholder) text color to white
                        }}
                    />

                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}
                    <Box mt={2}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Login
                        </Button>
                    </Box>
                </form>
                
                {/* Signup Link */}
                <Box mt={2}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                        Don't have an account? <Link to="/signup" style={{ color: '#ADD8E6', textDecoration: 'none' }}>Signup</Link>
                    </Typography>
                </Box>
            </FormContainer>
        </Container>
    );
}

export default Login;