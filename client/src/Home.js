import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import { QRCodeCanvas } from 'qrcode.react';

const ProfileContainer = styled(Paper)({
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
});

const HistoryContainer = styled(Paper)({
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
});



const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Home() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${REACT_APP_API_BASE_URL}/api/user`, {
                    params: { token }
                });
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } 
        };

        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${REACT_APP_API_BASE_URL}/api/transactions`, {
                    params: { token }
                });
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchUserData();
        fetchTransactions();
    }, []);

   

    function formatINR(amount) {
        return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return (
        <Container maxWidth="lg">
            <ProfileContainer elevation={3}>
                <Typography variant="h4" gutterBottom>
                    User Profile
                </Typography>
                {user && (
                    <Box>
                        <Typography variant="h6">Name:{user.name}</Typography>
                        <Typography variant="h6">Email: {user.email}</Typography>
                        <Typography variant="body1">UPI ID: {user.upiId}</Typography>
                        <Typography variant="body1">Balance: {formatINR(user.balance)}</Typography>
                        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                            Your QR Code
                        </Typography>
                        <QRCodeCanvas value={user.upiId} size={200} />
                    </Box>
                )}
            </ProfileContainer>
            <HistoryContainer elevation={3}>
                <Typography variant="h4" gutterBottom style={{ color: '#3f51b5' }}>
                    Transaction History
                </Typography>
                <List>
                    {[...transactions]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 5)
                        .map((transaction) => (
                            <ListItem key={transaction._id}>
                                <ListItemText
                                    primary={`Amount: ${formatINR(transaction.amount)}`}
                                    secondary={`To: ${transaction.receiverName} on ${new Date(transaction.date).toLocaleString()}`}
                                />
                            </ListItem>
                        ))}
                </List>
            </HistoryContainer>
        </Container>
    );
}

export default Home;