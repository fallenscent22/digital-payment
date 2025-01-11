import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/system';

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

const TransactionItem = styled(ListItem)({
    backgroundColor: '#ffffff',
    marginBottom: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

function Home() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/user', {
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
                const response = await axios.get('http://localhost:5000/api/transactions', {
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

    // Getters for user properties
    const getUserEmail = () => user?.email || 'No email available';
    const getUserUpiId = () => user?.upiId || 'No UPI ID available';
    const getUserBalance = () => user?.balance ?? 'Balance unavailable';

    return (
        <Container maxWidth="lg">
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
            <HistoryContainer elevation={3}>
                <Typography variant="h4" gutterBottom style={{ color: '#3f51b5' }}>
                    Transaction History
                </Typography>
                <List>
                    {transactions.map((transaction) => (
                        <TransactionItem key={transaction._id}>
                            <ListItemText
                                primary={`Transaction ID: ${transaction._id}`}
                                secondary={`Amount: $${transaction.amount} - Date: ${new Date(transaction.date).toLocaleString()}`}
                            />
                        </TransactionItem>
                    ))}
                </List>
            </HistoryContainer>
        </Container>
    );
}

export default Home;