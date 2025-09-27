const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodItemSchema = new Schema({
  name: String,
  calories: Number,
});

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
  foodItems: [FoodItemSchema], // array of food items
  dates: [Date], // array of dates matching foodItems indices
});

module.exports = mongoose.model("Meal", MealSchema);
