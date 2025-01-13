const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");

// Define the User model with username, email, and password:-
const User = sequelize.define(
  "User",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [8, 255],
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          msg: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        },
      },
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

// Hash the password before saving to the database
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10); // Hash password with bcrypt
});

// Method to compare password during login
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare hashed password
};

module.exports = User;
