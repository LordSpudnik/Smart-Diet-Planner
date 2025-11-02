import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HealthProfile.css";

function capitalizeFirstLetter(str) {
  if (str === null || str === undefined) return "";
  const s = String(str);
  if (s.length === 0) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const HealthProfile = ({ profile, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    activityLevel: "sedentary",
    dietaryGoals: "maintenance",
    dietaryPreference: "non-veg",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      // Do NOT transform values for form inputs (keeps types and select values consistent).
      setFormData({
        age: profile.age ?? "",
        weight: profile.weight ?? "",
        height: profile.height ?? "",
        activityLevel: profile.activityLevel || "sedentary",
        dietaryGoals: profile.dietaryGoals || "maintenance",
        dietaryPreference: profile.dietaryPreference || "non-veg",
      });
      setIsEditing(false);
    } else {
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
        "x-auth-token": localStorage.getItem("authToken"),
      },
    };
    try {
      // The backend route is the same, we just send the updated formData
      const res = await axios.post(
        "http://localhost:5000/api/profile",
        formData,
        config
      );
      onProfileUpdate(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
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
            <option value="sedentary">Sedentary</option>
            <option value="light">Light Activity</option>
            <option value="moderate">Moderate Activity</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
          <select
            name="dietaryGoals"
            value={formData.dietaryGoals}
            onChange={onChange}
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="maintenance">Maintenance</option>
            <option value="weight_gain">Weight Gain</option>
          </select>

          <select
            name="dietaryPreference"
            value={formData.dietaryPreference}
            onChange={onChange}
          >
            <option value="non-veg">Non-Vegetarian</option>
            <option value="veg">Vegetarian</option>
          </select>

          <button type="submit">Save Profile</button>
          {profile && (
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          )}
        </form>
      ) : profile ? (
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
            {profile.activityLevel
              ? capitalizeFirstLetter(profile.activityLevel.replace(/_/g, " "))
              : ""}
          </p>
          <p>
            <strong>Goal:</strong>{" "}
            {profile.dietaryGoals
              ? capitalizeFirstLetter(profile.dietaryGoals.replace(/_/g, " "))
              : ""}
          </p>
          <p>
            <strong>Diet:</strong>{" "}
            {profile.dietaryPreference === "veg"
              ? "Vegetarian"
              : "Non-Vegetarian"}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <p>Create your profile to get started!</p>
      )}
    </div>
  );
};

export default HealthProfile;
