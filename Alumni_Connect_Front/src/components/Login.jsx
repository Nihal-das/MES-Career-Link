import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username) {
            setError("Username is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/login',
                { username, password },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );

            const { role, userId, token } = response.data;

            if (!userId || !role) {
                throw new Error("Invalid response from backend.");
            }

            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', role);
            localStorage.setItem('token', token);

            if (role.toLowerCase() === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/home');
            }

        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 401) {
                    setError("Invalid credentials, please try again.");
                } else if (status === 400) {
                    setError("Bad request. Please check your input.");
                } else {
                    setError(error.response.data?.message || "An error occurred. Please try again.");
                }
            } else {
                setError("Network error, please check your connection.");
            }
            console.error('Login error:', error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4 border-0" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center text-primary mb-4 fw-bold">Login to Your Account</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && (
                        <div className="alert alert-danger py-2" role="alert">
                            {error}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <div className="text-center mt-3">
                        <Link to="/forgot-password" className="text-decoration-none text-muted d-block">
                            Forgot Password?
                        </Link>
                        <Link to="/signup" className="text-decoration-none d-block mt-2">
                            <strong className="text-primary">New User? Register here</strong>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
