const express = require("express");
const router = express.Router();
const auth = require("../middleware/m_auth");
const HealthProfile = require("../models/HealthProfile");

// @route   GET api/profile/me
// @desc    Get current user's health profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ user: req.user.id }).populate(
      "user",
      ["username", "email"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or update user health profile
// @access  Private
router.post("/", auth, async (req, res) => {
  // --- DESTRUCTURE THE NEW FIELD FROM req.body ---
  const {
    age,
    weight,
    height,
    activityLevel,
    dietaryGoals,
    dietaryPreference,
  } = req.body;

  const profileFields = {
    user: req.user.id,
    age,
    weight,
    height,
    activityLevel,
    dietaryGoals,
    dietaryPreference, // --- ADD IT TO THE PROFILE OBJECT ---
    updatedAt: Date.now(),
  };

  try {
    let profile = await HealthProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile = await HealthProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create new profile
    profile = new HealthProfile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
