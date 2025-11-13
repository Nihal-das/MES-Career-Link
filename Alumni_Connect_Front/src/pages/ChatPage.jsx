import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GiExitDoor } from 'react-icons/gi';
import '../assets/styles/ChatPage.css'; // Import your CSS file for styling


export default function ChatPage() {
    const [connections, setConnections] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found, please log in.');
                    return;
                }

                const response = await axios.get(`http://localhost:8080/users/connections/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setConnections(response.data || []);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching connections.');
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, [userId]);

    const fetchMessages = async (otherUsername) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please log in.');
                return;
            }

            const response = await axios.get(`http://localhost:8080/messages/between/${username}/${otherUsername}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessages(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error fetching messages.');
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchMessages(user.username);
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please log in.');
                return;
            }

            const response = await axios.post('http://localhost:8080/messages/send', {
                senderUsername: username,
                receiverUsername: selectedUser.username,
                content: newMessage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error sending message.');
        }
    };

    const getProfileImageUrl = (url) => {
        if (url && !url.startsWith('http')) {
            return `http://localhost:8080${url}`;
        }
        return url || 'https://placehold.co/50x50';
    };

    const parseMessageContent = (content) => {
        if (content.startsWith("Shared post")) {
            const lines = content.split('\n');
            if (lines.length >= 3) {
                const imageUrl = lines[1].split(' ')[1];
                const postContent = lines[2];
                return (
                    <>
                        <strong>{lines[0]}:</strong><br />
                        <img src={imageUrl} alt="Shared Post" className="shared-post-image" 
                         style={{ maxWidth: '150px', height: 'auto' }}
                         /><br />
                        {postContent}
                    </>
                );
            }
        }
        return content;
    };

    if (loading) {
        return <div>Loading connections...</div>;
    }

    return (
        <div className="container-fluid py-5">
           <Link to="/home" className="btn btn-dark d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm mb-4">
  <GiExitDoor size={24} className="text-light" />
  <span className="fw-semibold text-light">Go Back</span>
</Link>

          <div className="row">
            {/* Sidebar: Connections */}
            <div className="col-md-3 mb-3">
              <div className="glass-card p-4 h-100">
                <h2 className="h4 fw-bold mb-3">Connected People</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {connections.length > 0 ? (
                  <div className="vstack gap-3">
                    {connections.map((user) => (
                      <div
                        key={user.id}
                        className="d-flex align-items-center p-2 glass-card border-bottom pb-2 shadow-sm"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleUserClick(user)}
                      >
                        <img
                          src={getProfileImageUrl(user.profileImageUrl)}
                          alt="User"
                          className="rounded-circle me-3"
                          width="50"
                          height="50"
                        />
                        <div>
                          <Link to="#" className="fw-semibold text-white text-decoration-none">
                            {user.username}
                          </Link>
                          <div className="fs-5 mb-4 text-dark">{user.username}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No connections available.</p>
                )}
              </div>
            </div>
      
            {/* Main Chat Box */}
            <div className="col-md-9">
              <div className="glass-card p-4 h-100">
                {selectedUser ? (
                  <>
                    <h2 className="h4 fw-bold mb-3">Chat with {selectedUser.username}</h2>
                    <div
                      className="overflow-auto mb-4"
                      style={{ maxHeight: '400px' }}
                    >
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`mb-3 d-flex ${message.senderUsername === username ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                          <div className="bg-light text-dark p-2 rounded">
                            {parseMessageContent(message.content)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="form-control"
                        placeholder="Type a message"
                      />
                      <button className="btn btn-primary" onClick={handleSendMessage}>
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <h2 className="text-muted">Select a user to start a chat.</h2>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }      