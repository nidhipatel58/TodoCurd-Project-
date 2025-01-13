const jwt = require("jsonwebtoken");

// Middleware to verify the token:-
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]; // Get token from Authorization header

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided." });
  }

  jwt.verify(token, "Master@8110##", (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid token." });
    }

    req.userId = decoded.userId; // Store the userId from the token in the request object
    next(); // Proceed to the next middleware or controller
  });
};

module.exports = verifyToken;
