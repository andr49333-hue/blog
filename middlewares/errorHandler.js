/**
 * Global Error Handling Middleware
 * Catches and formats all errors in the application
 */

/**
 * Error handler middleware
 * Should be the last middleware in the application
 */
const errorHandler = (error, req, res, next) => {
  // Default error values
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  console.error("Error Details:", {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Mongoose validation error
  if (error.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(error.errors).map((err) => err.message);
    message = "Validation Error";

    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyValue)[0];
    message = `Duplicate value for ${field}. Please use another value.`;

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  // JSON parsing error
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    statusCode = 400;
    message = "Invalid JSON format";

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  // File upload errors (handled in upload middleware, but just in case)
  if (error.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File size too large. Maximum size allowed is 5MB";

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  // Express-validator errors (should be handled in controllers, but backup)
  if (error.array && typeof error.array === "function") {
    statusCode = 400;
    message = "Validation errors";

    return res.status(statusCode).json({
      success: false,
      message,
      errors: error.array(),
    });
  }

  // Default error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

/**
 * Async error handler wrapper
 * Wraps async functions to catch errors and pass them to error handler
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found error handler
 * Creates a 404 error for unknown routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound,
};
