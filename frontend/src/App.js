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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("authToken");
  });

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
  };

  const handleLoginOrSignup = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
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
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
