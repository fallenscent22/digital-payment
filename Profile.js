import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const ProfileContainer = styled(Paper)({
    padding: '20px',
    marginTop: '50px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
});

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in again.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching user data. Please try again.');
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <ProfileContainer elevation={3}>
                <Typography variant="h4" gutterBottom>
                    User Profile
                </Typography>
                {user && (
                    <Box>
                        <Typography variant="h6">Email: {user.email}</Typography>
                        <Typography variant="body1">UPI ID: {user.upiId}</Typography>
                        <Typography variant="body1">Balance: ${user.balance}</Typography>
                    </Box>
                )}
            </ProfileContainer>
        </Container>
    );
}

export default Profile;
