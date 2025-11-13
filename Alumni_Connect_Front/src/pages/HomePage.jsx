import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserPost from '../components/UserPost';
import SideNav from '../components/Sidenav';

export default function HomePage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const [posts, setPosts] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNav = () => setIsCollapsed(!isCollapsed);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/posts', { withCredentials: true });
      const postsWithFullImageUrl = response.data.map(post => ({
        ...post,
        imageUrl: `http://localhost:8080/uploads/${post.imageUrl.split('/').pop()}`,
      }));
      setPosts(postsWithFullImageUrl);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleToggleLike = async (postId, newLikeStatus) => {
    const userId = localStorage.getItem('userId');
    const updatedPosts = posts.map(post =>
      post.id === postId
        ? { ...post, likes: newLikeStatus ? post.likes + 1 : post.likes - 1, likedByCurrentUser: newLikeStatus }
        : post
    );
    setPosts(updatedPosts);

    try {
      await axios.post(`http://localhost:8080/posts/${postId}/like`, null, {
        withCredentials: true,
        params: { userId, like: newLikeStatus },
      });
    } catch (error) {
      console.error('Error liking post:', error);
      const revertedPosts = posts.map(post =>
        post.id === postId
          ? { ...post, likes: newLikeStatus ? post.likes - 1 : post.likes + 1, likedByCurrentUser: !newLikeStatus }
          : post
      );
      setPosts(revertedPosts);
    }
  };

  const handleComment = async (postId, content) => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.post(`http://localhost:8080/posts/${postId}/comment`, null, {
        withCredentials: true,
        params: { userId, content },
      });
      const newComment = response.data;
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="d-flex">
      <SideNav username={username} role={role} />

      {/* Main Content */}
      <div className="flex-grow-1 container-fluid p-4 border-0" style={{ marginLeft: '250px' }}>
        <header className="d-flex justify-content-between align-items-center p-3 bg-white  border-0">
          {username ? (
            <span className="text-muted ms-auto">Welcome, <strong>{username}</strong></span>
          ) : (
            <span className="text-muted">Please log in to view your details.</span>
          )}
        </header>

        <main className="my-5">
        <div className="row justify-content-center">
  {posts.length > 0 ? (
    posts.map((post) => (
      <div className="col-12 col-lg-8 mb-4" key={post.id}>
        <UserPost
          post={post}
          onToggleLike={handleToggleLike}
          onComment={handleComment}
        />
      </div>
    ))
  ) : (
    <div className="col-12">
      <p className="text-muted">No posts available.</p>
    </div>
  )}
</div>
        </main>
      </div>

      {/* Toggle Button for Mobile */}
      <button
        className="btn btn-dark d-md-none position-fixed bottom-0 end-0 m-3"
        type="button"
        onClick={toggleNav}
        aria-expanded={!isCollapsed}
        aria-controls="sideNav"
      >
        ☰
      </button>
    </div>
  );
}