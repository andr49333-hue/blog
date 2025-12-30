const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CMS Backend API",
      description:
        "A complete Content Management System API with admin authentication, content management (blog, story, guide), and page management",
      version: "1.0.0",
      contact: {
        name: "API Support",
        email: "support@cms.local",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
      {
        url: "https://api.example.com",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Bearer token for authenticated endpoints",
        },
      },
      schemas: {
        // Admin schemas
        AdminLoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
              description: "Admin email address",
            },
            password: {
              type: "string",
              format: "password",
              example: "securePassword123",
              description: "Admin password (minimum 6 characters)",
            },
          },
        },
        AdminLoginResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Login successful",
            },
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  description: "JWT token for authentication",
                },
                admin: {
                  $ref: "#/components/schemas/Admin",
                },
              },
            },
          },
        },
        Admin: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Admin ID",
            },
            name: {
              type: "string",
              description: "Admin full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "Admin email address",
            },
            role: {
              type: "string",
              enum: ["admin", "super_admin"],
              description: "Admin role",
            },
            isActive: {
              type: "boolean",
              description: "Active status",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        AdminCreateRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              minLength: 2,
              example: "John Doe",
              description: "Admin name (minimum 2 characters)",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 6,
              example: "securePassword123",
              description: "Password (minimum 6 characters)",
            },
            role: {
              type: "string",
              enum: ["admin", "super_admin"],
              default: "admin",
              description: "Admin role (default: admin)",
            },
          },
        },
        AdminUpdateRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 2,
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["admin", "super_admin"],
            },
          },
        },
        PasswordChangeRequest: {
          type: "object",
          required: ["oldPassword", "newPassword"],
          properties: {
            oldPassword: {
              type: "string",
              format: "password",
              example: "oldPassword123",
              description: "Current password",
            },
            newPassword: {
              type: "string",
              format: "password",
              minLength: 6,
              example: "newPassword123",
              description: "New password (minimum 6 characters)",
            },
          },
        },

        // Content schemas
        Content: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Content ID",
            },
            title: {
              type: "string",
              description: "Content title",
            },
            slug: {
              type: "string",
              description: "URL-friendly slug (auto-generated)",
            },
            type: {
              type: "string",
              enum: ["blog", "story", "guide"],
              description: "Content type",
            },
            content: {
              type: "string",
              description: "Content body/text",
            },
            author: {
              type: "string",
              description: "Content author",
            },
            guideLink: {
              type: "string",
              format: "uri",
              description: "External guide link (only for guide type)",
            },
            image: {
              type: "string",
              description: "Image URL or path",
            },
            status: {
              type: "string",
              enum: ["draft", "published", "archived"],
              default: "draft",
            },
            metaTitle: {
              type: "string",
              description: "SEO meta title",
            },
            metaDescription: {
              type: "string",
              description: "SEO meta description",
            },
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "SEO keywords",
            },
            publicationDate: {
              type: "string",
              format: "date-time",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ContentCreateRequest: {
          type: "object",
          required: ["title", "type", "content", "author"],
          properties: {
            title: {
              type: "string",
              example: "My First Blog Post",
              description: "Content title",
            },
            type: {
              type: "string",
              enum: ["blog", "story", "guide"],
              example: "blog",
              description: "Content type",
            },
            content: {
              type: "string",
              example: "This is the content body...",
              description: "Content body/text",
            },
            author: {
              type: "string",
              example: "John Doe",
              description: "Author name",
            },
            guideLink: {
              type: "string",
              format: "uri",
              example: "https://example.com/guide",
              description: "External guide link (required only for guide type)",
            },
            status: {
              type: "string",
              enum: ["draft", "published", "archived"],
              default: "draft",
            },
            metaTitle: {
              type: "string",
              description: "SEO meta title",
            },
            metaDescription: {
              type: "string",
              description: "SEO meta description",
            },
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "SEO keywords",
            },
            publicationDate: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ContentUpdateRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            content: {
              type: "string",
            },
            author: {
              type: "string",
            },
            guideLink: {
              type: "string",
              format: "uri",
            },
            status: {
              type: "string",
              enum: ["draft", "published", "archived"],
            },
            metaTitle: {
              type: "string",
            },
            metaDescription: {
              type: "string",
            },
            keywords: {
              type: "array",
              items: { type: "string" },
            },
            publicationDate: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Page schemas
        Page: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Page ID",
            },
            pageTitle: {
              type: "string",
              description: "Page title",
            },
            slug: {
              type: "string",
              description: "URL-friendly slug (auto-generated)",
            },
            pageContent: {
              type: "string",
              description: "Page HTML content",
            },
            metaTitle: {
              type: "string",
              description: "SEO meta title",
            },
            metaDescription: {
              type: "string",
              description: "SEO meta description",
            },
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "SEO keywords",
            },
            googleAnalyticsId: {
              type: "string",
              description: "Google Analytics tracking ID",
            },
            metaPixelCode: {
              type: "string",
              description: "Facebook Pixel tracking code",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        PageCreateRequest: {
          type: "object",
          required: ["pageTitle"],
          properties: {
            pageTitle: {
              type: "string",
              example: "About Us",
              description: "Page title (required)",
            },
            pageContent: {
              type: "string",
              example: "<h1>About Our Company</h1><p>We are...</p>",
              description: "Page HTML content",
            },
            metaTitle: {
              type: "string",
              description: "SEO meta title",
            },
            metaDescription: {
              type: "string",
              description: "SEO meta description",
            },
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "SEO keywords",
            },
            googleAnalyticsId: {
              type: "string",
              example: "UA-XXXXXXXXX-X",
              description: "Google Analytics ID",
            },
            metaPixelCode: {
              type: "string",
              description: "Facebook Pixel code",
            },
          },
        },
        PageUpdateRequest: {
          type: "object",
          properties: {
            pageTitle: {
              type: "string",
            },
            pageContent: {
              type: "string",
            },
            metaTitle: {
              type: "string",
            },
            metaDescription: {
              type: "string",
            },
            keywords: {
              type: "array",
              items: { type: "string" },
            },
            googleAnalyticsId: {
              type: "string",
            },
            metaPixelCode: {
              type: "string",
            },
          },
        },

        // Error schemas
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Validation error",
            },
            errors: {
              type: "array",
              items: { type: "object" },
            },
          },
        },
        AuthorizationError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "You do not have permission to perform this action",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: {
                    type: "string",
                    example: "No token, authorization denied",
                  },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: "User does not have permission",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthorizationError",
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationError",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "System health check endpoints",
      },
      {
        name: "Authentication",
        description: "Admin authentication endpoints",
      },
      {
        name: "Admins",
        description: "Admin management endpoints",
      },
      {
        name: "Content",
        description: "Content management endpoints (Blog, Story, Guide)",
      },
      {
        name: "Pages",
        description: "Static page management endpoints",
      },
    ],
  },
  apis: [
    "./routes/adminRoutes.js",
    "./routes/contentRoutes.js",
    "./routes/pageRoutes.js",
    "./server.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
