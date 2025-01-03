import React from 'react';
import { Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';

const InfoContainer = styled(Paper)({
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center',
});

function AccountInfo() {
    return (
        <InfoContainer elevation={3}>
            <Typography variant="h6" gutterBottom>
                Account Information
            </Typography>
            <Typography variant="body1">
                Here you can view your account information.
            </Typography>
        </InfoContainer>
    );
}

export default AccountInfo;