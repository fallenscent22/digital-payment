import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
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
                <Typography variant="h4" gutterBottom>
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
                            Login
                        </Button>
                    </Box>
                </form>

                {/* Forgot Password Link */}
                <Box mt={2}>
                    <Typography variant="body2">
                        <Link to="/forgot-password">Forgot your password?</Link>
                    </Typography>
                </Box>

                {/* Signup Link */}
                <Box mt={2}>
                    <Typography variant="body2">
                        Don't have an account? <Link to="/signup">Signup</Link>
                    </Typography>
                </Box>
            </FormContainer>
        </Container>
    );
}

export default Login;