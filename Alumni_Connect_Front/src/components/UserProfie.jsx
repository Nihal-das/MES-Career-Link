import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import UserPost from '../components/UserPost';
import SideNav from '../components/Sidenav';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FiLink, FiCheck } from 'react-icons/fi';
import '../assets/styles/ConnectButton.css';

export default function UserProfile() {
  const { username } = useParams();
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in.');
          return;
        }

        console.log('Fetching profile for username:', username);

        const userProfileResponse = await axios.get(`http://localhost:8080/users/profile/username/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('User profile response:', userProfileResponse.data);

        const userPostsResponse = await axios.get(`http://localhost:8080/posts/user/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('User posts response:', userPostsResponse.data);

        setUserData(userProfileResponse.data);
        setPosts(userPostsResponse.data.map(post => ({
          ...post,
          imageUrl: `http://localhost:8080${post.imageUrl}`
        })));
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleToggleLike = async (postId, newLikeStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }
      await axios.post(`http://localhost:8080/posts/${postId}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { like: newLikeStatus, userId }
      });

      setPosts(posts.map(post => post.id === postId ? { ...post, likes: newLikeStatus ? post.likes + 1 : post.likes - 1, likedByCurrentUser: newLikeStatus } : post));
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error liking post.');
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }
      const response = await axios.post(`http://localhost:8080/posts/${postId}/comment`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { content, userId }
      });

      const newComment = response.data;
      setPosts(posts.map(post => post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post));
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error adding comment.');
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        setIsConnecting(false);
        return;
      }

      await axios.post(`http://localhost:8080/users/connect/${username}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { userId }
      });

      setIsConnected(true);
      setError('');
      localStorage.setItem(`connected_${username}`, 'true'); // Store connection state in local storage
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error connecting with user.');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const savedConnectionState = localStorage.getItem(`connected_${username}`);
    if (savedConnectionState === 'true') {
      setIsConnected(true);
    }
  }, [username]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="d-flex">
      <SideNav />
      <div className="flex-grow-1 container-fluid p-4" style={{ marginLeft: '250px' }}>
        <div className="profile max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-1 gap-3">
              <img
                src={userData.profileImageUrl ? `http://localhost:8080${userData.profileImageUrl}` : 'https://placehold.co/150x150'}
                alt="Profile"
                className="rounded-circle me-3 mb-3"
                width="40"
                height="40"
              />
              <h2 className="text-2xl font-bold mb-5">{userData.username}</h2>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>

              <Button className="mt-3 mb-4 text-start" variant="primary" onClick={() => setShowModal(true)}>
                View More
              </Button>

              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p><strong>Username:</strong> {userData.username}</p>
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  {userData.role === 'TEACHER' || userData.role === 'ALUMNI' ? (
                    <p><strong>Designation:</strong> {userData.designation}</p>
                  ) : null}
                  {userData.role === 'ALUMNI' ? (
                    <>
                      <p><strong>Company:</strong> {userData.company}</p>
                      <p><strong>Country of Work:</strong> {userData.countryOfWork}</p>
                      <p><strong>Gender:</strong> {userData.gender}</p>
                    </>
                  ) : null}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <button
              onClick={handleConnect}
              disabled={isConnecting || isConnected}
              className={`btn d-flex align-items-center justify-content-center gap-2 px-4 py-2 fw-medium border-0 text-white position-relative 
                ${isConnected 
                  ? 'bg-gradient-success animate-connected' 
                  : isConnecting 
                    ? 'btn-secondary' 
                    : 'bg-gradient-primary transition-all animate-fade'}`}
            >
              {isConnecting ? (
                <>
                  <Spinner animation="border" size="sm" role="status" className="me-2" />
                  Connecting...
                </>
              ) : isConnected ? (
                <>
                  <FiCheck className="me-2" />
                  Connected
                </>
              ) : (
                <>
                  <FiLink className="me-2" />
                  Connect
                </>
              )}
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{userData.username}'s Posts</h3>
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="post-container">
                    <UserPost post={post} onToggleLike={handleToggleLike} onComment={handleComment} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No posts available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}