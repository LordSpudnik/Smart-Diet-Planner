const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Meal = require("../models/Meal");

// Utility to check if two dates are same day
function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// POST api/meals - append food item or create meal for today
router.post("/", auth, async (req, res) => {
  const { mealType, foodItems } = req.body; // foodItems is an array (should be length 1 for add)
  const now = new Date();

  try {
    // Find today's meal of this type for this user
    let meal = await Meal.findOne({
      user: req.user.id,
      mealType,
    });

    if (
      meal &&
      meal.dates.length > 0 &&
      isSameDay(meal.dates[meal.dates.length - 1], now)
    ) {
      // If the last date is today, append new food item and date
      meal.foodItems.push(...foodItems); // support multiple foodItems if sent
      meal.dates.push(...Array(foodItems.length).fill(now));
      await meal.save();
      return res.json(meal);
    } else if (
      meal &&
      !isSameDay(meal.dates[meal.dates.length - 1] || new Date(0), now)
    ) {
      // New day, create new meal document for today
      meal = null; // fall through to create new
    }

    if (!meal) {
      // Create new meal for today
      const newMeal = new Meal({
        user: req.user.id,
        mealType,
        foodItems,
        dates: Array(foodItems.length).fill(now),
      });
      await newMeal.save();
      return res.json(newMeal);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET api/meals - get all meals for the user, sorted by most recent meal
router.get("/", auth, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id }).sort({ _id: -1 });
    res.json(meals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
