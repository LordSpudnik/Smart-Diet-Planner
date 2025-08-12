import React, { useState } from "react";
import axios from "axios";
import "./MealLogger.css";

const MealLogger = ({ meals, onMealLog }) => {
  const [mealType, setMealType] = useState("breakfast");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const newMeal = {
      mealType,
      foodItems: [{ name: foodName, calories: Number(calories) }],
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    try {
      await axios.post("http://localhost:5000/api/meals", newMeal, config);
      onMealLog();
      setFoodName("");
      setCalories("");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="meal-logger-container">
      <h3>Log a Meal</h3>
      <form onSubmit={onSubmit} className="meal-form">
        <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
        <input
          type="text"
          placeholder="Food item (e.g., Apple)"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Calories (e.g., 95)"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
        />
        <button type="submit">Log Meal</button>
      </form>

      <div className="meals-list">
        <h4>Today's Meals</h4>
        {meals.length > 0 ? (
          <ul>
            {meals.map((meal) => (
              <li key={meal._id}>
                <strong>{meal.mealType}:</strong>{" "}
                {meal.foodItems
                  .map((item) => `${item.name} (${item.calories} kcal)`)
                  .join(", ")}
                <span>{new Date(meal.date).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No meals logged yet today.</p>
        )}
      </div>
    </div>
  );
};

export default MealLogger;
