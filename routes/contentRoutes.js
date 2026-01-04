const express = require("express");
const router = express.Router();

// Import controllers
const {
  createContent,
  getAllContent,
  getContentBySlug,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");

// Import middleware
const { handleFileUpload } = require("../middlewares/upload");
const {
  validateContent,
  validateContentUpdate,
} = require("../middlewares/validation");

/**
 * @swagger
 * /api/content:
 *   post:
 *     tags:
 *       - Content
 *     summary: Create new content
 *     description: Create new blog, story, or guide content with optional image upload. Use multipart/form-data for image upload.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - content
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 description: Content title
 *                 example: "My First Blog Post"
 *               type:
 *                 type: string
 *                 enum: [blog, story, guide]
 *                 description: Content type
 *                 example: "blog"
 *               content:
 *                 type: string
 *                 description: Content body/text
 *                 example: "This is the blog content..."
 *               author:
 *                 type: string
 *                 description: Author name
 *                 example: "John Doe"
 *               guideLink:
 *                 type: string
 *                 description: External guide URL (required only for guide type)
 *                 example: "https://example.com/guide"
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *                 description: Publication status
 *                 example: "published"
 *               metaTitle:
 *                 type: string
 *                 description: SEO meta title
 *                 example: "SEO Title"
 *               metaDescription:
 *                 type: string
 *                 description: SEO meta description
 *                 example: "SEO Description for search engines"
 *               keywords:
 *                 type: string
 *                 description: Keywords as comma-separated string (e.g. "blog,nodejs,tutorial") or JSON stringified array (e.g. '["blog","nodejs","tutorial"]'). Will be converted to array automatically.
 *                 example: "blog,nodejs,tutorial"
 *               publicationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Publication date
 *                 example: "2025-12-30T10:00:00Z"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (PNG or JPG, max 5MB)
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - content
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 description: Content title
 *               type:
 *                 type: string
 *                 enum: [blog, story, guide]
 *                 description: Content type
 *               content:
 *                 type: string
 *                 description: Content body/text
 *               author:
 *                 type: string
 *                 description: Author name
 *               guideLink:
 *                 type: string
 *                 description: External guide URL (required only for guide type)
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *               publicationDate:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *                 description: Image URL path
 *           example:
 *             title: "My First Blog Post"
 *             type: "blog"
 *             content: "This is the blog content with detailed information..."
 *             author: "John Doe"
 *             status: "published"
 *             metaTitle: "SEO Title for Blog"
 *             metaDescription: "SEO Description for search engines"
 *             keywords: ["blog", "nodejs", "tutorial"]
 *             publicationDate: "2025-12-30T10:00:00Z"
 *     responses:
 *       201:
 *         description: Content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Content created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: Invalid request (e.g., guide type missing guideLink)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *   get:
 *     tags:
 *       - Content
 *     summary: Get all content
 *     description: Retrieve all content with filtering, pagination, and sorting
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [blog, story, guide]
 *         description: Filter by content type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Filter by publication status
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: "-createdAt"
 *         description: Sort field (prefix with - for descending)
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", handleFileUpload, validateContent, createContent);

/**
 * @swagger
 * /api/content/{slug}:
 *   get:
 *     tags:
 *       - Content
 *     summary: Get content by slug
 *     description: Retrieve a specific content item by its URL-friendly slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Content slug (e.g., "my-blog-post")
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     tags:
 *       - Content
 *     summary: Update content by slug
 *     description: Update content details and optionally replace the image
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Content slug
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [blog, story, guide]
 *               guideLink:
 *                 type: string
 *                 format: uri
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *               keywords:
 *                 type: string
 *                 description: Keywords as comma-separated string (e.g. "blog,nodejs,tutorial") or JSON stringified array. Will be converted to array automatically.
 *                 example: "blog,nodejs,tutorial"
 *               publicationDate:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Content updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Content updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *   delete:
 *     tags:
 *       - Content
 *     summary: Delete content by slug
 *     description: Permanently delete a content item by its slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Content slug
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Content deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/", getAllContent);

router.get("/:slug", getContentBySlug);

router.put("/:slug", handleFileUpload, validateContentUpdate, updateContent);

router.delete("/:slug", deleteContent);

module.exports = router;
