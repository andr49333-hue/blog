const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware
 * Verifies JWT token and protects admin routes
 */

/**
 * @desc    Authenticate admin using JWT token
 * @access  Private
 * @middleware
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login first",
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach admin info to request
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authentication failed",
      });
    }

    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/**
 * @desc    Verify admin role (super_admin only)
 * @access  Private
 * @middleware
 */
const authorizeSuper = (req, res, next) => {
  if (req.admin.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only super_admin can perform this action",
    });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeSuper,
};
