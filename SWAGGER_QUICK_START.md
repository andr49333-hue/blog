# Swagger UI Quick Start Guide

## 🚀 Access Swagger Documentation

### In Your Browser

Open this URL while server is running:

```
http://localhost:5000/api/docs
```

---

## 📝 What You'll See

A beautiful, interactive API documentation with:

- ✅ All 20+ endpoints organized by category
- ✅ Request/response examples
- ✅ Parameter descriptions
- ✅ Error codes and messages
- ✅ Try-it-out functionality
- ✅ Authentication/authorization info

---

## 🔐 Authenticate with JWT Token

### Step 1: Get a Login Token

1. Scroll to **Authentication** section
2. Find **POST /api/admin/login**
3. Click "Try it out"
4. Enter email: `admin@example.com`
5. Enter password: `password123`
6. Click "Execute"
7. Copy the `token` from the response

### Step 2: Use Token for Protected Endpoints

1. Click the **"Authorize"** button (top-right corner)
2. Enter your token in the modal:
   ```
   your_jwt_token_here
   ```
3. Click **"Authorize"**
4. Now all protected endpoints will use your token automatically

---

## 🧪 Test an Endpoint

### Example: Get All Admins

1. Click **Authorize** button first (see above)
2. Scroll to **Admins** section
3. Find **GET /api/admins**
4. Click the endpoint to expand it
5. Click **"Try it out"** button
6. See available parameters (page, limit, role, isActive)
7. Click **"Execute"** to make the request
8. See response with admin list

### Example: Create Blog Post

1. Scroll to **Content** section
2. Find **POST /api/content**
3. Click the endpoint
4. Click **"Try it out"**
5. Fill in the request body:
   ```json
   {
     "title": "My First Blog",
     "type": "blog",
     "content": "This is my blog post content",
     "author": "John Doe",
     "status": "published"
   }
   ```
6. Click **"Execute"**
7. See the created content with auto-generated slug

### Example: Create a Guide with Link

1. Scroll to **Content** section
2. Find **POST /api/content**
3. Click "Try it out"
4. Fill in the request body:
   ```json
   {
     "title": "Node.js Guide",
     "type": "guide",
     "content": "Complete guide to Node.js",
     "author": "Tech Writer",
     "guideLink": "https://nodejs.org/docs",
     "status": "published"
   }
   ```
5. Click **"Execute"**

---

## 📊 Understanding the Swagger UI

### Sections

- **Health** - System health check
- **Authentication** - Login endpoint
- **Admins** - Admin management (9 endpoints)
- **Content** - Blog/Story/Guide content (5 endpoints)
- **Pages** - Static pages (5 endpoints)

### Response Codes

- **200/201** - Success (green)
- **400** - Bad request (orange)
- **401** - Unauthorized (red)
- **403** - Forbidden (red)
- **404** - Not found (red)
- **422** - Validation error (red)
- **500** - Server error (red)

### Icons & Colors

- 🔓 **Unlocked** - Public endpoint (no auth required)
- 🔒 **Locked** - Protected endpoint (requires token)
- 🟢 **GET** - Retrieve data
- 🟠 **POST** - Create data
- 🟡 **PUT** - Update data
- 🔴 **DELETE** - Delete data

---

## 🎯 Common Tasks

### List All Content with Filters

1. Find **GET /api/content**
2. Click "Try it out"
3. Set query parameters:
   - **type**: `blog` (or `story` or `guide`)
   - **status**: `published`
   - **page**: `1`
   - **limit**: `10`
4. Click "Execute"

### Get Specific Content by Slug

1. Find **GET /api/content/{slug}**
2. Click "Try it out"
3. Enter slug: `my-blog-post`
4. Click "Execute"

### Update Admin Profile

1. Authorize first (click Authorize button)
2. Find **PUT /api/admin/profile**
3. Click "Try it out"
4. Enter request body:
   ```json
   {
     "name": "Updated Name"
   }
   ```
