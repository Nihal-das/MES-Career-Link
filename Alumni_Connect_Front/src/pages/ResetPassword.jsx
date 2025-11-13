import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ResetPassword() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword) {
            setError('Password is required');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/users/reset-password', null, {
                params: { token, newPassword }
            });
            setMessage(response.data);
            setError('');
        } catch (err) {
            setError(err.response ? err.response.data : 'Error in reset password process.');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            {message && <p className="text-green-500 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleResetPassword}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full p-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded w-full"
                    disabled={loading}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}