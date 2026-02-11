const Content = require("../models/Content");
const Page = require("../models/Page");

/**
 * Website Controller
 * Handles public API endpoints for website content display
 */

/**
 * @desc    Get content by type for website (public)
 * @route   GET /api/website/content
 * @access  Public (API Key required)
 * @query   type (required), page, limit, sort
 */
const getContentByType = async (req, res) => {
  try {
    const { type, page = 1, limit = 10, sort = "-publicationDate" } = req.query;

    // Validate type parameter
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Type parameter is required (blog, story, or guide)",
      });
    }

    // Validate type value
    const validTypes = ["blog", "story", "guide"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Must be one of: blog, story, guide",
      });
    }

    // Build filter - only published content for website
    const filter = {
      type: type,
      status: "published",
    };

    // Calculate pagination
    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Execute query with pagination
    const content = await Content.find(filter)
      .select("-__v") // Exclude version key
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalCount = await Content.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} content retrieved successfully`,
      data: content,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Get content by type error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving content",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single content by slug for website (public)
 * @route   GET /api/website/content/:slug
 * @access  Public (API Key required)
 */
const getContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find content and only return if published
    const content = await Content.findOne({
      slug,
      status: "published",
    }).select("-__v");

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found or not published",
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
 * @desc    Get latest content across all types for website
 * @route   GET /api/website/content/latest
 * @access  Public (API Key required)
 * @query   limit
 */
const getLatestContent = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);

    // Get latest published content across all types
    const content = await Content.find({ status: "published" })
      .select("-__v")
      .sort("-publicationDate")
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: "Latest content retrieved successfully",
      data: content,
      count: content.length,
    });
  } catch (error) {
    console.error("Get latest content error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving content",
      error: error.message,
    });
  }
};

/**
 * @desc    Get content statistics for website
 * @route   GET /api/website/stats
 * @access  Public (API Key required)
 */
const getContentStats = async (req, res) => {
  try {
    // Get counts by type
    const blogCount = await Content.countDocuments({
      type: "blog",
      status: "published",
    });
    const storyCount = await Content.countDocuments({
      type: "story",
      status: "published",
    });
    const guideCount = await Content.countDocuments({
      type: "guide",
      status: "published",
    });

    const totalCount = blogCount + storyCount + guideCount;

    res.status(200).json({
      success: true,
      message: "Content statistics retrieved successfully",
      data: {
        total: totalCount,
        byType: {
          blog: blogCount,
          story: storyCount,
          guide: guideCount,
        },
      },
    });
  } catch (error) {
    console.error("Get content stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving statistics",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all pages for website (public)
 * @route   GET /api/website/pages
 * @access  Public (API Key required)
 * @query   page, limit, sort
 */
const getAllPages = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    // Calculate pagination
    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Execute query with pagination
    const pages = await Page.find({})
      .select("-__v") // Exclude version key
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

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
        limit: limitNum,
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
 * @desc    Get single page by slug for website (public)
 * @route   GET /api/website/pages/:slug
 * @access  Public (API Key required)
 */
const getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find page by slug
    const page = await Page.findOne({ slug }).select("-__v");

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

module.exports = {
  getContentByType,
  getContentBySlug,
  getLatestContent,
  getContentStats,
  getAllPages,
  getPageBySlug,
};
