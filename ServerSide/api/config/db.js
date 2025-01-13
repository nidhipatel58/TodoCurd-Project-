require("dotenv").config();
const { Sequelize } = require("sequelize");

// Log the environment variable for debugging
console.log(process.env.DATABASE_URL);

// Create Sequelize instance
const sequelize = new Sequelize(
  "postgres://postgres:password123@localhost:5432/auth_db",
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === "production"
          ? { require: true, rejectUnauthorized: false }
          : false,
    },
  }
);

// Test connection to PostgreSQL
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
