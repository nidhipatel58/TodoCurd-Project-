const TodoService = require("../services/todo.service");
let createToken = require("../../middleware/todoauthmiddleware");

// Create a new to-do
const createTodo = async (req, res) => {
  try {
    const body = req.body || {};
    console.log(body, "Request Body");

    if (!body.title) {
      return res.status(400).json({
        success: false,
        message: "Title is required to create a todo.",
      });
    }
    const todo = await TodoService.createTodo(body);
    // Generate token for the todo item (You might want to include user-specific data in the payload)
    let token = createToken({ todo });
    console.log("Generated Token:", token);

    // Set the token in a cookie
    res.cookie("todoToken", token, {
      httpOnly: false, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "development" || "production", // Ensures cookies are only sent over HTTPS in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (1 day)
    });

    // Respond with the success message, created todo, and the token:-
    res.status(201).json({
      success: true,
      message: "Todo created successfully!",
      data: todo,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the todo.",
      error: err.message,
    });
  }
};

// Get all to-dos:-
const getTodos = async (req, res) => {
  try {
    const todos = await TodoService.getTodos();

    res.status(200).json({
      success: true,
      message: "Fetched all todos successfully!",
      data: todos,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching todos.",
      error: err.message,
    });
  }
};

// Get a specific to-do by ID:-
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await TodoService.getTodoById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID ${id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched todo successfully!",
      data: todo,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the todo.",
      error: err.message,
    });
  }
};

// Update a to-do by ID:-
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required to update the todo.",
      });
    }

    const updatedTodo = await TodoService.updateTodo(id, {
      title,
      description,
      isCompleted,
    });

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID ${id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo updated successfully!",
      data: updatedTodo,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the todo.",
      error: err.message,
    });
  }
};

// Delete a to-do by ID
const deleteTodoById = async (req, res) => {
  try {
    const { id } = req.params; // Extract UUID from params
    console.log("Received ID:", id); // Log the ID for debugging

    const result = await TodoService.deleteTodo(id); // Call the deleteTodo service
    console.log("Deletion result:", result); // Log the result

    // Send the success response with the message
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({
      success: false,
      message: error.message, // Error message returned from service
    });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodoById,
};
