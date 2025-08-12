// This component renders the user login form.

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      // The URL must match your backend's login endpoint.
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token); // Store the auth token
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (err) {
      console.error("Login Error:", err.response.data);
      setError(err.response.data.msg || "An error occurred. Please try again.");
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Login to Your Account</h2>
      <form onSubmit={onSubmit} style={formStyle}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

// Reusing styles from Signup for consistency
const formContainerStyle = {
  maxWidth: "400px",
  margin: "2rem auto",
  padding: "2rem",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  backgroundColor: "#fff",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const inputStyle = {
  padding: "0.8rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "1rem",
};

const buttonStyle = {
  padding: "1rem",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#007bff",
  color: "white",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

export default Login;
