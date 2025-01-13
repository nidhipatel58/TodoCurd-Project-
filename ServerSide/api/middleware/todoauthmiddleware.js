let jwt = require("jsonwebtoken");

let createToken = (data) => {
  console.log(data, "jwt");
  let token = jwt.sign(data, process.env.JWT_SECERT || "Master@8110##");
  return token;
};

module.exports = createToken;
