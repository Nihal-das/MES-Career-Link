import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/users/signup', formData);
            setMessage('🎉 Registration successful! Please wait for admin approval.');
        } catch (err) {
            setError('⚠️ Error during registration. Please try again later.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 className="text-center mb-4 text-primary">Create an Account</h2>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Enter your email address"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Create a secure password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="STUDENT">Student</option>
                            <option value="ALUMNI">Alumni</option>
                            <option value="TEACHER">Teacher</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/login" className="text-decoration-none">
                        Already have an account? <strong>Login</strong>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
