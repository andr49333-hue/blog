const Content = require("../models/Content");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

/**
 * Content Controller
 * Handles all CRUD operations for blog and story content
 */

// Helper function to get full image URL
const getImageUrl = (filename, req) => {
  if (!filename) return "";
  return `/uploads/${filename}`;
};

// Helper function to delete image file
const deleteImageFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../uploads", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * @desc    Create new content (blog or story)
 * @route   POST /api/content
 * @access  Public
 */
const createContent = async (req, res) => {
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

    // Handle file upload if image is provided
    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Handle keywords if sent as string (comma separated)
    let keywords = req.body.keywords;
    if (typeof keywords === "string") {
      keywords = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);
    }

    // Create content object
    const contentData = {
      ...req.body,
      keywords: keywords || [],
      image: imageUrl,
    };

    // Create new content
    const content = new Content(contentData);
    const savedContent = await content.save();

    res.status(201).json({
      success: true,
      message: `${
        content.type.charAt(0).toUpperCase() + content.type.slice(1)
      } created successfully`,
      data: savedContent,
    });
  } catch (error) {
    console.error("Create content error:", error);

    // Delete uploaded file if there was an error
    if (req.file) {
      deleteImageFile(req.file.filename);
    }

    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Content with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating content",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all content with filtering and pagination
 * @route   GET /api/content
 * @access  Public
 * @query   type, status, author, page, limit, sort
 */
const getAllContent = async (req, res) => {
  try {
    // Build filter object
    const filter = {};
    const {
      type,
      status,
      author,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (author) filter.author = new RegExp(author, "i"); // Case-insensitive search

    // Calculate pagination
    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Execute query with pagination
    const content = await Content.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalCount = await Content.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      message: "Content retrieved successfully",
      data: content,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all content error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving content",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single content by slug
 * @route   GET /api/content/:slug
 * @access  Public
 */
const getContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await Content.findOne({ slug });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Content retrieved successfully",
      data: content,
    });
  } catch (error) {
    console.error("Get content by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving content",
      error: error.message,
    });
  }
};

/**
 * @desc    Update content by slug
 * @route   PUT /api/content/:slug
 * @access  Public
 */
const updateContent = async (req, res) => {
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

    const { slug } = req.params;

    // Find existing content to get old image
    const existingContent = await Content.findOne({ slug });
    if (!existingContent) {
      // Delete uploaded file if content not found
      if (req.file) {
        deleteImageFile(req.file.filename);
      }
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Handle file upload if new image is provided
    if (req.file) {
      // Delete old image file
      if (existingContent.image) {
        const oldFilename = existingContent.image.replace("/uploads/", "");
        deleteImageFile(oldFilename);
      }
      req.body.image = `/uploads/${req.file.filename}`;
    }

    // Handle keywords if sent as string (comma separated)
    if (typeof req.body.keywords === "string") {
      req.body.keywords = req.body.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);
    }

    // Update content
    const content = await Content.findOneAndUpdate({ slug }, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validations
    });

    res.status(200).json({
      success: true,
      message: "Content updated successfully",
      data: content,
    });
  } catch (error) {
    console.error("Update content error:", error);

    // Delete uploaded file if there was an error
    if (req.file) {
      deleteImageFile(req.file.filename);
    }

    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Content with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating content",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete content by slug
 * @route   DELETE /api/content/:slug
 * @access  Public
 */
const deleteContent = async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await Content.findOneAndDelete({ slug });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Delete associated image file
    if (content.image) {
      const filename = content.image.replace("/uploads/", "");
      deleteImageFile(filename);
    }

    res.status(200).json({
      success: true,
      message: "Content deleted successfully",
      data: content,
    });
  } catch (error) {
    console.error("Delete content error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting content",
      error: error.message,
    });
  }
};

module.exports = {
  createContent,
  getAllContent,
  getContentBySlug,
  updateContent,
  deleteContent,
};
