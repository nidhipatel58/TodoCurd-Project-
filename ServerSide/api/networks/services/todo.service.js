const TodoModel = require("../../models/todo.model");

// Create a new to-do
let createTodo = (body) => {
  console.log(body, "gsyfgfy");
  return TodoModel.create(body);
};

// Get all to-dos
const getTodos = () => {
  return TodoModel.findAll()
    .then((todos) => todos)
    .catch((error) => {
      throw new Error("Failed to fetch todos. Please try again.");
    });
};

// Get a specific to-do by ID
const getTodoById = (id) => {
  return TodoModel.findByPk(id)
    .then((todo) => {
      if (!todo) {
        throw new Error(`Todo with ID ${id} not found.`);
      }
      return todo;
    })
    .catch((error) => {
      throw error;
    });
};

// Update a to-do by ID
const updateTodo = (id, body) => {
  return TodoModel.update(body, { where: { id }, returning: true })
    .then(([rowsUpdated, [updatedTodo]]) => {
      if (rowsUpdated === 0) {
        throw new Error(`Todo with ID ${id} not found.`);
      }
      return updatedTodo;
    })
    .catch((error) => {
      if (error.name === "SequelizeValidationError") {
        throw new Error(error.errors.map((err) => err.message).join(", "));
      }
      throw error;
    });
};

// Delete a to-do by ID
const deleteTodo = (id) => {
  return TodoModel.destroy({ where: { id } })
    .then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        throw new Error(`Todo with ID ${id} not found.`);
      }
      return { message: `Todo with ID ${id} successfully deleted.` };
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = { createTodo, getTodos, getTodoById, updateTodo, deleteTodo };
