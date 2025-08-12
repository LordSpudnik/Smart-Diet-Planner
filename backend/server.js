// This is the main entry point for your backend application.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// --- Middleware ---
app.use(cors()); // Enables Cross-Origin Resource Sharing to allow frontend and backend to communicate
app.use(express.json()); // Parses incoming JSON requests so we can use req.body

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---
// We define the main routes for our application here.
// All routes starting with /api/auth will be handled by the auth.js file.
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/meals", require("./routes/meals"));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
