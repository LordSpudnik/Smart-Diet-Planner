import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = ({ isLoggedIn, onLogout }) => (
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
    </div>
  </nav>
);

export default NavBar;
