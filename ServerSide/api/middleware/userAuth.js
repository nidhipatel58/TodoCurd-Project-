// Middleware to ensure that users can only access their own data
const checkUserAuthorization = (req, res, next) => {
  const { id } = req.params; // User ID is expected to be in the route params

  // If the ID in the route doesn't match the one in the token, deny access
  if (req.user.id !== id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to access this data" });
  }
  next();
};

module.exports = { checkUserAuthorization };
