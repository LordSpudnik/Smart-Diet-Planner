import React, { useEffect, useState } from "react";
import axios from "axios";
import HealthProfile from "./HealthProfile";
import MealLogger from "./MealLogger";
import "./Dashboard.css";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const config = {
      headers: { "x-auth-token": token },
    };

    try {
      const profileRes = await axios.get(
        "http://localhost:5000/api/profile/me",
        config
      );
      setProfile(profileRes.data);

      const mealsRes = await axios.get(
        "http://localhost:5000/api/meals",
        config
      );
      setMeals(mealsRes.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      if (err.response && err.response.status !== 400) {
        setError("Failed to fetch data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {error && <p className="dashboard-error">{error}</p>}

      <div className="dashboard-content">
        <div className="profile-section">
          <HealthProfile profile={profile} onProfileUpdate={fetchData} />
        </div>
        <div className="meals-section">
          <MealLogger meals={meals} onMealLog={fetchData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
