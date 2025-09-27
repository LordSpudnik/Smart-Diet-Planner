// This middleware will protect our routes by verifying the user's token.

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Get token from the request header
  const token = req.header("x-auth-token");

  // 2. Check if no token is present
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "a_default_secret_key"
    );
    req.user = decoded.user; // Add the user payload to the request object
    next(); // Move to the next piece of middleware or the route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
