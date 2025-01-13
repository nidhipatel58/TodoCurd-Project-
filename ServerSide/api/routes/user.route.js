let express = require("express");
let route = express.Router();
let { UserController } = require("../networks/controller");
const { verifyToken } = require("../middleware/authmiddleware");
const { checkUserAuthorization } = require("../middleware/userAuth");

route.post("/register", UserController.registerUser);

// Protect these routes with token verification and authorization
route.get(
  "/getuser/:id",
  verifyToken,
  checkUserAuthorization,
  UserController.getUser
);
route.put(
  "/updateuser/:id",
  verifyToken,
  checkUserAuthorization,
  UserController.updateUser
);
route.delete(
  "/deleteuser/:id",
  verifyToken,
  checkUserAuthorization,
  UserController.deleteUser
);

// Signup:-
route.post("/signup", UserController.signup);
route.post("/login", UserController.loginUser);

module.exports = route;
