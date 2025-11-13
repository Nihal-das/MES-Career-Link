import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaEnvelope, FaSearch, FaPlus, FaSignOutAlt } from "react-icons/fa";
import "../assets/styles/SideNav.css";
import Search from "../components/Search";

export default function SideNav() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setUsername(localStorage.getItem("username"));
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <>
      <div className="sidenav d-flex flex-column vh-100">
        <h3 className="text-center">Alumni Connect</h3>
        <ul className="nav flex-column flex-grow-1">
          <li className="nav-item">
            <NavLink to="/home" className="nav-link">
              <FaHome className="icon" /> Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={`/profile/${username}`} className="nav-link">
              <FaUser className="icon" /> Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/conversation" className="nav-link">
              <FaEnvelope className="icon" /> Messages
            </NavLink>
          </li>
          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: "pointer" }}
              onClick={toggleSearch}
            >
              <FaSearch className="icon" /> Search Users
            </span>
          </li>
          {(role === "TEACHER" || role === "ALUMNI") && (
            <li className="nav-item">
              <NavLink to="/create-post" className="nav-link">
                <FaPlus className="icon" /> Post
              </NavLink>
            </li>
          )}
          <li className="nav-item mt-auto mt-3 mb-0">
            <NavLink to="/logout" className="nav-link">
              <FaSignOutAlt className="icon" /> Logout
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Slide-out Search Panel */}
      {showSearch && (
        <div className="search-drawer">
          <div className="drawer-header">
            <button className="btn btn-danger btn-sm" onClick={toggleSearch}>
              Close ✖️
            </button>
          </div>
          <Search />
        </div>
      )}
    </>
  );
}
