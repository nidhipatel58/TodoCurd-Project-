require("dotenv").config();
const express = require("express");
let http = require("http");
const sequelize = require("../api/config/db");
let routes = require("../api/routes");
let cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

// cors:-
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies
  })
);

// cookie-parser middleware:-
app.use(cookieParser());

// JSON AND URL-encoded middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync Sequelize models with database:
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => {
    console.error("Error creating tables:", err);
  });

// Routes:
app.use("/api", routes);

// Server Setup
const PORT = process.env.PORT_SERVER || 4001;
http.createServer(app).listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
