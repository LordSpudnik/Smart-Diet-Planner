import React, { useState } from "react";
import axios from "axios";
import "./MealLogger.css";

const MealLogger = ({ meals, onMealLog }) => {
  const [mealType, setMealType] = useState("breakfast");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: { "x-auth-token": localStorage.getItem("authToken") },
    };
    try {
      await axios.post(
        "http://localhost:5000/api/meals",
        {
          mealType,
          foodItems: [{ name: foodName, calories: Number(calories) }], // always send as array
        },
        config
      );
      setFoodName("");
      setCalories("");
      setMealType("breakfast");
      onMealLog();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Helper: show today's meals for this user
  const today = new Date();
  const isSameDay = (d) =>
    new Date(d).getFullYear() === today.getFullYear() &&
    new Date(d).getMonth() === today.getMonth() &&
    new Date(d).getDate() === today.getDate();

  // Flatten all meal entries for today, mapping foodItems[index] to date[index]
  const todaysFoodItems = [];
  meals.forEach((meal) => {
    meal.foodItems.forEach((item, idx) => {
      if (meal.dates && meal.dates[idx] && isSameDay(meal.dates[idx])) {
        todaysFoodItems.push({
          mealType: meal.mealType,
          ...item,
          date: meal.dates[idx],
        });
      }
    });
  });

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
        {todaysFoodItems.length > 0 ? (
          <ul>
            {todaysFoodItems.map((item, idx) => (
              <li key={idx}>
                <strong>{item.mealType}:</strong> {item.name} ({item.calories}{" "}
                kcal)
                <span> {new Date(item.date).toLocaleTimeString()}</span>
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
