import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onLogin(data.token);
        navigate("/");
      } else {
        setError(data.msg || "Invalid credentials");
      }
    } catch (err) {
      setError("Unable to login. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
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
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="form-button form-button-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="form-text">
        Don't have an account? <a href="/signup">Sign up</a>
      </div>
    </div>
  );
};

export default Login;
