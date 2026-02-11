const express = require("express");
const router = express.Router();

// Import controllers
const {
  getContentByType,
  getContentBySlug,
  getLatestContent,
  getContentStats,
  getAllPages,
  getPageBySlug,
} = require("../controllers/websiteController");

// Import API key middleware
const { verifyApiKey } = require("../middlewares/apiKey");

// Apply API key verification to all routes
router.use(verifyApiKey);

/**
 * @swagger
 * /api/website/content:
 *   get:
 *     tags:
 *       - Website (Public)
 *     summary: Get content by type (public)
 *     description: Retrieve published content filtered by type (blog, story, or guide). Requires API key in X-API-Key header.
 *     parameters:
 *       - in: header
 *         name: X-API-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Website API key for authentication
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [blog, story, guide]
 *         description: Content type to filter
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
 *           example: "-publicationDate"
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
 *                 message:
 *                   type: string
 *                   example: "Blog content retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalCount:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *                     limit:
 *                       type: integer
 *       400:
 *         description: Invalid or missing type parameter
 *       401:
 *         description: API key missing
 *       403:
 *         description: Invalid API key
 */
router.get("/content", getContentByType);

/**
 * @swagger
 * /api/website/content/latest:
 *   get:
 *     tags:
 *       - Website (Public)
 *     summary: Get latest published content
 *     description: Retrieve latest published content across all types
 *     parameters:
 *       - in: header
 *         name: X-API-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Website API key
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to return
 *     responses:
 *       200:
 *         description: Latest content retrieved successfully
 *       401:
 *         description: API key missing
 *       403:
 *         description: Invalid API key
 */
router.get("/content/latest", getLatestContent);

/**
 * @swagger
 * /api/website/content/{slug}:
 *   get:
 *     tags:
 *       - Website (Public)
 *     summary: Get content by slug (public)
 *     description: Retrieve a specific published content item by its slug
 *     parameters:
 *       - in: header
 *         name: X-API-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Website API key
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Content slug
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *       404:
 *         description: Content not found or not published
 *       401:
 *         description: API key missing
 *       403:
 *         description: Invalid API key
 */
router.get("/content/:slug", getContentBySlug);

/**
 * @swagger
 * /api/website/stats:
 *   get:
 *     tags:
 *       - Website (Public)
 *     summary: Get content statistics
 *     description: Get published content counts by type
 *     parameters:
 *       - in: header
 *         name: X-API-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Website API key
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     byType:
 *                       type: object
 *                       properties:
 *                         blog:
 *                           type: integer
 *                         story:
 *                           type: integer
 *                         guide:
 *                           type: integer
 *       401:
 *         description: API key missing
 *       403:
 *         description: Invalid API key
 */
router.get("/stats", getContentStats);

/**
 * @swagger
 * /api/website/pages:
 *   get:
 *     tags:
 *       - Website (Public)
 *     summary: Get all pages (public)
 *     description: Retrieve all pages with pagination
 *     parameters:
 *       - in: header
 *         name: X-API-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Website API key
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
 *         description: Pages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Page'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: API key missing
 *       403:
 *         description: Invalid API key
 */
router.get("/pages", getAllPages);

/**
 * @swagger
 * /api/website/pages/{slug}:
 *   get:
 *     tags:
 *       - Website (Public)
 *     summary: Get page by slug (public)
 *     description: Retrieve a specific page by its slug
 *     parameters:
 *       - in: header
 *         name: X-API-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Website API key
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Page slug (e.g., "about-us")
 *     responses:
 *       200:
 *         description: Page retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Page'
 *       404:
 *         description: Page not found
 *       401:
 *         description: API key missing
 *       403:
 *         description: Invalid API key
 */
router.get("/pages/:slug", getPageBySlug);

module.exports = router;
