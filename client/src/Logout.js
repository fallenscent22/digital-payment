import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user data from localStorage or session storage
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Optional: Remove other stored user-related data

        // Redirect the user to the login page
        navigate("/login", { replace: true }); // Prevent navigating back to the logout page
    }, [navigate]);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
}

export default Logout;