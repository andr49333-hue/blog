const express = require("express");
const router = express.Router();

// Import controllers
const {
  createPage,
  getAllPages,
  getPageBySlug,
  updatePage,
  deletePage,
} = require("../controllers/pageController");

// Import middleware
const {
  validatePage,
  validatePageUpdate,
} = require("../middlewares/validation");

/**
 * @swagger
 * /api/pages:
 *   post:
 *     tags:
 *       - Pages
 *     summary: Create new page
 *     description: Create a new static page with SEO metadata and tracking codes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageTitle
 *             properties:
 *               pageTitle:
 *                 type: string
 *                 description: Page title (required)
 *               metaTitle:
 *                 type: string
 *                 description: SEO meta title
 *               metaDescription:
 *                 type: string
 *                 description: SEO meta description
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: SEO keywords
 *               googleAnalyticsId:
 *                 type: string
 *                 description: Google Analytics ID (format G-XXXXXXXXXX)
 *               metaPixelCode:
 *                 type: string
 *                 description: Facebook Pixel code (numbers only)
 *               editor_content:
 *                 type: string
 *                 description: Rich text/HTML content for the page (optional)
 *           example:
 *             pageTitle: "About Us"
 *             metaTitle: "About Our Company - CMS"
 *             metaDescription: "Learn more about our company and team"
 *             keywords: ["about", "company", "team"]
 *             googleAnalyticsId: "G-XXXXXXXXXX"
 *             metaPixelCode: "1234567890"
 *             editor_content: "<p>This is the page content with rich text formatting...</p>"
 *     responses:
 *       201:
 *         description: Page created successfully
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
 *                   example: "Page created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Page'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *   get:
 *     tags:
 *       - Pages
 *     summary: Get all pages
 *     description: Retrieve all pages with pagination and sorting options
 *     parameters:
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
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Page'
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
router.post("/", validatePage, createPage);

/**
 * @swagger
 * /api/pages/{slug}:
 *   get:
 *     tags:
 *       - Pages
 *     summary: Get page by slug
 *     description: Retrieve a specific page by its URL-friendly slug
 *     parameters:
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
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Page'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     tags:
 *       - Pages
 *     summary: Update page by slug
 *     description: Update page content, metadata, and tracking codes
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Page slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PageUpdateRequest'
 *     responses:
 *       200:
 *         description: Page updated successfully
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
 *                   example: "Page updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Page'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *   delete:
 *     tags:
 *       - Pages
 *     summary: Delete page by slug
 *     description: Permanently delete a page by its slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Page slug
 *     responses:
 *       200:
 *         description: Page deleted successfully
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
 *                   example: "Page deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/", getAllPages);

router.get("/:slug", getPageBySlug);

router.put("/:slug", validatePageUpdate, updatePage);

router.delete("/:slug", deletePage);

module.exports = router;
