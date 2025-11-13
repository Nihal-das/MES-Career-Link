import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        role: "",
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8080/users/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            navigate("/admin-dashboard");
        } catch (err) {
            console.error("Error creating user:", err.response);
            const errorMsg = err.response?.data?.error || "Error creating user.";
            setError(errorMsg);
        }
    };

    return (
        <>
        <div className="add-user">
            <h2>Add New User</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Username
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Role
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="">Select Role</option>
                        <option value="ADMIN">Admin</option>
                        <option value="ALUMNI">Alumni</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="STUDENT">Student</option>
                    </select>
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Create User</button>
            </form>
            </div>


            <Link to="/admin-dashboard">Go back</Link>
        
        </>
    );
};

export default AddUser;
