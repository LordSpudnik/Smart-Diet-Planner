import React, { useEffect, useState } from "react";
import axios from "axios";
import HealthProfile from "./HealthProfile";
import MealLogger from "./MealLogger";
import Recommendations from "./Recommendations";
import "./Dashboard.css";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [meals, setMeals] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
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

    setError("");
    setLoading(true);

    try {
      // Updated the API endpoint for recommendations
      const [profileRes, mealsRes, recsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/profile/me", config),
        axios.get("http://localhost:5000/api/meals", config),
        axios.get("http://localhost:5000/api/ml_recommendations", config), // Calling the new ML endpoint
      ]);

      setProfile(profileRes.data);
      setMeals(mealsRes.data);
      setRecommendations(recsRes.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      if (err.response && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Failed to fetch all data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
      </div>

      {error && <p className="dashboard-error">{error}</p>}

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <div className="recommendations-section">
            <Recommendations recommendations={recommendations} />
          </div>
          <div className="dashboard-content">
            <div className="profile-section">
              <HealthProfile profile={profile} onProfileUpdate={fetchData} />
            </div>
            <div className="meals-section">
              <MealLogger meals={meals} onMealLog={fetchData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
