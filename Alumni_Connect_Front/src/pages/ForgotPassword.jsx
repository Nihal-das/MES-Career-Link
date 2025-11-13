import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/users/forgot-password', { email });
            setMessage(response.data);
            setError('');
        } catch (err) {
            setError(err.response ? err.response.data : 'Error in forgot password process.');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            {message && <p className="text-green-500 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleForgotPassword}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded w-full"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
        </div>
    );
}