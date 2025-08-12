// This file handles all API endpoints related to user authentication (registration and login).

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // A library for hashing passwords securely
const jwt = require("jsonwebtoken"); // A library for creating JSON Web Tokens for authentication
const User = require("../models/User"); // Import the User model to interact with the database

// --- Registration Route (POST /api/auth/register) ---
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if a user with the given email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 2. If the user doesn't exist, create a new user instance
    user = new User({ username, email, password });

    // 3. Hash the password before saving it to the database for security
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save the new user to the database
    await user.save();

    // 5. Create a JSON Web Token (JWT) to automatically log the user in
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "a_default_secret_key", // Use an environment variable for your secret
      { expiresIn: 3600 }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token back to the client
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// --- Login Route (POST /api/auth/login) ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if a user with the given email exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 2. Compare the password from the request with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 3. If credentials are correct, create and return a JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "a_default_secret_key",
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
