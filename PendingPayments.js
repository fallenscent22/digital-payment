import React from 'react';
import { Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';

const PaymentsContainer = styled(Paper)({
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center',
});

function PendingPayments() {
    return (
        <PaymentsContainer elevation={3}>
            <Typography variant="h6" gutterBottom>
                Pending Payments
            </Typography>
            <Typography variant="body1">
                Here you can view your pending payments.
            </Typography>
        </PaymentsContainer>
    );
}

export default PendingPayments;