const { body } = require("express-validator");

/**
 * Validation Middleware using express-validator
 * Defines validation rules for different endpoints
 */

/**
 * Validation rules for creating/updating content (blog/story)
 */
const validateContent = [
  body("type")
    .isIn(["blog", "story", "guide"])
    .withMessage("Type must be either blog, story, or guide"),

  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters")
    .trim(),

  body("content").notEmpty().withMessage("Content is required").trim(),

  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either draft or published"),

  body("author").notEmpty().withMessage("Author is required").trim(),

  body("publicationDate")
    .notEmpty()
    .withMessage("Publication date is required")
    .isISO8601()
    .withMessage("Publication date must be a valid date"),

  body("slug")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Slug must be between 1 and 200 characters")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  body("metaTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Meta title cannot exceed 60 characters"),

  body("metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters"),

  body("keywords")
    .optional()
    .isArray()
    .withMessage("Keywords must be an array"),

  body("keywords.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each keyword must be between 1 and 50 characters"),

  body("guideLink")
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (req.body.type === "guide" && value) {
        // Validate as URL only when type is 'guide' and value is provided
        try {
          new URL(value);
          return true;
        } catch (error) {
          throw new Error("guideLink must be a valid URL when type is guide");
        }
      }
      return true;
    }),
];

/**
 * Validation rules for updating content (optional fields)
 */
const validateContentUpdate = [
  body("type")
    .optional()
    .isIn(["blog", "story", "guide"])
    .withMessage("Type must be either blog, story, or guide"),

  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters")
    .trim(),

  body("content")
    .optional()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .trim(),

  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either draft or published"),

  body("author")
    .optional()
    .notEmpty()
    .withMessage("Author cannot be empty")
    .trim(),

  body("publicationDate")
    .optional()
    .isISO8601()
    .withMessage("Publication date must be a valid date"),

  body("slug")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Slug must be between 1 and 200 characters")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  body("metaTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Meta title cannot exceed 60 characters"),

  body("metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters"),

  body("keywords")
    .optional()
    .isArray()
    .withMessage("Keywords must be an array"),

  body("keywords.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each keyword must be between 1 and 50 characters"),

  body("guideLink")
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (req.body.type === "guide" && value) {
        // Validate as URL only when type is 'guide' and value is provided
        try {
          new URL(value);
          return true;
        } catch (error) {
          throw new Error("guideLink must be a valid URL when type is guide");
        }
      }
      return true;
    }),
];

/**
 * Validation rules for creating/updating pages
 */
const validatePage = [
  body("pageTitle")
    .notEmpty()
    .withMessage("Page title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Page title must be between 1 and 200 characters")
    .trim(),

  body("slug")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Slug must be between 1 and 200 characters")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  body("metaTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Meta title cannot exceed 60 characters"),

  body("metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters"),

  body("keywords")
    .optional()
    .isArray()
    .withMessage("Keywords must be an array"),

  body("keywords.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each keyword must be between 1 and 50 characters"),

  body("googleAnalyticsId")
    .optional()
    .trim()
    .matches(/^(GA-\d{4,}-\d+|G-[A-Z0-9]{10})$/)
    .withMessage(
      "Invalid Google Analytics ID format. Use GA-XXXXXX-X or G-XXXXXXXXXX"
    ),

  body("metaPixelCode")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Meta Pixel code must contain only numbers"),
];

/**
 * Validation rules for updating pages (optional fields)
 */
const validatePageUpdate = [
  body("pageTitle")
    .optional()
    .notEmpty()
    .withMessage("Page title cannot be empty")
    .isLength({ min: 1, max: 200 })
    .withMessage("Page title must be between 1 and 200 characters")
    .trim(),

  body("slug")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Slug must be between 1 and 200 characters")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  body("metaTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Meta title cannot exceed 60 characters"),

  body("metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters"),

  body("keywords")
    .optional()
    .isArray()
    .withMessage("Keywords must be an array"),

  body("keywords.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each keyword must be between 1 and 50 characters"),

  body("googleAnalyticsId")
    .optional()
    .trim()
    .matches(/^(GA-\d{4,}-\d+|G-[A-Z0-9]{10})$/)
    .withMessage(
      "Invalid Google Analytics ID format. Use GA-XXXXXX-X or G-XXXXXXXXXX"
    ),

  body("metaPixelCode")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Meta Pixel code must contain only numbers"),
];

module.exports = {
  validateContent,
  validateContentUpdate,
  validatePage,
  validatePageUpdate,
};
