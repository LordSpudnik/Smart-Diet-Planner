import React from "react";
import "./Recommendations.css"; // This line requires the CSS file below

const Recommendations = ({ recommendations }) => {
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="recommendations-container">
      <h3>Your Personalized Suggestions</h3>
      {recommendations ? (
        <div className="recommendations-grid">
          {Object.entries(recommendations.meals).map(([meal, details]) => (
            <div key={meal} className="recommendation-card">
              <h4>{formatKey(meal)}</h4>
              <p>{details.item}</p>
              <span>{details.calories} calories</span>
            </div>
          ))}
        </div>
      ) : (
        <p>Generating your personalized recommendations...</p>
      )}
    </div>
  );
};

export default Recommendations;
