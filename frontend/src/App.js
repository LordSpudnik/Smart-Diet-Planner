import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("authToken")
  );
  const [username, setUsername] = useState("");

  // Fetch username from backend when logged in
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUsername("");
        return;
      }
      try {
        const res = await axios.get("/api/profile/me", {
          headers: { "x-auth-token": token },
        });
        setUsername(res.data.username);
      } catch (err) {
        setUsername("");
      }
    };
    if (isLoggedIn) fetchProfile();
    else setUsername("");
  }, [isLoggedIn]);

  useEffect(() => {
    function checkAuth() {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    }
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUsername("");
  };

  const handleLoginOrSignup = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
    // username will be fetched by useEffect after login
  };

  return (
    <Router>
      <NavBar
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
      />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <Login onLogin={handleLoginOrSignup} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <Signup onSignup={handleLoginOrSignup} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
