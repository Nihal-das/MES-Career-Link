import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:8080/users/all', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                console.log('Fetched Users:', response.data);
                setUsers(response.data);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('There was an error fetching the users. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await axios.delete(`http://localhost:8080/users/delete/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('There was an error deleting the user. Please try again later.');
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Admin Dashboard</h2>

            {loading ? (
                <div className="loading-container">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    {error && <p className="error">{error}</p>}

                    <div className="dashboard-actions">
                        <Link to="/logout">
                            <button className="btn btn-danger">Logout</button>
                        </Link>
                        <Link to="/add-user">
                            <button className="btn btn-primary">Add New User</button>
                        </Link>
                        <Link to="/admin-approvals">
                            <button className="btn btn-primary">Admin Approvals</button>
                        </Link>
                    </div>

                    <h3>User List</h3>

                    {users.length === 0 ? (
                        <p>No users available.</p>
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
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <Link to={`/edit-user/${user.id}`} className="btn btn-warning">Edit</Link>
                                            <button onClick={() => handleDelete(user.id)} className="btn btn-danger">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;