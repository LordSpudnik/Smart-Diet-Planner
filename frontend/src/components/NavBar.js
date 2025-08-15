import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = ({ isLoggedIn, username, onLogout }) => (
  <nav className="nav-bar">
    <Link to="/" className="nav-logo">
      SmartDietPlanner
    </Link>
    <div className="nav-links">
      {!isLoggedIn && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
      {isLoggedIn && (
        <>
          <span className="nav-username">Hello, {username}</span>
        </>
      )}
    </div>
  </nav>
);

export default NavBar;
