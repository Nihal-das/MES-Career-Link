import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareFromSquare, faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // outlined heart
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'; 
import { FaRegComments } from 'react-icons/fa6';
import SideNav from './Sidenav';


const UserPost = ({ post, onToggleLike, onComment }) => {
  const [commentContent, setCommentContent] = useState('');
  const [likes, setLikes] = useState(post.likes);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(post.likedByCurrentUser);
  const [connections, setConnections] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false); 
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, please log in.');
          return;
        }
        const response = await axios.get(`http://localhost:8080/users/connections/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setConnections(response.data || []);
      } catch (error) {
        console.error('Error fetching connections:', error);
      }
    };

    fetchConnections();
  }, [userId]);

  const handleToggleLike = async () => {
    const newLikeStatus = !likedByCurrentUser;
    setLikedByCurrentUser(newLikeStatus);
    setLikes((prevLikes) => (newLikeStatus ? prevLikes + 1 : prevLikes - 1));

    try {
      await onToggleLike(post.id, newLikeStatus, userId);
    } catch (error) {
      console.error('Error liking post:', error);
      setLikedByCurrentUser(!newLikeStatus);
      setLikes((prevLikes) => (newLikeStatus ? prevLikes - 1 : prevLikes + 1));
    }
  };

  const handleComment = async () => {
    if (commentContent.trim() !== '') {
      try {
        await onComment(post.id, commentContent, userId);
        post.comments.push({
          id: Date.now(),
          username: 'You',
          content: commentContent,
        });
        setCommentContent('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleShare = async (connectionId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in.');
        return;
      }
      await axios.post('http://localhost:8080/messages/share', {
        senderId: userId,
        receiverId: connectionId,
        postId: post.id,
        postDetails: {
          username: post.username,
          profileImageUrl: post.profileImageUrl,
          imageUrl: post.imageUrl,
          content: post.content
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Post shared successfully!');
      setShowPopup(false);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <div className="card mb-4 shadow border-0">
      <SideNav />
    {/* Header */}
    <div className="card-header d-flex align-items-center border-0">
      <img
        src={post.profileImageUrl ? `http://localhost:8080${post.profileImageUrl}` : 'https://placehold.co/50x50'}
        alt="User"
        className="rounded-circle me-3"
        width="40"
        height="40"
      />
      <h6 className="mb-0">
        <Link to={`/view-profiles/${post.username}`} className="text-decoration-none text-dark">
          {post.username}
        </Link>
      </h6>
    </div>

    {/* Post Image */}
    <img
      src={post.imageUrl || 'https://placehold.co/500x300'}
      className="card-img-top"
      alt="Post"
      style={{ maxHeight: '500px', objectFit: 'cover' }}
    />

    {/* Post Content */}
    {post.content && (
      <div className="card-body">
        <p className="card-text">
          <strong>{post.username} : </strong> {post.content}
        </p>
      </div>
    )}

    {/* Actions */}
    <div className="card-body d-flex justify-content-between align-items-center">
      <div>
        <button className="btn btn-link p-0 me-3" onClick={handleToggleLike}>
          <FontAwesomeIcon
            icon={likedByCurrentUser ? fasHeart : farHeart}
            size="lg"
            className={likedByCurrentUser ? 'text-danger' : 'text-danger'}
          />
        </button>
        <button className="btn btn-link p-0 me-3" onClick={() => setShowPopup(true)}>
          <FontAwesomeIcon icon={faShareFromSquare} size="lg" className="text-primary" />
        </button>

        <button className="btn btn-link p-0 me-3" onClick={() => setShowCommentPopup(true)}>
        <FaRegComments size={24} className="text-primary"/>
        </button>

      </div>
      <span className="text-muted">{likes} likes</span>
    </div>
  
    {/* Share Popup Modal */}
    {showPopup && (
      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Share with</h5>
              <button type="button" className="btn-close" onClick={() => setShowPopup(false)}></button>
            </div>
            <div className="modal-body">
              {connections.map((connection) => (
                <button
                  key={connection.id}
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={() => handleShare(connection.id)}
                >
                  {connection.username}
                </button>
              ))}
            </div>

            
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )}

{showCommentPopup && (
  <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Comments</h5>
          <button type="button" className="btn-close" onClick={() => setShowCommentPopup(false)}></button>
        </div>
        <div className="modal-body">
          {post.comments.length > 0 ? (
            <ul className="list-group mb-3">
              {post.comments.map((comment) => (
                <li key={comment.id} className="list-group-item">
                  <strong>{comment.username}</strong>: {comment.content}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No comments yet.</p>
          )}
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Add a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button className="btn btn-primary w-100" onClick={handleComment}>
            Add Comment
          </button>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={() => setShowCommentPopup(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    
  </div>
  

  );
};

UserPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    profileImageUrl: PropTypes.string,
    username: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    likes: PropTypes.number.isRequired,
    likedByCurrentUser: PropTypes.bool.isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onToggleLike: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired,
};

export default UserPost;