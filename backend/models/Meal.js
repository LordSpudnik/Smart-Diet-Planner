const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MealSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true,
  },
  foodItems: [
    {
      name: { type: String, required: true },
      calories: { type: Number, required: true },
      // You can add more nutritional info like protein, carbs, fats later
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Meal", MealSchema);
