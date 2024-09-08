import dotenv from "dotenv";

dotenv.config();

// Middleware to check if the user has the required role
const roleCheck = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role; // This is added by the isAuth.js middleware

    if (userRole !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient privileges." });
    }

    next(); // Proceed to the route handler if role matches
  };
};

export default roleCheck;
