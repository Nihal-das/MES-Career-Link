import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in.');
          return;
        }

        const response = await axios.get(`http://localhost:8080/users/search`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { username: searchTerm },
        });

        setSearchResults(response.data);
        setError('');
      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          if (status === 404) {
            setError('No users found with that username.');
          } else if (status === 401) {
            setError('Unauthorized access. Please log in again.');
          } else {
            setError(err.response.data.message || 'Error fetching search results.');
          }
        } else {
          setError('Network error, please check your connection.');
        }
      }
    };

    fetchData();
  }, [searchTerm]);

  return (
    <div className="d-flex">
      

      <div className="container mt-5">
        <div className="card shadow p-4">
          <h2 className="mb-4 text-primary">🔍 Search Users</h2>

          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {searchResults.length > 0 ? (
            <ul className="list-group mt-3">
              {searchResults.map((user) => (
                <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{user.username}</span>
                  <Link to={`/view-profiles/${user.username}`} className="btn btn-sm btn-primary">
                    View Profile
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            !error && <p className="text-muted mt-3">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}