import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';    

const EditUser = () => {
    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: '',
        role: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Unauthorized: No token found');
                    return;
                }

                const response = await axios.get(`http://localhost:8080/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUserData(response.data);
            } catch (err) {
                setError('Error fetching user details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData.name || !userData.username || !userData.email || !userData.role) {
            setError("All fields are required");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized: No token found');
                return;
            }

            await axios.put(`http://localhost:8080/users/update/${id}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            navigate('/admin-dashboard');
        } catch (err) {
            setError('Error updating user.');
            console.error(err);
        }
    };

    if (loading) return <div>Loading user details...</div>;

    return (
        <div className="edit-user">
            <h2>Edit User</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Role</label>
                    <select
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="ALUMNI">Alumni</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="STUDENT">Student</option>
                    </select>
                </div>
                <button type="submit">Update User</button>
            </form>

            <Link to="/admin-dashboard">Go back</Link>
        </div>
       
    );
};

export default EditUser;
