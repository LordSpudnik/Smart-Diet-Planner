// This is the main component that sets up the routing for your React application.
// It determines which component to show based on the URL.

import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./App.css"; // For global styles

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={navStyle}>
          <Link to="/" style={logoStyle}>
            Smart Diet App
          </Link>
          <div>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/signup" style={linkStyle}>
              Sign Up
            </Link>
          </div>
        </nav>
        <main className="container">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* The root path will default to the Login page */}
            <Route path="/" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Basic styling for the navigation bar
const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  backgroundColor: "#333",
  color: "white",
};

const logoStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "1.5rem",
  fontWeight: "bold",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginLeft: "1rem",
};

export default App;
