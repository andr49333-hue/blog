const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Admin Schema for authentication and access control
 * Stores admin user information with encrypted passwords
 */
const adminSchema = new mongoose.Schema(
  {
    // Admin full name
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    // Admin email (unique)
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    // Hashed password
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },

    // Admin role
    role: {
      type: String,
      enum: {
        values: ["admin", "super_admin"],
        message: "Role must be either admin or super_admin",
      },
      default: "admin",
    },

    // Account active status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

/**
 * Pre-save middleware to hash password before saving
 * Only hash if password is new or modified
 */
adminSchema.pre("save", async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare password with hashed password
 * @param {String} passwordToCompare - Plain text password to verify
 * @returns {Boolean} True if password matches, false otherwise
 */
adminSchema.methods.comparePassword = async function (passwordToCompare) {
  return await bcrypt.compare(passwordToCompare, this.password);
};

/**
 * Method to get admin data without password
 * Used in API responses
 */
adminSchema.methods.toJSON = function () {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

/**
 * Index for better query performance
 */
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1, isActive: 1 });

module.exports = mongoose.model("Admin", adminSchema);
