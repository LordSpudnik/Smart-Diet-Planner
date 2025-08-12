// This component renders the user registration form.

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      // The URL must match your backend's register endpoint.
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      localStorage.setItem("token", res.data.token); // Store the auth token
      navigate("/dashboard"); // Redirect to dashboard after successful signup
    } catch (err) {
      console.error("Signup Error:", err.response.data);
      setError(err.response.data.msg || "An error occurred. Please try again.");
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Create Your Account</h2>
      <form onSubmit={onSubmit} style={formStyle}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          name="username"
          value={username}
          onChange={onChange}
          placeholder="Username"
          required
          style={inputStyle}
        />
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
          placeholder="Password (min 6 characters)"
          required
          minLength="6"
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Sign Up
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

// Basic CSS-in-JS for styling
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
  backgroundColor: "#28a745",
  color: "white",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

export default Signup;
