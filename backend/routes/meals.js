const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Meal = require("../models/Meal");

// @route   POST api/meals
// @desc    Log a new meal
// @access  Private
router.post("/", auth, async (req, res) => {
  const { mealType, foodItems } = req.body;
  try {
    const newMeal = new Meal({
      user: req.user.id,
      mealType,
      foodItems,
    });
    const meal = await newMeal.save();
    res.json(meal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/meals
// @desc    Get all meals for the logged-in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    // Find meals and sort by most recent date
    const meals = await Meal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
