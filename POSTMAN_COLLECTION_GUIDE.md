# Postman Collection Guide

## 📦 Import Instructions

### Step 1: Import Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `CMS_API_Collection.postman_collection.json`
5. Click **Import**

### Step 2: Configure Base URL
The collection uses a variable `{{base_url}}` which is set to `http://localhost:5000` by default.

To change it:
1. Click on the collection name
2. Go to **Variables** tab
3. Update `base_url` value if needed
4. Click **Save**

### Step 3: Get Authentication Token
1. Go to **Authentication** folder
2. Run **Admin Login** request
3. The token will be automatically saved to `{{auth_token}}` variable
4. All authenticated requests will use this token automatically

---

## 📋 Collection Structure

### 1. Health
- **Health Check** - Verify API is running

### 2. Authentication
- **Admin Login** - Login and get JWT token (auto-saves token)

### 3. Admin
#### Profile
- **Get Profile** - Get current admin profile
- **Update Profile** - Update name and email
- **Change Password** - Change admin password

#### CRUD Operations
- **Create Admin** - Create new admin (super_admin only)
- **Get All Admins** - List all admins with filters
- **Get Admin By ID** - Get specific admin
- **Update Admin** - Update admin details
- **Delete Admin** - Soft delete admin (super_admin only)

### 4. Content
- **Create Content (JSON)** - Create content without image
- **Create Content (Form Data)** - Create content with image upload
- **Get All Content** - List all content with filters
- **Get Content By Slug** - Get specific content
- **Update Content (Form Data)** - Update with image upload
- **Update Content (JSON)** - Update without image
- **Delete Content** - Delete content by slug

### 5. Pages
- **Create Page** - Create new static page
- **Get All Pages** - List all pages
- **Get Page By Slug** - Get specific page
- **Update Page** - Update page details
- **Delete Page** - Delete page by slug

---

## 🔑 Authentication

Most Admin endpoints require authentication:
- Token is automatically saved after login
- All authenticated requests use Bearer token from `{{auth_token}}` variable
- If token expires, run **Admin Login** again

---

## 📝 Important Notes

### Content API - Keywords Field
When using **Form Data** for content creation/update:
- Keywords can be sent as **comma-separated string**: `"blog,nodejs,tutorial"`
- Or as **JSON stringified array**: `'["blog","nodejs","tutorial"]'`
- The API will automatically convert it to an array

### Form Data vs JSON
- Use **Form Data** when uploading images
- Use **JSON** for simple requests without files
- Both formats are supported for Content endpoints

### Path Variables
Some requests use path variables like `:id` or `:slug`:
- Click on the request
- Go to **Params** tab
- Update the variable value
- Example: For "Get Content By Slug", set `slug` to `"my-blog-post"`

---

## 🧪 Testing Tips

1. **Start with Health Check** - Verify server is running
2. **Login First** - Get authentication token
3. **Test Public Endpoints** - Content and Pages (no auth needed)
4. **Test Admin Endpoints** - Requires authentication
5. **Use Collection Variables** - Update `base_url` for different environments

---

## 🔄 Environment Setup (Optional)

You can create Postman Environments for different setups:

### Development Environment
```
base_url: http://localhost:5000
auth_token: (auto-filled after login)
```

### Production Environment
```
base_url: https://your-production-url.com
auth_token: (auto-filled after login)
```

---

## 📚 Example Workflow

1. **Health Check** → Verify API is running
2. **Admin Login** → Get JWT token
3. **Get Profile** → Verify authentication works
4. **Create Content (Form Data)** → Test content creation with image
5. **Get All Content** → List created content
6. **Update Content** → Modify content
7. **Delete Content** → Remove content

---

## 🐛 Troubleshooting

### Token Not Working
- Run **Admin Login** again to refresh token
- Check if token variable `{{auth_token}}` is set in collection variables

### 401 Unauthorized
- Make sure you've logged in first
- Verify token is saved in collection variables
- Check if token has expired (default: 7 days)

### 404 Not Found
- Verify the slug/ID exists
- Check path variables are set correctly
- Ensure base_url is correct

### Form Data Issues
- Make sure Content-Type is not manually set (Postman handles it)
- For keywords, use comma-separated string: `"blog,nodejs,tutorial"`

---

## 📞 Support

For API documentation, visit:
- Swagger UI: `http://localhost:5000/api/docs`
- Health Check: `http://localhost:5000/api/health`

