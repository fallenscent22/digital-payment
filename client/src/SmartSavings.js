const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
import React, { useState, useEffect } from 'react';
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

function formatINR(amount) {
    return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SmartSavings() {
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [message, setMessage] = useState('');
    const [savingsGoals, setSavingsGoals] = useState([]);

    useEffect(() => {
        // Fetch all savings goals for logged-in user
        const token = localStorage.getItem('token');
        if (!token) return;
        axios.get(`${REACT_APP_API_BASE_URL}/api/user`, { params: { token } })
            .then(res => {
                setSavingsGoals(res.data.user.savingsGoals || []);
            })
            .catch(() => setSavingsGoals([]));
    }, []);

    const handleAddGoal = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${REACT_APP_API_BASE_URL}/api/savings-goal`, { goalName, targetAmount, token });
            setMessage('Savings goal added');
            // Optionally refresh savings goals list
            const res = await axios.get(`${REACT_APP_API_BASE_URL}/api/user`, { params: { token } });
            setSavingsGoals(res.data.user.savingsGoals || []);
        } catch (error) {
            setMessage('Failed to add savings goal');
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
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>My Savings Goals</Typography>
                    {savingsGoals.length === 0 ? (
                        <Typography variant="body2">No savings goals found.</Typography>
                    ) : (
                        savingsGoals.map((goal, idx) => (
                            <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                                <Typography variant="body1">Goal: {goal.goalName}</Typography>
                                <Typography variant="body1">Target Amount: {formatINR(goal.targetAmount)}</Typography>
                                <Typography variant="body2">Current Amount: {formatINR(goal.currentAmount || 0)}</Typography>
                            </Paper>
                        ))
                    )}
                </Box>
            </PageContainer>
        </Container>
    );
}

export default SmartSavings;