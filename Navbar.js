import React from "react";
import { AppBar, Tabs, Tab, Toolbar, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const [value, setValue] = React.useState(location.pathname);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    React.useEffect(() => {
        // Update the selected tab based on the current route
        setValue(location.pathname);
    }, [location]);

    return (
        <AppBar position="static">
            <Toolbar>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="inherit"
                    indicatorColor="secondary"
                >
                    <Tab label="Home" value="/home" component={Link} to="/home" />
                    <Tab label="Transactions" value="/transactions" component={Link} to="/transactions" />
                    <Tab label="Recurring Payment" value="/recurring-payment" component={Link} to="/recurring-payment" />
                    <Tab label="Smart Savings" value="/smart-savings" component={Link} to="/smart-savings" />
                    <Tab label="Help Center" value="/help" component={Link} to="/help" />
                </Tabs>
                <Button
                    color="inherit"
                    component={Link}
                    to="/logout"
                  //  style={{ marginLeft: "auto" }} // Align Logout button to the right
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
