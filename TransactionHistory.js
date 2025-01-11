import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/system';

const HistoryContainer = styled(Paper)({
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center',
});

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/payments', {
                    params: { token }
                });
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <Container maxWidth="lg">
            <HistoryContainer elevation={3}>
                <Typography variant="h6" gutterBottom>
                    Transaction History
                </Typography>
                <List>
                    {transactions.map((transaction) => (
                        <ListItem key={transaction._id}>
                            <ListItemText
                                primary={`Transaction ID: ${transaction.transactionId}`}
                                secondary={`Amount: $${transaction.amount} - Date: ${new Date(transaction.date).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </HistoryContainer>
        </Container>
    );
}

export default TransactionHistory;