import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HealthProfile.css";

const HealthProfile = ({ profile, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    activityLevel: "sedentary",
    dietaryGoals: "maintenance",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age || "",
        weight: profile.weight || "",
        height: profile.height || "",
        activityLevel: profile.activityLevel || "sedentary",
        dietaryGoals: profile.dietaryGoals || "maintenance",
      });
      setIsEditing(false);
    } else {
      // If there's no profile, immediately go into editing/creation mode.
      setIsEditing(true);
    }
  }, [profile]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    try {
      await axios.post("http://localhost:5000/api/profile", formData, config);
      onProfileUpdate(); // Refresh data on the dashboard
      setIsEditing(false);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="health-profile-container">
      <h3>Your Health Profile</h3>
      {isEditing ? (
        <form onSubmit={onSubmit} className="profile-form">
          <input
            type="number"
            placeholder="Age"
            name="age"
            value={formData.age}
            onChange={onChange}
            required
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            name="weight"
            value={formData.weight}
            onChange={onChange}
            required
          />
          <input
            type="number"
            placeholder="Height (cm)"
            name="height"
            value={formData.height}
            onChange={onChange}
            required
          />
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={onChange}
          >
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">
              Lightly Active (light exercise/sports 1-3 days/week)
            </option>
            <option value="moderate">
              Moderately Active (moderate exercise/sports 3-5 days/week)
            </option>
            <option value="active">
              Very Active (hard exercise/sports 6-7 days a week)
            </option>
            <option value="very_active">
              Extra Active (very hard exercise/physical job)
            </option>
          </select>
          <select
            name="dietaryGoals"
            value={formData.dietaryGoals}
            onChange={onChange}
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="maintenance">Weight Maintenance</option>
            <option value="weight_gain">Weight Gain</option>
          </select>
          <button type="submit">Save Profile</button>
          {/* Only show Cancel button if a profile already exists to cancel from */}
          {profile && (
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          )}
        </form>
      ) : // **THE FIX IS HERE**: We check if `profile` exists before trying to access its properties.
      profile ? (
        <div className="profile-view">
          <p>
            <strong>Age:</strong> {profile.age}
          </p>
          <p>
            <strong>Weight:</strong> {profile.weight} kg
          </p>
          <p>
            <strong>Height:</strong> {profile.height} cm
          </p>
          <p>
            <strong>Activity Level:</strong>{" "}
            {profile.activityLevel.replace(/_/g, " ")}
          </p>
          <p>
            <strong>Goal:</strong> {profile.dietaryGoals.replace(/_/g, " ")}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        // This part is technically covered by the useEffect, but it's good practice for robustness.
        <p>Loading profile or create one if you're new!</p>
      )}
    </div>
  );
};

export default HealthProfile;
