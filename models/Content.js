const mongoose = require("mongoose");
const slugify = require("slugify");

/**
 * Content Schema for both blogs and stories
 * Supports different content types with shared fields
 */
const contentSchema = new mongoose.Schema(
  {
    // Content type - determines if it's a blog, story, or guide
    type: {
      type: String,
      enum: ["blog", "story", "guide"],
      required: [true, "Content type is required"],
    },

    // Basic content information
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },

    // URL-friendly version of title
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Main content body
    content: {
      type: String,
      required: [true, "Content is required"],
    },

    // Publication status
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    // Author information
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },

    // When content should be/was published
    publicationDate: {
      type: Date,
      default: Date.now,
    },

    // Optional featured image
    image: {
      type: String,
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

    // Guide link (only applicable when type = "guide")
    guideLink: {
      type: String,
      trim: true,
      sparse: true, // Allow null values
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

/**
 * Pre-save middleware to generate slug from title
 * Only generates slug if it's not already provided
 */
contentSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    // Generate base slug from title
    const baseSlug = slugify(this.title, {
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
contentSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("title") || this.isModified("slug")) {
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
contentSchema.index({ type: 1, status: 1 });
contentSchema.index({ slug: 1 });
contentSchema.index({ author: 1 });
contentSchema.index({ publicationDate: -1 });

module.exports = mongoose.model("Content", contentSchema);
