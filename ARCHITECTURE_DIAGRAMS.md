# Admin Authentication System - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (Postman, Web App, etc)               │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    HTTP Request (JSON)
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Router Layer                           │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  /api/admin/login                (PUBLIC)            │ │  │
│  │  │  /api/admins                     (PRIVATE)           │ │  │
│  │  │  /api/admins/:id                 (PRIVATE)           │ │  │
│  │  │  /api/admin/profile              (PRIVATE)           │ │  │
│  │  │  /api/admin/profile/password     (PRIVATE)           │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └─────────────┬──────────────────────────────────────────────┘  │
│                │                                                 │
│  ┌─────────────▼──────────────────────────────────────────────┐  │
│  │                  Middleware Layer                           │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  1. Authentication Middleware (JWT)                 │  │  │
│  │  │     - Verify Bearer token                           │  │  │
│  │  │     - Extract admin info                            │  │  │
│  │  │     - Attach to req.admin                           │  │  │
│  │  ├──────────────────────────────────────────────────────┤  │  │
│  │  │  2. Authorization Middleware (Role Check)           │  │  │
│  │  │     - Verify super_admin role                       │  │  │
│  │  │     - Return 403 if unauthorized                    │  │  │
│  │  ├──────────────────────────────────────────────────────┤  │  │
│  │  │  3. Validation Middleware (Input Check)             │  │  │
│  │  │     - Validate all request data                     │  │  │
│  │  │     - Return validation errors if invalid           │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └─────────────┬──────────────────────────────────────────────┘  │
│                │                                                 │
│  ┌─────────────▼──────────────────────────────────────────────┐  │
│  │              Controller Layer (Business Logic)              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  - login()                                           │  │  │
│  │  │  - createAdmin()                                     │  │  │
│  │  │  - getAllAdmins()                                    │  │  │
│  │  │  - getAdminById()                                    │  │  │
│  │  │  - updateAdmin()                                     │  │  │
│  │  │  - deleteAdmin()                                     │  │  │
│  │  │  - getProfile()                                      │  │  │
│  │  │  - updateProfile()                                   │  │  │
│  │  │  - changePassword()                                  │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └─────────────┬──────────────────────────────────────────────┘  │
│                │                                                 │
│  ┌─────────────▼──────────────────────────────────────────────┐  │
│  │                  Model Layer (Data Access)                  │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Admin Model (Mongoose)                             │  │  │
│  │  │  - name                                             │  │  │
│  │  │  - email (unique)                                   │  │  │
│  │  │  - password (hashed with bcryptjs)                  │  │  │
│  │  │  - role (enum: admin, super_admin)                  │  │  │
│  │  │  - isActive (boolean)                               │  │  │
│  │  │  - timestamps (createdAt, updatedAt)                │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └─────────────┬──────────────────────────────────────────────┘  │
│                │                                                 │
└────────────────┼─────────────────────────────────────────────────┘
                 │
                 │ MongoDB Queries
                 │
                 ▼
         ┌───────────────┐
         │   MONGODB     │
         │  (admins)     │
         └───────────────┘
