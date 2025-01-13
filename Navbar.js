import React from 'react';
import { AppBar, Tabs, Tab, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const [value, setValue] = React.useState(location.pathname);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Home" value="/home" component={Link} to="/home" />
                    <Tab label="Transactions" value="/transactions" component={Link} to="/transactions" />
                    <Tab label="Signup" value="/signup" component={Link} to="/signup" />
                    <Tab label="Login" value="/login" component={Link} to="/login" />
                    <Tab label="Help Center" value="/help" component={Link} to="/help" />
                </Tabs>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;