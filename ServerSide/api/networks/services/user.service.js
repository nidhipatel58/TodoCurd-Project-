const UserModel = require("../../models/user.model");
const bcrypt = require("bcryptjs");

// Create a new user
const createUser = async (username, email, password) => {
  try {
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const newUser = await UserModel.create({
      username,
      email,
      password,
    });

    return newUser; // Return newly created user
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

// Authenticate user (Login)
const authenticateUser = async (email, password) => {
  try {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return user; // Authentication successful
  } catch (error) {
    throw new Error("Authentication failed: " + error.message);
  }
};

// Get user by ID
const getUserById = async (id) => {
  try {
    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

// Find a user by email (for authentication or signup checks)
const findUserByEmail = async (email) => {
  try {
    const user = await UserModel.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw new Error("Error fetching user by email: " + error.message);
  }
};

// Update user by ID
const updateUser = async (id, username, email, password) => {
  try {
    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Hash the new password
    }

    await user.save(); // Save the updated user to the database
    return user;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

// Delete user by ID
const deleteUser = async (id) => {
  try {
    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    await user.destroy(); // Delete the user from the database
    return { message: "User deleted successfully", user };
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  findUserByEmail,
  authenticateUser,
  deleteUser,
};
