# Admin Authentication & Management API Documentation

## Overview

This document provides detailed information about the Admin authentication, CRUD operations, and profile management APIs.

## Installation

First, install the required dependencies:

```bash
npm install bcryptjs jsonwebtoken
```

Or run:

```bash
npm install
```

## Environment Variables

Add the following environment variables to your `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cms-db
NODE_ENV=development
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

**Important:** Change `JWT_SECRET` to a strong, secure key in production.

---

## Authentication

### Login

**Endpoint:** `POST /api/admin/login`

**Access:** Public

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Notes:**

- Password is hashed with bcryptjs before storage
- Inactive admins (isActive = false) cannot login
- Token should be included in subsequent requests as Bearer token

---

## Admin CRUD Operations

### Create Admin

**Endpoint:** `POST /api/admins`

**Access:** Private (super_admin only)

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "role": "admin"
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-12-29T10:30:00Z",
    "updatedAt": "2024-12-29T10:30:00Z"
  }
}
```

**Validation Rules:**

- `name`: Required, minimum 2 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `role`: Optional, must be "admin" or "super_admin"

---

### Get All Admins

**Endpoint:** `GET /api/admins`

**Access:** Private

**Query Parameters:**

- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10
- `role` (optional): Filter by role ("admin" or "super_admin")
- `isActive` (optional): Filter by status ("true" or "false")

**Example Request:**

```
GET /api/admins?page=1&limit=10&role=admin&isActive=true
Authorization: Bearer <token>
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Admins retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "admin@example.com",
      "role": "super_admin",
      "isActive": true,
      "createdAt": "2024-12-29T09:00:00Z",
      "updatedAt": "2024-12-29T09:00:00Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "admin",
      "isActive": true,
      "createdAt": "2024-12-29T10:30:00Z",
      "updatedAt": "2024-12-29T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 2,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### Get Admin by ID

**Endpoint:** `GET /api/admins/:id`

**Access:** Private

**Example Request:**

```
GET /api/admins/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Admin retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "admin@example.com",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2024-12-29T09:00:00Z",
    "updatedAt": "2024-12-29T09:00:00Z"
  }
}
```

---

### Update Admin

**Endpoint:** `PUT /api/admins/:id`

**Access:** Private

**Request Body:**

```json
{
  "name": "John Doe Updated",
  "email": "johndoe@example.com",
  "role": "super_admin",
  "isActive": true
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Admin updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe Updated",
    "email": "johndoe@example.com",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2024-12-29T09:00:00Z",
    "updatedAt": "2024-12-29T11:00:00Z"
  }
}
```

**Notes:**

- Password cannot be updated through this endpoint
- Use the dedicated password change endpoint instead

---

### Delete Admin (Soft Delete)

**Endpoint:** `DELETE /api/admins/:id`

**Access:** Private (super_admin only)

**Example Request:**

```
DELETE /api/admins/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Admin deactivated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "admin",
    "isActive": false,
    "createdAt": "2024-12-29T10:30:00Z",
    "updatedAt": "2024-12-29T11:05:00Z"
  }
}
```

**Notes:**

- Soft delete sets `isActive` to false
- Admin cannot login when inactive
- Data is preserved in database

---

## Profile Management (Authenticated)

### Get Profile

**Endpoint:** `GET /api/admin/profile`

**Access:** Private (authenticated admin only)

**Example Request:**

```
GET /api/admin/profile
Authorization: Bearer <token>
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "admin@example.com",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2024-12-29T09:00:00Z",
    "updatedAt": "2024-12-29T09:00:00Z"
  }
}
```

---

### Update Profile

**Endpoint:** `PUT /api/admin/profile`

**Access:** Private (authenticated admin only)

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "newemail@example.com"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "newemail@example.com",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2024-12-29T09:00:00Z",
    "updatedAt": "2024-12-29T11:10:00Z"
  }
}
```

**Validation Rules:**

- `name`: Optional, minimum 2 characters
- `email`: Optional, valid email format, must be unique

---

### Change Password

**Endpoint:** `PUT /api/admin/profile/password`

**Access:** Private (authenticated admin only)

**Request Body:**

```json
{
  "oldPassword": "currentPassword123",
  "newPassword": "newPassword456"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Validation Rules:**

- `oldPassword`: Required, must match current password
- `newPassword`: Required, minimum 6 characters

---

## Error Handling

### Common Error Responses

**401 Unauthorized - No Token:**

```json
{
  "success": false,
  "message": "No token provided. Please login first"
}
```

**401 Unauthorized - Invalid Token:**

```json
{
  "success": false,
  "message": "Invalid token. Authentication failed"
}
```

**403 Forbidden - Insufficient Permissions:**

```json
{
  "success": false,
  "message": "Access denied. Only super_admin can perform this action"
}
```

**409 Conflict - Email Already Exists:**

```json
{
  "success": false,
  "message": "Admin with this email already exists"
}
```

**Validation Error:**

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "value": "",
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs with 10 salt rounds
2. **JWT Authentication**: Tokens expire in 7 days (configurable via JWT_EXPIRE)
3. **Email Uniqueness**: Email field has unique constraint
4. **Active Status**: Inactive admins cannot login
5. **Role-Based Access**: super_admin can create/delete admins
6. **Soft Delete**: Deleted admins are marked inactive but not removed

---

## Project Structure

```
.
├── models/
│   ├── Admin.js          # Admin model with bcrypt password hashing
│   ├── Content.js
│   └── Page.js
├── controllers/
│   ├── adminController.js
│   ├── contentController.js
│   └── pageController.js
├── middlewares/
│   ├── auth.js           # JWT authentication middleware
│   ├── adminValidation.js # Admin validation rules
│   ├── validation.js
│   ├── upload.js
│   └── errorHandler.js
├── routes/
│   ├── adminRoutes.js    # Admin authentication & management routes
│   ├── contentRoutes.js
│   └── pageRoutes.js
├── config/
│   └── db.js
├── server.js
├── .env                  # Environment variables (keep JWT_SECRET secure!)
└── package.json
```

---

## Testing with cURL

### Login

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Get All Admins

```bash
curl -X GET http://localhost:5000/api/admins \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Admin (super_admin only)

```bash
curl -X POST http://localhost:5000/api/admins \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@example.com",
    "password": "securePass123",
    "role": "admin"
  }'
```

### Get Profile

```bash
curl -X GET http://localhost:5000/api/admin/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Change Password

```bash
curl -X PUT http://localhost:5000/api/admin/profile/password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "currentPass123",
    "newPassword": "newPass456"
  }'
```

---

## Notes

- All passwords are hashed and never exposed in API responses
- Ensure `JWT_SECRET` is strong and kept secure
- Implement rate limiting in production to prevent brute force attacks
- Consider implementing admin activity logging
- Regularly audit admin accounts for security
