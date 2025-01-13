
import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { styled } from '@mui/system';

const HelpContainer = styled(Paper)({
    padding: '20px',
    marginTop: '50px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
});

function HelpCentre() {
    return (
        <Container maxWidth="sm">
            <HelpContainer elevation={3}>
                <Typography variant="h4" gutterBottom>
                    Help Centre
                </Typography>
                <Box>
                    <Typography variant="body1">
                        If you have any questions or need assistance, please contact our support team at support@digitalpayment.com.
                    </Typography>
                </Box>
            </HelpContainer>
        </Container>
    );
}

export default HelpCentre;
