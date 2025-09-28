const express = require("express");
const router = express.Router();
const auth = require("../middleware/m_auth");
const HealthProfile = require("../models/HealthProfile");

// --- BMR and Calorie Calculation Logic ---
// This simulates the logic your ML model would perform.
const calculateCalorieNeeds = (profile) => {
  const { weight, height, age, activityLevel, dietaryGoals } = profile;

  // Harris-Benedict Equation for BMR (Basal Metabolic Rate)
  // Note: This is a simplified example. Real models would be more complex.
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Simplified for men

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  // TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  const goalAdjustments = {
    weight_loss: -500, // A 500 calorie deficit per day
    maintenance: 0,
    weight_gain: 500, // A 500 calorie surplus per day
  };

  const targetCalories = tdee + (goalAdjustments[dietaryGoals] || 0);

  // --- Generate Meal Plan based on Calories ---
  // This part dynamically creates a meal plan based on the calculated target.
  return {
    breakfast: {
      name: "Balanced Breakfast",
      calories: Math.round(targetCalories * 0.25),
    },
    lunch: {
      name: "Nutrient-rich Lunch",
      calories: Math.round(targetCalories * 0.35),
    },
    dinner: {
      name: "Healthy Dinner",
      calories: Math.round(targetCalories * 0.3),
    },
    snack: { name: "Light Snack", calories: Math.round(targetCalories * 0.1) },
  };
};

// @route   GET api/ml_recommendations
// @desc    Get ML-based diet recommendations
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "User profile not found. Please create one first." });
    }

    // Get the calculated recommendations
    const recommendations = calculateCalorieNeeds(profile);
    res.json(recommendations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
