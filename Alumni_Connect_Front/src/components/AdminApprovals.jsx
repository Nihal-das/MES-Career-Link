import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminApprovals = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/users/pending', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                setPendingUsers(response.data);
            } catch (err) {
                setError('There was an error fetching the pending users. Please try again later.');
            }
        };

        if (token) fetchPendingUsers();
    }, [token]);

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:8080/users/approve/${id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setPendingUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
        } catch (err) {
            setError('There was an error approving the user. Please try again later.');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`http://localhost:8080/users/reject/${id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setPendingUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
        } catch (err) {
            setError('There was an error rejecting the user. Please try again later.');
        }
    };

    return (
        <div className="approvals-container">
            <h2>Admin Approvals</h2>
            {error && <p className="error">{error}</p>}
            {pendingUsers.length === 0 ? (
                <p>No pending user approvals.</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleApprove(user.id)} className="btn btn-success">
                                        Approve
                                    </button>
                                    <button onClick={() => handleReject(user.id)} className="btn btn-danger">
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminApprovals;