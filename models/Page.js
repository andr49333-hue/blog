const mongoose = require("mongoose");
const slugify = require("slugify");

/**
 * Page Schema for static pages
 * Handles SEO and tracking configuration for pages
 */
const pageSchema = new mongoose.Schema(
  {
    // Page title
    pageTitle: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
      maxlength: [200, "Page title cannot be more than 200 characters"],
    },

    // URL-friendly version of page title
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // SEO meta information
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, "Meta title cannot be more than 60 characters"],
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot be more than 160 characters"],
    },

    // SEO keywords
    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Google Analytics tracking ID for this specific page
    googleAnalyticsId: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Basic validation for GA tracking ID format (GA-XXXXXX-X or G-XXXXXXXXXX)
          return !v || /^(GA-\d{4,}-\d+|G-[A-Z0-9]{10})$/.test(v);
        },
        message: "Invalid Google Analytics ID format",
      },
    },

    // Meta Pixel (Facebook Pixel) code for this page
    metaPixelCode: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Basic validation for numeric pixel ID
          return !v || /^\d+$/.test(v);
        },
        message: "Meta Pixel code should only contain numbers",
      },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

/**
 * Pre-save middleware to generate slug from pageTitle
 * Only generates slug if it's not already provided
 */
pageSchema.pre("save", function (next) {
  if (!this.slug && this.pageTitle) {
    // Generate base slug from page title
    const baseSlug = slugify(this.pageTitle, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    this.slug = baseSlug;
  }
  next();
});

/**
 * Pre-save middleware to handle duplicate slugs
 * Appends number suffix if slug already exists
 */
pageSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("pageTitle") || this.isModified("slug")) {
    const originalSlug = this.slug;
    let counter = 1;

    // Check if slug already exists
    while (
      await this.constructor.findOne({
        slug: this.slug,
        _id: { $ne: this._id },
      })
    ) {
      this.slug = `${originalSlug}-${counter}`;
      counter++;
    }
  }
  next();
});

/**
 * Index for better query performance
 */
pageSchema.index({ slug: 1 });

module.exports = mongoose.model("Page", pageSchema);
