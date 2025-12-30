const Page = require("../models/Page");
const { validationResult } = require("express-validator");

/**
 * Page Controller
 * Handles all CRUD operations for static pages
 */

/**
 * @desc    Create new page
 * @route   POST /api/pages
 * @access  Public
 */
const createPage = async (req, res) => {
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

    // Create new page
    const page = new Page(req.body);
    const savedPage = await page.save();

    res.status(201).json({
      success: true,
      message: "Page created successfully",
      data: savedPage,
    });
  } catch (error) {
    console.error("Create page error:", error);

    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Page with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating page",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all pages with pagination
 * @route   GET /api/pages
 * @access  Public
 * @query   page, limit, sort
 */
const getAllPages = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    // Calculate pagination
    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Execute query with pagination
    const pages = await Page.find({}).sort(sort).skip(skip).limit(limitNum);

    // Get total count for pagination
    const totalCount = await Page.countDocuments({});
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      message: "Pages retrieved successfully",
      data: pages,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all pages error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving pages",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single page by slug
 * @route   GET /api/pages/:slug
 * @access  Public
 */
const getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = await Page.findOne({ slug });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Page retrieved successfully",
      data: page,
    });
  } catch (error) {
    console.error("Get page by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving page",
      error: error.message,
    });
  }
};

/**
 * @desc    Update page by slug
 * @route   PUT /api/pages/:slug
 * @access  Public
 */
const updatePage = async (req, res) => {
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

    // Update page
    const page = await Page.findOneAndUpdate({ slug }, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validations
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Page updated successfully",
      data: page,
    });
  } catch (error) {
    console.error("Update page error:", error);

    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Page with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating page",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete page by slug
 * @route   DELETE /api/pages/:slug
 * @access  Public
 */
const deletePage = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = await Page.findOneAndDelete({ slug });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Page deleted successfully",
      data: page,
    });
  } catch (error) {
    console.error("Delete page error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting page",
      error: error.message,
    });
  }
};

module.exports = {
  createPage,
  getAllPages,
  getPageBySlug,
  updatePage,
  deletePage,
};