```

---

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        LOGIN FLOW                                 │
└──────────────────────────────────────────────────────────────────┘

Client                    Server                      Database
  │                         │                            │
  │  1. POST /admin/login    │                            │
  │     {email, password}    │                            │
  ├────────────────────────►│                            │
  │                         │  2. Find admin by email     │
  │                         ├───────────────────────────►│
  │                         │◄────────────────────────────┤
  │                         │     admin document          │
  │                         │                            │
  │                         │  3. Compare passwords       │
  │                         │     (bcrypt.compare)        │
  │                         │                            │
  │                         │  4. Generate JWT token      │
  │                         │     (jsonwebtoken)          │
  │                         │                            │
  │  5. Return token        │                            │
  │◄────────────────────────┤                            │
  │  {token, admin}         │                            │
  │                         │                            │


┌──────────────────────────────────────────────────────────────────┐
│                   PROTECTED ROUTE FLOW                            │
└──────────────────────────────────────────────────────────────────┘

Client                    Server                      Database
  │                         │                            │
  │  1. GET /api/admins     │                            │
  │     Headers: {          │                            │
  │       Authorization:    │                            │
  │       "Bearer TOKEN"    │                            │
  │     }                   │                            │
  ├────────────────────────►│                            │
  │                         │  2. Extract token from     │
  │                         │     Authorization header   │
  │                         │                            │
  │                         │  3. Verify JWT signature   │
  │                         │     (jsonwebtoken)         │
  │                         │                            │
  │                         │  4. Check if token expired │
  │                         │                            │
  │                         │  5. Extract admin info     │
  │                         │     (req.admin = decoded)  │
  │                         │                            │
  │                         │  6. Verify admin is active │
  │                         ├───────────────────────────►│
  │                         │     (if required)          │
  │                         │◄────────────────────────────┤
  │                         │                            │
  │                         │  7. Execute controller     │
  │                         │     (getAllAdmins)         │
  │                         ├───────────────────────────►│
  │                         │     Query: find all admins │
  │                         │◄────────────────────────────┤
  │                         │     [admins array]         │
  │                         │                            │
  │  8. Return admins       │                            │
  │◄────────────────────────┤                            │
  │  {success, data, ...}   │                            │
```

---

## Password Hashing Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    PASSWORD HASHING FLOW                          │
└──────────────────────────────────────────────────────────────────┘

User Input: "myPassword123"

    │
    ▼
┌──────────────────────────────────────────────────┐
│  bcryptjs.genSalt(10)                            │
│  - Generate random salt with 10 rounds           │
│  - Result: salt = "$2a$10$abc123xyz..."          │
└──────────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────────┐
│  bcryptjs.hash(password, salt)                   │
│  - Hash password with salt                       │
│  - Result: hash = "$2a$10$abc123xyz...def456..."  │
└──────────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────────┐
│  Store hash in database (NOT original password)  │
│  password: "$2a$10$abc123xyz...def456..."        │
└──────────────────────────────────────────────────┘

Later during login:

User Input: "myPassword123"

    │
    ▼
┌──────────────────────────────────────────────────┐
│  bcryptjs.compare(inputPassword, storedHash)     │
│  - Compare input with stored hash                │
│  - Returns: true or false                        │
└──────────────────────────────────────────────────┘
    │
    ▼
If true → Authentication Successful → Generate JWT Token
If false → Authentication Failed → Return 401 Unauthorized
```

---

## Request/Response Flow for Create Admin

```
┌──────────────────────────────────────────────────────────────────┐
│                   CREATE ADMIN SEQUENCE                           │
└──────────────────────────────────────────────────────────────────┘

Client Request:
  POST /api/admins
  Headers: {
    "Authorization": "Bearer eyJhbGc...",
    "Content-Type": "application/json"
  }
  Body: {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "admin"
  }

    │
    ▼
┌──────────────────────────────────────────────────┐
│  1. authenticate middleware                       │
│  - Check Authorization header                     │
│  - Verify JWT token                              │
│  - Extract admin info → req.admin                │
└──────────────────────────────────────────────────┘
    │ ✓ Token valid
    ▼
┌──────────────────────────────────────────────────┐
│  2. authorizeSuper middleware                     │
│  - Check req.admin.role === "super_admin"        │
│  - Return 403 if not super_admin                 │
└──────────────────────────────────────────────────┘
    │ ✓ Is super_admin
    ▼
┌──────────────────────────────────────────────────┐
│  3. validateCreateAdmin rules                     │
│  - Validate name (min 2 chars)                   │
│  - Validate email format                         │
│  - Validate password (min 6 chars)               │
│  - Validate role (admin/super_admin)             │
└──────────────────────────────────────────────────┘
    │ ✓ All valid
    ▼
