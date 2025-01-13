let express = require("express");
let router = express.Router();
let userRoute = require("./user.route");
let todoRoute = require("./todo.route");

router.use("/user", userRoute);
router.use("/todo", todoRoute);

module.exports = router;
