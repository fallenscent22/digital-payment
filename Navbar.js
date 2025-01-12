import React from 'react';
import { AppBar, Tabs, Tab, Toolbar, Button } from '@mui/material';
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
                    <Tab label="Recurring Payment" value="/recurring-payment" component={Link} to="/recurring-payment" />
                    <Tab label="Smart Savings" value="/smart-savings" component={Link} to="/smart-savings" />
                    <Tab label="Help Center" value="/helpcentre" component={Link} to="/helpcentre" />
                </Tabs>
              <Button color="inherit" component={Link} to="/logout">Logout</Button> {/* Link to Logout component */}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
