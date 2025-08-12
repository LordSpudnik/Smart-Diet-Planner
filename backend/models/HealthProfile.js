const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HealthProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Links this profile to a specific user
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  weight: {
    // in kilograms
    type: Number,
    required: true,
  },
  height: {
    // in centimeters
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HealthProfile", HealthProfileSchema);