┌──────────────────────────────────────────────────┐
│  4. createAdmin controller                        │
│  - Check for validation errors                    │
│  - Check email not already used                   │
│  - Create new Admin document                      │
└──────────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────────┐
│  5. Admin.pre('save') middleware                  │
│  - Detect password is new (isModified)            │
│  - Generate salt: bcryptjs.genSalt(10)            │
│  - Hash password: bcryptjs.hash(pwd, salt)        │
│  - Replace password with hash                     │
└──────────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────────┐
│  6. Save to MongoDB                              │
│  - Insert admin document with hashed password    │
│  - Set timestamps (createdAt, updatedAt)         │
└──────────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────────┐
│  7. toJSON() method                              │
│  - Remove password field from response            │
│  - Return only: id, name, email, role, etc      │
└──────────────────────────────────────────────────┘
    │
    ▼
Server Response (201 Created):
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

---

## Database Schema Diagram

```
┌─────────────────────────────────────────────────────┐
│                   ADMINS COLLECTION                  │
├─────────────────────────────────────────────────────┤
│ Field           │ Type      │ Constraints           │
├─────────────────┼───────────┼───────────────────────┤
│ _id             │ ObjectId  │ Primary Key (auto)    │
│ name            │ String    │ Required, min: 2      │
│ email           │ String    │ Required, Unique, LC  │
│ password        │ String    │ Required, Hashed      │
│ role            │ Enum      │ admin/super_admin     │
│ isActive        │ Boolean   │ Default: true         │
│ createdAt       │ Date      │ Auto, Immutable       │
│ updatedAt       │ Date      │ Auto, Mutable         │
├─────────────────┼───────────┼───────────────────────┤
│ Indexes         │           │                       │
├─────────────────┼───────────┼───────────────────────┤
│ email           │ Unique    │ Fast email lookups    │
│ role + isActive │ Compound  │ Filter optimization   │
└─────────────────────────────────────────────────────┘

Example Document:
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "admin@example.com",
  "password": "$2a$10$K1.H3R1mcQ8xDJ...", (hashed)
  "role": "super_admin",
  "isActive": true,
  "createdAt": ISODate("2024-12-29T09:00:00Z"),
  "updatedAt": ISODate("2024-12-29T09:00:00Z")
}
```

---

## JWT Token Structure

```
┌──────────────────────────────────────────────────────┐
│              JWT TOKEN STRUCTURE                      │
└──────────────────────────────────────────────────────┘

Token Format: Header.Payload.Signature

HEADER:
{
  "alg": "HS256",
  "typ": "JWT"
}

PAYLOAD (Decoded):
{
  "id": "507f1f77bcf86cd799439011",
  "email": "admin@example.com",
  "role": "super_admin",
  "iat": 1704088800,      (issued at timestamp)
  "exp": 1704693600       (expiration timestamp - 7 days)
}

SIGNATURE:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)

Complete Token Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoic3VwZXJfYWRtaW4iLCJpYXQiOjE3MDQwODg4MDAsImV4cCI6MTcwNDY5MzYwMH0.
h3LmAZRBD7kxN2qL9vP8mK1jF5gN8xR2cQ6yT9sP1w8
```

---

## Error Handling Flow

```
┌──────────────────────────────────────────────────────┐
│            ERROR HANDLING FLOW                         │
└──────────────────────────────────────────────────────┘

Request                  Error Check                 Response
   │                          │
   ├──────────────────────────►│
   │                           │
   │                    1. No token?
   │                           ├──► 401 Unauthorized
   │                           │    "No token provided"
   │                           │
   │                    2. Invalid token?
   │                           ├──► 401 Unauthorized
   │                           │    "Invalid token"
   │                           │
   │                    3. Token expired?
   │                           ├──► 401 Unauthorized
   │                           │    "Token has expired"
   │                           │
   │                    4. Not super_admin?
   │                           ├──► 403 Forbidden
   │                           │    "Access denied"
   │                           │
   │                    5. Validation failed?
   │                           ├──► 400 Bad Request
   │                           │    "Validation errors"
   │                           │    [error details]
   │                           │
   │                    6. Email exists?
   │                           ├──► 409 Conflict
   │                           │    "Email already exists"
   │                           │
   │                    7. Not found?
   │                           ├──► 404 Not Found
   │                           │    "Admin not found"
   │                           │
   │                    8. Server error?
   │                           ├──► 500 Server Error
   │                           │    "Error message"
   │                           │
   ◄───────────────────────────┘
```

