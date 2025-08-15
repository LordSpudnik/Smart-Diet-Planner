import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = ({ onSignup }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onSignup(data.token);
        navigate("/");
      } else {
        setError(data.msg || "Signup failed.");
      }
    } catch (err) {
      setError("Unable to sign up. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form className="form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <input
          className="form-input"
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="password"
          value={password}
          placeholder="Password (min 6 chars)"
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <input
          className="form-input"
          type="password"
          value={confirm}
          placeholder="Confirm Password"
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={6}
        />
        <button
          className="form-button form-button-success"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="form-text">
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default Signup;
