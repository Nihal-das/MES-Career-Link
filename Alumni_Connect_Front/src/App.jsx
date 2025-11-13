

  import React from "react";
  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  import ProtectedRoute from "./components/Security/ProtectedRoute";
  import Landingpage from "./pages/LandingPage";
  import Login from "./components/Login";
  import Logout from "./components/Logout";
  import HomePage from "./pages/HomePage";
  import Profile from "./components/Profile";
  import ErrorBoundary from "./components/Security/ErrorBoundary";
  import EditProfile from "./components/EditProfile";
  import AdminDashboard from "./components/AdminDashboard";
  import AddUser from "./components/Admin/AddUser";
  import EditUser from "./components/Admin/EditUser";
  import CreatePost from "./components/CreatePost";
  import ChatPage from "./pages/ChatPage";
  import UserProfile from "./components/UserProfie";
  import ForgotPassword from "./pages/ForgotPassword";
  import ResetPassword from "./pages/ResetPassword";
  import 'bootstrap/dist/css/bootstrap.min.css';
   import '/src/App.css';
import SignUp from "./components/SignUp";
import AdminApprovals from "./components/AdminApprovals";




  export default function App() {
    return (
    
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Landingpage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/home"
              element={<ProtectedRoute element={<HomePage />} />}
            />
            <Route
              path="/profile/:username"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route
              path="/edit-profile"
              element={<ProtectedRoute element={<EditProfile />} />}
            />
            <Route
              path="/create-post"
              element={<ProtectedRoute element={<CreatePost />} />}
            />
            <Route
              path="/conversation"
              element={<ProtectedRoute element={<ChatPage />} />}
            />
            <Route
              path="/view-profiles/:username"
              element={<ProtectedRoute element={<UserProfile />} />}
            />
            <Route
              path="/admin-dashboard"
              element={<ProtectedRoute element={<AdminDashboard />} />}
            />
            <Route
              path="/admin-approvals"
              element={<ProtectedRoute element={<AdminApprovals />} />}
            />
            <Route
              path="/add-user"
              element={<ProtectedRoute element={<AddUser />} />}
            />
            <Route
              path="/edit-user/:id"
              element={<ProtectedRoute element={<EditUser />} />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    );
  }