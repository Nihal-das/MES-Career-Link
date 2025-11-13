import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SideNav from './Sidenav';

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (file && !validExtensions.includes(file.type)) {
      setError('Invalid file type. Only images (JPEG, JPG, PNG, GIF) are allowed.');
      return;
    }
    setImage(file);
    setError('');
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User ID is missing');
      return;
    }

    if (!image) {
      setError('Image is required');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('image', image);
    formData.append('content', content);

    try {
      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Post created:', response.data);
      setSuccessMessage('Post created successfully!');
      setError('');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error creating post. Please try again.');
    }

    setImage(null);
    setImagePreview(null);
    setContent('');
  };

  return (
    <div className="d-flex">
      <SideNav />

      <div className="container mt-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <h2 className="text-center mb-4">Create a New Post</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Upload Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>

            {imagePreview && (
              <div className="mb-3 text-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                placeholder="Write something awesome..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <button type="submit" className="btn btn-primary w-100">
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;