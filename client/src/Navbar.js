import React from "react";
import { AppBar, Tabs, Tab, Toolbar, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    //const [value, setValue] = React.useState(location.pathname);
    const [value, setValue] = React.useState(
        ["/home", "/transactions", "/recurring-payment", "/smart-savings", "/help"].includes(location.pathname)
            ? location.pathname
            : "/home"
    );
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
        navigate(newValue); // Navigate to the new path
    };

    const handleLogout = () => {
        // Clear user session (Modify this as per your auth system)
        localStorage.removeItem("userToken");
        navigate("/login"); // Redirect to login page
    };

    React.useEffect(() => {
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
                    onClick={handleLogout}
                    style={{ marginLeft: "auto" }} // Align Logout button to the right
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;