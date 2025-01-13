const UserService = require("../services/user.service");
const createToken = require("../../middleware/auth");
const { verifyToken } = require("../../middleware/authmiddleware");
const { checkUserAuthorization } = require("../../middleware/userAuth");
const bcrypt = require("bcryptjs");

// Register a new user:
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await UserService.createUser(username, email, password);

    // Generate token
    const token = createToken({ id: newUser.id });

    // Set token in cookie:-
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// Login user:
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserService.authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Generate token
    const token = createToken({ id: user.id });

    // Set token in cookie:-
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    res.status(200).json({
      message: "Authentication successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

// Get user by ID:
let getUser = async (req, res) => {
  try {
    let { id } = req.params;
    let user = await UserService.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User fetched successfully", user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update user by ID:
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const updatedUser = await UserService.updateUser(
      id,
      username,
      email,
      password
    );
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete user by ID:
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await UserService.deleteUser(id);
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Signup (alternative to registerUser):
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await UserService.createUser(username, email, password);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Signup error: " + error.message });
  }
};

module.exports = {
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  signup,
  loginUser,
};
