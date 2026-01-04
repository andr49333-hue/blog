const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

/**
 * Admin Controller
 * Handles authentication, CRUD operations, and profile management
 */

/**
 * @desc    Login with email and password
 * @route   POST /api/admin/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    console.log("Searching for admin with email:", email);
    // Find admin by email and explicitly select password
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      console.log("Admin not found with email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("Admin found:", admin.email, "isActive:", admin.isActive);

    // Check if admin is active
    if (!admin.isActive) {
      console.log("Admin account is deactivated");
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact administrator.",
      });
    }

    console.log("Comparing password...");
    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("Generating JWT token...");
    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    console.log("Login successful for:", admin.email);
    // Return token and admin info (without password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new admin (super_admin only)
 * @route   POST /api/admins
 * @access  Private (super_admin)
 */
const createAdmin = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { name, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password,
      role: role || "admin",
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: newAdmin.toJSON(),
    });
  } catch (error) {
    console.error("Create admin error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating admin",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all admins with pagination and filtering
 * @route   GET /api/admins
 * @access  Private
 * @query   page, limit, role, isActive
 */
const getAllAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    // Calculate pagination
    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Fetch admins
    const admins = await Admin.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    // Get total count
    const totalCount = await Admin.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      data: admins,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving admins",
      error: error.message,
    });
  }
};

/**
 * @desc    Get admin by ID
 * @route   GET /api/admins/:id
 * @access  Private
 */
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Get admin by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving admin",
      error: error.message,
    });
  }
};

/**
 * @desc    Update admin by ID
 * @route   PUT /api/admins/:id
 * @access  Private (super_admin or self)
 */
const updateAdmin = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Prevent password update through this endpoint
    delete updateData.password;

    // Check if admin exists
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Update admin error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating admin",
      error: error.message,
    });
  }
};

/**
 * @desc    Soft delete admin (super_admin only)
 * @route   DELETE /api/admins/:id
 * @access  Private (super_admin)
 */
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if admin exists
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Soft delete by setting isActive to false
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Admin deactivated successfully",
      data: deletedAdmin,
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting admin",
      error: error.message,
    });
  }
};

/**
 * @desc    Get authenticated admin profile
 * @route   GET /api/admin/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Update admin profile (name & email)
 * @route   PUT /api/admin/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { name, email } = req.body;
    const adminId = req.admin.id;

    // Check if new email is already taken (excluding current admin)
    if (email) {
      const existingAdmin = await Admin.findOne({
        email,
        _id: { $ne: adminId },
      });

      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // Update profile
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { name, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Change password for authenticated admin
 * @route   PUT /api/admin/profile/password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { oldPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    // Get admin with password field
    const admin = await Admin.findById(adminId).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Verify old password
    const isPasswordValid = await admin.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

module.exports = {
  login,
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getProfile,
  updateProfile,
  changePassword,
};
