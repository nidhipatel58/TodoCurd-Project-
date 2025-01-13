const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "your_default_secret_key"
    );
    req.user = decoded; // Attach decoded token (user info) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = { verifyToken };