5. Click "Execute"

### Delete Content

1. Find **DELETE /api/content/{slug}**
2. Click "Try it out"
3. Enter slug: `post-to-delete`
4. Click "Execute"
5. See success message

---

## 🔑 Understanding Parameters

### Path Parameters

```
/api/content/{slug}
  ↓
{slug} = "my-blog-post"
```

Enter in the field next to the parameter name

### Query Parameters

```
GET /api/content?type=blog&page=1&limit=10
  ↓
type: "blog"
page: 1
limit: 10
```

Fill in the form fields on the right

### Request Body

```json
POST /api/content
{
  "title": "...",
  "content": "...",
  ...
}
```

Edit the JSON in the text area

---

## 📖 Response Structure

### Successful Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "...",
    "name": "...",
    ...
  }
}
```

### List Response (with Pagination)

```json
{
  "success": true,
  "data": [
    {
      /* item 1 */
    },
    {
      /* item 2 */
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## ⚡ Pro Tips

### Copy as cURL

Most modern Swagger UIs let you:

1. Click "Try it out"
2. Look for a "Copy" button next to the request
3. Paste in terminal to run with cURL

### Save Authentication

Check "Authorize" dialog for:

- "Persist authorization" option
- Saves token between page refreshes
- Automatically includes token in all requests

### View Full Response

- Click "Response" tab to see full data
- Look at "Headers" to see response metadata
- Check "Raw" view for unformatted response

### Check Request Headers

- Some endpoints show required headers
- Authorization header automatically added after login
- Content-Type automatically set for forms

---

## 🛠️ Common Issues

### Issue: "Unauthorized" (401) Error

**Solution:**

- Click "Authorize" button
- Enter your JWT token
- Make sure token is valid (not expired)

### Issue: Endpoint Not Found (404)

**Solution:**

- Check spelling of parameter (case-sensitive)
- Check slug format (URL-friendly, lowercase)
- Verify resource exists

### Issue: Validation Error (422)

**Solution:**

- Check required fields are filled
- Follow field format requirements
- Check error details in response

### Issue: Server Error (500)

**Solution:**

- Check MongoDB is running
- Check server logs for error details
- Restart server if needed

---

## 📚 API Endpoints Overview

### Authentication (1)

```
POST /api/admin/login              Login with email/password
```

### Admin Management (9)

```
POST   /api/admins                 Create admin
GET    /api/admins                 List all admins
GET    /api/admins/{id}            Get admin by ID
PUT    /api/admins/{id}            Update admin
DELETE /api/admins/{id}            Delete admin
GET    /api/admin/profile          Get your profile
PUT    /api/admin/profile          Update your profile
PUT    /api/admin/profile/password Change your password
```

### Content Management (5)

```
POST   /api/content                Create content
GET    /api/content                List content (with filters)
GET    /api/content/{slug}         Get content by slug
PUT    /api/content/{slug}         Update content
DELETE /api/content/{slug}         Delete content
```

### Page Management (5)

```
POST   /api/pages                  Create page
GET    /api/pages                  List pages
GET    /api/pages/{slug}           Get page by slug
PUT    /api/pages/{slug}           Update page
DELETE /api/pages/{slug}           Delete page
```

### System (1)

```
GET    /api/health                 Health check
```

---

## 🎓 Learn More

See detailed documentation:

- **Complete Setup:** [SWAGGER_SETUP.md](SWAGGER_SETUP.md)
- **API Details:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Project Info:** [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

---

## 🚀 Next Steps

1. ✅ Start server: `npm start`
2. ✅ Open Swagger: http://localhost:5000/api/docs
3. ✅ Login with test credentials
4. ✅ Try different endpoints
5. ✅ Check response formats
6. ✅ Read documentation for each endpoint

---

**Happy API Testing!** 🎉

**Swagger UI:** http://localhost:5000/api/docs
