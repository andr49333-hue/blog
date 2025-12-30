# Swagger/OpenAPI Documentation Setup

**Status:** ✅ **COMPLETE**

---

## Overview

Comprehensive Swagger/OpenAPI 3.0 documentation has been added to the CMS Backend API. The Swagger UI provides interactive API documentation accessible through a web interface.

---

## Quick Access

### 🔗 Live Swagger UI

```
http://localhost:5000/api/docs
```

Open this URL in your browser to explore the API interactively.

---

## Installation

### Packages Added

- **swagger-jsdoc** (^6.2.8) - Generates OpenAPI specs from JSDoc comments
- **swagger-ui-express** (^5.0.0) - Serves Swagger UI in Express

### Installation Command

```bash
npm install swagger-jsdoc swagger-ui-express
```

**Status:** ✅ Installed (0 vulnerabilities)

---

## Files Created/Modified

### New Files

1. **[config/swagger.js](config/swagger.js)** ✅
   - OpenAPI 3.0 configuration
   - Component schemas (Admin, Content, Page, Error responses)
   - Security schemes (JWT Bearer Auth)
   - Server definitions
   - Tag definitions

### Modified Files

1. **[server.js](server.js)** ✅

   - Added Swagger imports
   - Mounted `/api/docs` route
   - Added JSDoc for health check endpoint

2. **[routes/adminRoutes.js](routes/adminRoutes.js)** ✅

   - Complete Swagger documentation for 9 endpoints
   - Request/response schemas
   - Security definitions
   - Error responses

3. **[routes/contentRoutes.js](routes/contentRoutes.js)** ✅

   - Complete Swagger documentation for 5 endpoints
   - File upload schema (multipart/form-data)
   - Filtering, pagination, sorting parameters
   - Content type validation (blog, story, guide)

4. **[routes/pageRoutes.js](routes/pageRoutes.js)** ✅

   - Complete Swagger documentation for 5 endpoints
   - Pagination and sorting
   - SEO metadata documentation

5. **[package.json](package.json)** ✅
   - Added swagger-jsdoc and swagger-ui-express dependencies

---

## API Documentation Coverage

### ✅ Authentication APIs (1 endpoint)

```
POST /api/admin/login
  - Admin authentication
  - Returns JWT token
  - Public access
```

### ✅ Admin APIs (9 endpoints)

```
POST   /api/admins              - Create admin (super_admin only)
GET    /api/admins              - List all admins (with pagination)
GET    /api/admins/{id}         - Get specific admin
PUT    /api/admins/{id}         - Update admin
DELETE /api/admins/{id}         - Delete admin (soft delete, super_admin only)
GET    /api/admin/profile       - Get current admin profile
PUT    /api/admin/profile       - Update current admin profile
PUT    /api/admin/profile/password - Change password
```

### ✅ Content APIs (5 endpoints)

```
POST   /api/content             - Create content (blog, story, guide)
GET    /api/content             - List all content (with filtering/pagination)
GET    /api/content/{slug}      - Get single content
PUT    /api/content/{slug}      - Update content
DELETE /api/content/{slug}      - Delete content
```

**Special Documentation:**

- Content type validation (blog, story, guide)
- Guide-specific guideLink field validation
- File upload handling
- Filtering by type, status, author
- Sorting and pagination

### ✅ Page APIs (5 endpoints)

```
POST   /api/pages               - Create page
GET    /api/pages               - List all pages (with pagination)
GET    /api/pages/{slug}        - Get single page
PUT    /api/pages/{slug}        - Update page
DELETE /api/pages/{slug}        - Delete page
```

**Special Documentation:**

- SEO metadata fields
- Google Analytics integration
- Facebook Pixel tracking
- Pagination and sorting

### ✅ System APIs (1 endpoint)

```
GET    /api/health              - Health check (no auth required)
```

---

## Security Schemes

### JWT Bearer Authentication

```
Type:        HTTP
Scheme:      Bearer
Format:      JWT
Description: Token-based authentication for protected endpoints
```

**How to Use in Swagger UI:**

1. Click the "Authorize" button (top-right)
2. Enter your JWT token: `your_jwt_token_here`
3. Click "Authorize" to apply token to all protected endpoints
4. Make requests in Swagger UI - token automatically included

**Token Duration:** 7 days

---

## Request/Response Schemas

### Components Defined

#### Authentication

- `AdminLoginRequest` - Email and password
- `AdminLoginResponse` - Token and admin data

#### Admin Management

- `Admin` - Complete admin object
- `AdminCreateRequest` - Fields for creating admin
- `AdminUpdateRequest` - Fields for updating admin
- `PasswordChangeRequest` - Old and new password

#### Content Management

- `Content` - Complete content object (blog, story, guide)
- `ContentCreateRequest` - Fields for creating content
- `ContentUpdateRequest` - Fields for updating content

#### Page Management

