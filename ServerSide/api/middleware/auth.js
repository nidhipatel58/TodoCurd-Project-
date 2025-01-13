const jwt = require("jsonwebtoken");

// Function to create token
let createToken = (data) => {
  try {
    console.log(data, "token");
    // Ensure a secret key is available in the environment
    const secretKey = process.env.JWT_SECRET_KEY || "your_default_secret_key";

    // Setting token expiration time to 1 hour
    const token = jwt.sign(data, secretKey, { expiresIn: "1h" });
    console.log(token, "token");
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Error generating token");
  }
};

// Export the function directly
module.exports = createToken;
