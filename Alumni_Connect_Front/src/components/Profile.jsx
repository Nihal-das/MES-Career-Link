import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import UserPost from "../components/UserPost";
import SideNav from "../components/Sidenav";
import { jwtDecode } from "jwt-decode";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";

export default function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState({
    username: "",
    name: "",
    email: "",
    designation: "",
    company: "",
    countryOfWork: "",
    gender: "",
    role: "",
    profileImageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setError("Token has expired, please log in again.");
          return;
        }

        const usernameFromToken = decodedToken.sub;

        const userProfileResponse = await axios.get(
          `http://localhost:8080/users/profile/username/${usernameFromToken}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userPostsResponse = await axios.get(
          `http://localhost:8080/posts/user/${usernameFromToken}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(userProfileResponse.data);
        setPosts(
          userPostsResponse.data.map((post) => ({
            ...post,
            imageUrl: `http://localhost:8080${post.imageUrl}`,
          }))
        );
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching user profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleDeletePost = async (postId) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please log in.");
        setIsDeleting(false);
        return;
      }

      const userId = localStorage.getItem("userId");
      const deleteResponse = await axios.delete(
        `http://localhost:8080/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId },
        }
      );

      if (deleteResponse.status === 200) {
        setPosts(posts.filter((post) => post.id !== postId));
        setError("");
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      setError(
        err.response?.status === 403
          ? "You are not authorized to delete this post."
          : err.response?.data?.message || "Error deleting post."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="d-flex">
      <SideNav />
      <div className="flex-grow-1 container-fluid p-4" style={{ marginLeft: "250px" }}>
        <div className="profile max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">{userData.username} Profile</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-1 gap-3 mb-5">
              <img
                src={
                  userData.profileImageUrl
                    ? `http://localhost:8080${userData.profileImageUrl}`
                    : "https://placehold.co/150x150"
                }
                alt="Profile"
                className="rounded-circle me-3 mb-5"
                width="80"
                height="80"
              />

            </div>

            <Button
                variant="info"
                className="mb-4 mt-5"
                onClick={() => setShowModal(true)}
              >
                View Details
              </Button>

              {/* Bootstrap Modal */}
              <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="border-start border-4 border-primary ps-4 py-3 bg-light rounded shadow-sm">
                    <p className="mb-2"><strong>👤 Username:</strong> {userData.username}</p>
                    <p className="mb-2"><strong>📛 Name:</strong> {userData.name}</p>
                    <p className="mb-2"><strong>📧 Email:</strong> {userData.email}</p>

                    {(userData.role === "TEACHER" || userData.role === "ALUMNI") && (
                      <p className="mb-2"><strong>🎓 Designation:</strong> {userData.designation}</p>
                    )}

                    {userData.role === "ALUMNI" && (
                      <>
                        <p className="mb-2"><strong>🏢 Company:</strong> {userData.company}</p>
                        <p className="mb-2"><strong>🌍 Country of Work:</strong> {userData.countryOfWork}</p>
                        <p className="mb-0"><strong>🚻 Gender:</strong> {userData.gender}</p>
                      </>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                  <Button variant="primary" as={Link} to="/edit-profile" className="d-flex align-items-center gap-2">
                    <FiEdit /> Edit Profile
                  </Button>
                </Modal.Footer>
              </Modal>
            
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Your Posts</h3>
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="post-container">
                    <UserPost post={post} />
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="btn btn-danger d-flex align-items-center gap-2 mt-3 mb-4"
                      disabled={isDeleting}
                    >
                      <FiTrash2 />
                      {isDeleting ? "Deleting..." : "Delete Post"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No posts available.</p>
            )}
          </div>

          <Link
            to="/home"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