- `Page` - Complete page object
- `PageCreateRequest` - Fields for creating page
- `PageUpdateRequest` - Fields for updating page

#### Error Responses

- `Error` - Generic error response
- `ValidationError` - Validation errors
- `AuthorizationError` - Authorization failures
- `UnauthorizedError` - Missing/invalid token
- `ForbiddenError` - Permission denied
- `NotFoundError` - Resource not found
- `ValidationError` - Input validation errors

---

## Feature Documentation

### Content Types (Blog, Story, Guide)

```
type: "blog" | "story" | "guide"
  - blog:     Blog post content
  - story:    Story/narrative content
  - guide:    Guide with external link

guideLink (guide type only):
  - Required: Only for type="guide"
  - Format: Valid URL (http:// or https://)
  - Example: "https://nodejs.org/docs"
```

### Authentication & Authorization

```
Public Endpoints (no token required):
- POST /api/admin/login
- GET  /api/health
- GET  /api/content
- GET  /api/content/{slug}
- POST /api/content (create content)
- All page endpoints

Protected Endpoints (require valid JWT):
- All /api/admins endpoints
- All /api/admin/profile endpoints

Super Admin Only:
- POST /api/admins (create)
- DELETE /api/admins/{id} (delete)
```

### Pagination & Filtering

#### Pagination

```
page:  Integer (default: 1)
limit: Integer (default: 10)

Example:
GET /api/admins?page=2&limit=20
GET /api/content?page=1&limit=5
GET /api/pages?page=1&limit=10
```

#### Sorting

```
sort: Field name with optional prefix
  -   : Descending order
  (no prefix): Ascending order

Example:
GET /api/content?sort=-createdAt (newest first)
GET /api/admins?sort=name (A-Z)
GET /api/pages?sort=-updatedAt
```

#### Content Filtering

```
type:   "blog" | "story" | "guide"
status: "draft" | "published" | "archived"
author: Author name (string)

Examples:
GET /api/content?type=blog
GET /api/content?status=published
GET /api/content?author=John%20Doe
GET /api/content?type=guide&status=published
```

---

## Response Format

### Success Response (200/201)

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* resource data */
  },
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

### Error Response (4xx/5xx)

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Testing the API with Swagger UI

### Step 1: Open Swagger UI

```
http://localhost:5000/api/docs
```

### Step 2: Try Health Check

1. Find "Health" section
2. Click "GET /api/health"
3. Click "Try it out"
4. Click "Execute"
5. See response (should be 200 OK)

### Step 3: Authenticate (Admin Login)

1. Find "Authentication" section
2. Click "POST /api/admin/login"
3. Click "Try it out"
4. Enter email and password
5. Click "Execute"
6. Copy the JWT token from response

### Step 4: Use Token for Protected Endpoints

1. Click "Authorize" button (top-right)
2. Paste JWT token: `your_token_here`
3. Click "Authorize"
4. Now access protected endpoints:
   - GET /api/admins
   - GET /api/admin/profile
   - etc.

---

## Swagger Configuration

### Location

[config/swagger.js](config/swagger.js)

### Key Settings

```javascript
openapi: "3.0.0"
info:
  title: "CMS Backend API"
  version: "1.0.0"
  description: "Content Management System with Admin Auth"

servers:
  - url: http://localhost:5000 (Development)
  - url: https://api.example.com (Production)

securitySchemes:
  BearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
```

### Customization

Edit [config/swagger.js](config/swagger.js) to:

- Change API title/description
- Update server URLs
- Modify contact information
- Adjust tags and groups
- Update schema definitions

---

## Implementation Details

### JSDoc Comments Format

```javascript
/**
 * @swagger
 * /api/endpoint:
 *   method:
 *     tags:
 *       - Tag Name
 *     summary: Short description
 *     description: Detailed description
 *     security:
 *       - BearerAuth: []
 *     parameters: [...]
 *     requestBody: {...}
 *     responses: {...}
 */
```

### Where JSDoc is Used

1. **server.js** - Health check endpoint
2. **routes/adminRoutes.js** - All 9 admin endpoints
3. **routes/contentRoutes.js** - All 5 content endpoints
4. **routes/pageRoutes.js** - All 5 page endpoints

### Where Schemas are Defined

All component schemas defined in [config/swagger.js](config/swagger.js):

- Admin schemas
- Content schemas
- Page schemas
- Error schemas
- Response definitions

---

## Code Examples

### Login with cURL

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

### Create Content with Token

```bash
curl -X POST http://localhost:5000/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title":"My Blog Post",
    "type":"blog",
    "content":"Post content here",
    "author":"John Doe"
  }'
```

### Create Guide with Link

```bash
curl -X POST http://localhost:5000/api/content \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Node.js Guide",
    "type":"guide",
    "content":"Guide description",
    "guideLink":"https://nodejs.org/docs",
    "author":"Tech Writer"
  }'
```

