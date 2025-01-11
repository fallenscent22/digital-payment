import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';

const PageContainer = styled(Paper)({
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
});

function SmartSavings() {
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleAddGoal = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/savings-goal', { goalName, targetAmount, token });
            setMessage('Savings goal added');
        } catch (error) {
            setMessage('Failed to add savings goal');
            console.error('Error adding savings goal:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <PageContainer elevation={3}>
                <Typography variant="h4" gutterBottom style={{ color: '#3f51b5' }}>
                    Smart Savings
                </Typography>
                <Box mt={3}>
                    <TextField
                        label="Goal Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Target Amount"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                    />
                    <Box mt={2}>
                        <Button variant="contained" color="primary" onClick={handleAddGoal} fullWidth>
                            Add Goal
                        </Button>
                    </Box>
                    {message && (
                        <Typography variant="body2" color="error" mt={2}>
                            {message}
                        </Typography>
                    )}
                </Box>
            </PageContainer>
        </Container>
    );
}

export default SmartSavings;