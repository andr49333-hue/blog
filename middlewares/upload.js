const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * File Upload Middleware using Multer
 * Handles image uploads with size and type restrictions
 */

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Storage configuration for multer
 * Defines where and how files should be stored
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Store files in uploads directory
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + uniqueSuffix + fileExtension;
    cb(null, fileName);
  },
});

/**
 * File filter to accept only PNG and JPG images
 */
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only PNG and JPG images are allowed"), false); // Reject file
  }
};

/**
 * Configure multer with storage, file filter, and size limits
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Only allow single file upload
  },
});

/**
 * Middleware for handling single image upload
 * Field name should be 'image'
 */
const uploadSingle = upload.single("image");

/**
 * Enhanced upload middleware with better error handling
 */
const handleFileUpload = (req, res, next) => {
  uploadSingle(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      // Handle Multer-specific errors
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size allowed is 5MB",
        });
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: "Too many files. Only one file is allowed",
        });
      }

      return res.status(400).json({
        success: false,
        message: `File upload error: ${error.message}`,
      });
    }

    if (error) {
      // Handle custom file filter errors
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // No error, continue to next middleware
    next();
  });
};

module.exports = {
  handleFileUpload,
  uploadsDir,
};
