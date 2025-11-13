import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });

                // Clear localStorage
                localStorage.removeItem("username");
                localStorage.removeItem("role");
                localStorage.removeItem("token");

                console.log("Logged out successfully");
            } catch (error) {
                console.error("Error logging out:", error);
            } finally {
                // Redirect user to login page
                navigate("/login");
            }
        };

        logout();
    }, [navigate]);

    return <div>Logging out...</div>; // Simple message while logging out
}