### List Content with Filters

```bash
# Get published blog posts
http://localhost:5000/api/content?type=blog&status=published

# Get guides with pagination
http://localhost:5000/api/content?type=guide&page=1&limit=5

# Get by author, sorted by date
http://localhost:5000/api/content?author=John&sort=-createdAt
```

---

## Server Integration

### Start Command

```bash
npm start
```

### Server Output

```
Server running on port 5000 in development mode
MongoDB Connected: localhost (if MongoDB running)
Swagger UI available at: http://localhost:5000/api/docs
```

### Endpoints Available

```
http://localhost:5000/api/docs        ← Swagger UI
http://localhost:5000/api/health      ← Health check
http://localhost:5000/api/admin/login ← Admin login
http://localhost:5000/api/admins      ← Admin CRUD
http://localhost:5000/api/content     ← Content CRUD
http://localhost:5000/api/pages       ← Page CRUD
```

---

## Troubleshooting

### Issue: Swagger UI not loading

**Solution:**

- Check server is running: `Get-Process node`
- Check port 5000 is open: `netstat -ano | findstr :5000`
- Try `http://localhost:5000/api/docs` in browser

### Issue: Routes not showing in Swagger

**Solution:**

- Verify JSDoc comments use `@swagger` tag
- Check JSDoc is before route definitions
- Restart server after adding new routes
- Verify `apis` array in swagger.js includes route files

### Issue: Schemas not appearing

**Solution:**

- Check schemas defined in [config/swagger.js](config/swagger.js)
- Use `$ref: '#/components/schemas/SchemaName'` to reference
- Verify schema names match exactly

### Issue: Token not working in Swagger UI

**Solution:**

1. Get token from login endpoint
2. Click "Authorize" button (top-right)
3. Enter: `your_token_here` (without "Bearer ")
4. System adds "Bearer " prefix automatically
5. Click "Authorize"

---

## Best Practices

### For API Developers

1. Keep JSDoc comments updated with code changes
2. Document all request parameters and responses
3. Include example values in schemas
4. Test endpoints in Swagger UI before deployment
5. Update summary/description when API changes

### For API Consumers

1. Use Swagger UI to explore available endpoints
2. Copy example requests from Swagger
3. Use "Try it out" to test endpoints
4. Check response schemas for data structure
5. Review error responses for error handling

---

## Future Enhancements

### Recommended Additions

1. **Rate Limiting** - Add rate limit headers to responses
2. **Webhooks** - Document webhook events
3. **Batch Operations** - Add bulk create/update endpoints
4. **Search** - Add full-text search documentation
5. **Export** - Download OpenAPI spec as JSON/YAML

### Configuration Options

```javascript
// In config/swagger.js

// Add custom middleware
const swaggerOptions = {
  customCss: `...`,
  customfavIcon: `...`,
  swaggerOptions: {
    persistAuthorization: true,
    filter: true,
    showRequestHeaders: true,
  },
};

// Add SSL/TLS servers
servers: [{ url: "https://api.example.com", description: "Production" }];
```

---

## Support Files

### Documentation Files

- [SWAGGER_SETUP.md](SWAGGER_SETUP.md) ← This file
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Detailed API reference
- [README.md](README.md) - Project overview

### Configuration Files

- [config/swagger.js](config/swagger.js) - Swagger configuration

### Route Files (with JSDoc)

- [routes/adminRoutes.js](routes/adminRoutes.js) - Admin endpoints
- [routes/contentRoutes.js](routes/contentRoutes.js) - Content endpoints
- [routes/pageRoutes.js](routes/pageRoutes.js) - Page endpoints

---

## Quick Reference

| What                     | Where       | How                                     |
| ------------------------ | ----------- | --------------------------------------- |
| **View Swagger UI**      | Browser     | http://localhost:5000/api/docs          |
| **Edit Configuration**   | File        | [config/swagger.js](config/swagger.js)  |
| **Add Endpoint Docs**    | Route Files | Add @swagger JSDoc comments             |
| **Customize Schemas**    | Config      | Edit `components.schemas` in swagger.js |
| **Change Title/Version** | Config      | Edit `info` object in swagger.js        |
| **Add Servers**          | Config      | Edit `servers` array in swagger.js      |

---

## Summary

✅ **Swagger/OpenAPI 3.0 implementation is complete!**

- ✅ Interactive API documentation
- ✅ Request/response schemas
- ✅ Security schemes (JWT Bearer)
- ✅ Full endpoint coverage (20+ endpoints)
- ✅ Filtering, pagination, sorting
- ✅ Error response documentation
- ✅ Example requests and responses

**Access Swagger UI:** http://localhost:5000/api/docs

---

_Last Updated: December 29, 2025_  
_Swagger Version: OpenAPI 3.0.0_  
_Implementation Status: ✅ Complete_
