import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/EditProfile.css'
import SideNav from './Sidenav';

const EditProfile = () => {
    const [userData, setUserData] = useState({
        username: '',
        name: '',
        email: '',
        designation: '',
        company: '',
        countryOfWork: '',
        gender: '',
        role: '',
        profileImageUrl: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found, please log in.');
                    return;
                }

                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub;
                console.log('Fetching profile for user:', username);

                const response = await axios.get(`http://localhost:8080/users/profile/username/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('User data fetched:', response.data);
                setUserData(response.data);
            } catch (err) {
                setError('Error fetching user profile.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const username = decodedToken.sub;
    
            const formData = new FormData();
            formData.append('userDetails', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }
    
            await axios.put(`http://localhost:8080/users/profile/username/${username}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            const response = await axios.get(`http://localhost:8080/users/profile/username/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
    
            alert('Profile updated successfully!');
            navigate(`/profile/${username}`);
        } catch (err) {
            console.error('Error updating profile:', err);
            if (err.response) {
                // Backend responded with an error
                setError(`Update failed: ${err.response.data.message || err.response.statusText}`);
            } else if (err.request) {
                // No response from server
                setError('No response from server. Please check your connection.');
            } else {
                // Something else went wrong
                setError('Something went wrong while updating the profile.');
            }
        }
    };
    
    
    
    if (loading) {
        return (
           
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        
        <Container className="edit-profile-container mt-5">
        <SideNav />
        <Row className="justify-content-center">
            <Col md={8} lg={6}>
                <h2 className="text-center mb-4 slide-in">Edit Profile</h2>
                
                {error && <Alert variant="danger" className="fade-in">{error}</Alert>}
                
                {/* Profile Image Preview */}
                <div className="text-center mb-4">
                    <img
                        src={
                            userData.profileImageUrl
                                ? `http://localhost:8080${userData.profileImageUrl}?timestamp=${new Date().getTime()}`
                                : "https://placehold.co/150x150"
                        }
                        alt="Profile"
                        className="rounded-circle shadow"
                        width="100"
                        height="100"
                    />
                </div>

                <Form onSubmit={handleSubmit} className="fade-in">
                    <Form.Group controlId="formUsername" className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" value={userData.username || ''} disabled />
                    </Form.Group>

                    <Form.Group controlId="formName" className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={userData.name || ''} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={userData.email || ''} onChange={handleChange} required />
                    </Form.Group>

                    {(userData.role === 'TEACHER' || userData.role === 'ALUMNI') && (
                        <Form.Group controlId="formDesignation" className="mb-3">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control type="text" name="designation" value={userData.designation || ''} onChange={handleChange} />
                        </Form.Group>
                    )}

                    {userData.role === 'ALUMNI' && (
                        <>
                            <Form.Group controlId="formCompany" className="mb-3">
                                <Form.Label>Company</Form.Label>
                                <Form.Control type="text" name="company" value={userData.company || ''} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="formCountryOfWork" className="mb-3">
                                <Form.Label>Country of Work</Form.Label>
                                <Form.Control type="text" name="countryOfWork" value={userData.countryOfWork || ''} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="formGender" className="mb-3">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control as="select" name="gender" value={userData.gender || ''} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Control>
                            </Form.Group>
                        </>
                    )}

                    <Form.Group controlId="formProfileImage" className="mb-3">
                        <Form.Label>Profile Image</Form.Label>
                        <Form.Control type="file" name="profileImage" onChange={handleFileChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">Update Profile</Button>
                </Form>
            </Col>
        </Row>
    </Container>
    );
};

export default EditProfile;