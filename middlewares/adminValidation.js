const { body } = require("express-validator");

/**
 * Admin Validation Middleware
 * Validation rules for admin authentication and management
 */

/**
 * Validation rules for admin login
 */
const validateAdminLogin = [
  body("email").isEmail().withMessage("Please enter a valid email"),

  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validation rules for creating admin
 */
const validateCreateAdmin = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email").isEmail().withMessage("Please enter a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["admin", "super_admin"])
    .withMessage("Role must be either admin or super_admin"),
];

/**
 * Validation rules for updating admin
 */
const validateUpdateAdmin = [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email").optional().isEmail().withMessage("Please enter a valid email"),

  body("role")
    .optional()
    .isIn(["admin", "super_admin"])
    .withMessage("Role must be either admin or super_admin"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

/**
 * Validation rules for updating profile
 */
const validateUpdateProfile = [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email").optional().isEmail().withMessage("Please enter a valid email"),
];

/**
 * Validation rules for changing password
 */
const validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

module.exports = {
  validateAdminLogin,
  validateCreateAdmin,
  validateUpdateAdmin,
  validateUpdateProfile,
  validateChangePassword,
};
