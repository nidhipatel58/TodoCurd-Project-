let express = require("express");
let route = express.Router();
let { TodoController } = require("../networks/controller");
let verifyToken = require("../middleware/todoverify");

route.post("/create", TodoController.createTodo);
route.post("/gettodos", verifyToken, TodoController.getTodos);
route.get("/gettodo/:id", verifyToken, TodoController.getTodoById);
route.put("/updatetodo/:id", verifyToken, TodoController.updateTodo);
route.delete("/deletetodo/:id", verifyToken, TodoController.deleteTodoById);

module.exports = route;
