const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HealthProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  activityLevel: {
    type: String,
    enum: ["sedentary", "light", "moderate", "active", "very_active"],
    required: true,
  },
  dietaryGoals: {
    type: String,
    enum: ["weight_loss", "weight_gain", "maintenance"],
    required: true,
  },
  // --- NEW FIELD ---
  dietaryPreference: {
    type: String,
    enum: ["veg", "non-veg"],
    default: "non-veg", // Default to non-veg if not provided
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HealthProfile", HealthProfileSchema);
