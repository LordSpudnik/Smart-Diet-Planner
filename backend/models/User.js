// This file defines the schema for the 'User' collection in your MongoDB database.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// The UserSchema defines the structure of a user document.
// Think of this as the blueprint for how user data will be stored.
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Removes whitespace from both ends of a string
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// We export the model, which allows us to interact with the 'users' collection in our database.
module.exports = mongoose.model("User", UserSchema);