---

## Role-Based Access Control (RBAC)

```
┌────────────────────────────────────────────────────┐
│          ROLE-BASED ACCESS CONTROL                  │
├────────────────────────────────────────────────────┤
│ Endpoint           │ super_admin │ admin │ public │
├────────────────────┼─────────────┼───────┼────────┤
│ POST /admin/login  │     ✓       │   ✓   │   ✓    │
│ POST /admins       │     ✓       │   ✗   │   ✗    │
│ GET /admins        │     ✓       │   ✓   │   ✗    │
│ GET /admins/:id    │     ✓       │   ✓   │   ✗    │
│ PUT /admins/:id    │     ✓       │   ✓   │   ✗    │
│ DELETE /admins/:id │     ✓       │   ✗   │   ✗    │
│ GET /admin/profile │     ✓       │   ✓   │   ✗    │
│ PUT /admin/profile │     ✓       │   ✓   │   ✗    │
│ PUT /profile/pwd   │     ✓       │   ✓   │   ✗    │
└────────────────────┴─────────────┴───────┴────────┘

Legend:
✓ = Allowed
✗ = Denied (returns 403 Forbidden)
```

---

## File Dependency Graph

```
server.js
├── /models/Admin.js
│   ├── mongoose
│   ├── bcryptjs
│   └── Methods:
│       ├── comparePassword()
│       └── toJSON()
│
├── /middlewares/auth.js
│   ├── jsonwebtoken
│   └── Functions:
│       ├── authenticate
│       └── authorizeSuper
│
├── /middlewares/adminValidation.js
│   ├── express-validator
│   └── Rules:
│       ├── validateAdminLogin
│       ├── validateCreateAdmin
│       ├── validateUpdateAdmin
│       ├── validateUpdateProfile
│       └── validateChangePassword
│
├── /controllers/adminController.js
│   ├── /models/Admin
│   ├── jsonwebtoken
│   ├── express-validator
│   └── Functions:
│       ├── login()
│       ├── createAdmin()
│       ├── getAllAdmins()
│       ├── getAdminById()
│       ├── updateAdmin()
│       ├── deleteAdmin()
│       ├── getProfile()
│       ├── updateProfile()
│       └── changePassword()
│
├── /routes/adminRoutes.js
│   ├── express
│   ├── /controllers/adminController
│   ├── /middlewares/auth
│   └── /middlewares/adminValidation
│
├── /middlewares/errorHandler.js (existing)
├── package.json (updated with dependencies)
└── .env (requires JWT_SECRET)
```

---

## Data Flow Summary

```
┌──────────────────────────────────────────────────────┐
│                 DATA FLOW SUMMARY                     │
└──────────────────────────────────────────────────────┘

Input (User)
    │
    ▼
Request Validation
├─ Format check
├─ Type check
└─ Business rule check
    │
    ▼
Authentication (if required)
├─ JWT verification
└─ Token expiration check
    │
    ▼
Authorization (if required)
├─ Role check
└─ Permission check
    │
    ▼
Controller Logic
├─ Database queries
├─ Data transformation
└─ Password hashing (if needed)
    │
    ▼
Database Operation
├─ Create
├─ Read
├─ Update
└─ Delete
    │
    ▼
Response Formatting
├─ Remove sensitive data (passwords)
├─ Add metadata
└─ Format JSON
    │
    ▼
HTTP Response
└─ Client (success or error)
```

---

This document provides comprehensive visual representations of the admin authentication system architecture and flows.
