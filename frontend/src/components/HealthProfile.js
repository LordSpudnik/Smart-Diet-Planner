import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HealthProfile.css";

const HealthProfile = ({ profile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    dietaryGoals: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age || "",
        weight: profile.weight || "",
        height: profile.height || "",
        activityLevel: profile.activityLevel || "",
        dietaryGoals: profile.dietaryGoals || "",
      });
    }
  }, [profile]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("authToken"),
      },
    };
    try {
      // POST is used for both create and update in your backend
      await axios.post("http://localhost:5000/api/profile", formData, config);
      if (typeof onProfileUpdate === "function") onProfileUpdate();
      setIsEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.response?.data ||
          err.message ||
          "Failed to save profile"
      );
      console.error(
        "HealthProfile save error:",
        err.response?.data || err.message
      );
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
            required
          >
            <option value="">Select activity level</option>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
          <select
            name="dietaryGoals"
            value={formData.dietaryGoals}
            onChange={onChange}
            required
          >
            <option value="">Select dietary goals</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="weight_gain">Weight Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button type="submit" className="profile-save">
            Save
          </button>
          <button
            type="button"
            className="profile-cancel"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
          {error && (
            <div className="profile-error" style={{ color: "red" }}>
              {error}
            </div>
          )}
        </form>
      ) : (
        <div className="profile-view">
          <ul>
            <li>
              <strong>Age:</strong> {formData.age}
            </li>
            <li>
              <strong>Weight:</strong> {formData.weight} kg
            </li>
            <li>
              <strong>Height:</strong> {formData.height} cm
            </li>
            <li>
              <strong>Activity Level:</strong>{" "}
              {formData.activityLevel.replace(/_/g, " ")}
            </li>
            <li>
              <strong>Dietary Goals:</strong>{" "}
              {formData.dietaryGoals.replace(/_/g, " ")}
            </li>
          </ul>
          <button className="profile-edit" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthProfile;
