/**
 * API Key Authentication Middleware
 * Validates API key for public website routes
 */

/**
 * @desc    Verify API key for public endpoints
 * @access  Public (with API key)
 * @middleware
 */
const verifyApiKey = (req, res, next) => {
  try {
    // Get API key from header
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "API key is required. Please provide X-API-Key header",
      });
    }

    // Verify API key matches environment variable
    if (apiKey !== process.env.WEBSITE_API_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid API key",
      });
    }

    // API key is valid, continue
    next();
  } catch (error) {
    console.error("API Key verification error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error verifying API key",
    });
  }
};

module.exports = {
  verifyApiKey,
};
