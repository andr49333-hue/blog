# Admin API - Quick Reference Guide

## Setup

1. Install dependencies:

```bash
npm install
```

2. Ensure `.env` contains:

```env
JWT_SECRET=your-strong-secret-key-here
JWT_EXPIRE=7d
```

3. Start server:

```bash
npm run dev
```

---

## Quick Examples

### 1. Login and Get Token

```bash
# Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Response includes: token, admin.id, admin.name, admin.email, admin.role
```

Save the token:

```bash
TOKEN="your-token-from-response"
```

### 2. Admin CRUD Operations

**Create Admin (super_admin only):**

```bash
curl -X POST http://localhost:5000/api/admins \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

**Get All Admins:**

```bash
# All admins
curl -X GET http://localhost:5000/api/admins \
  -H "Authorization: Bearer $TOKEN"

# With filters
curl -X GET "http://localhost:5000/api/admins?page=1&limit=10&role=admin&isActive=true" \
  -H "Authorization: Bearer $TOKEN"
```

**Get Admin by ID:**

```bash
curl -X GET http://localhost:5000/api/admins/ADMIN_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Update Admin:**

```bash
curl -X PUT http://localhost:5000/api/admins/ADMIN_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "super_admin",
    "isActive": true
  }'
```

**Delete Admin (super_admin only):**

```bash
curl -X DELETE http://localhost:5000/api/admins/ADMIN_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Profile Management

**Get Your Profile:**

```bash
curl -X GET http://localhost:5000/api/admin/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Update Your Profile:**

```bash
curl -X PUT http://localhost:5000/api/admin/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your New Name",
    "email": "newemail@example.com"
  }'
```

**Change Your Password:**

```bash
curl -X PUT http://localhost:5000/api/admin/profile/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "currentPassword123",
    "newPassword": "newPassword456"
  }'
```

---

## API Endpoints Summary

| Method | Endpoint                      | Access                | Description             |
| ------ | ----------------------------- | --------------------- | ----------------------- |
| POST   | `/api/admin/login`            | Public                | Login and get JWT token |
| POST   | `/api/admins`                 | Private (super_admin) | Create new admin        |
| GET    | `/api/admins`                 | Private               | List all admins         |
| GET    | `/api/admins/:id`             | Private               | Get admin by ID         |
| PUT    | `/api/admins/:id`             | Private               | Update admin            |
| DELETE | `/api/admins/:id`             | Private (super_admin) | Delete admin            |
| GET    | `/api/admin/profile`          | Private               | Get your profile        |
| PUT    | `/api/admin/profile`          | Private               | Update your profile     |
| PUT    | `/api/admin/profile/password` | Private               | Change your password    |

---

## Response Format

All responses follow this format:

**Success:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* ... */
  },
  "pagination": {
    /* optional */
  }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    /* optional validation errors */
  ]
}
```

---

## Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (email already exists)
- `500` - Server Error

---

## Authentication

Every protected endpoint requires:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Token expires in 7 days by default. After expiration, user must login again to get a new token.

---

## Important Notes

1. **Passwords are hashed** - Never visible in responses
2. **Email is unique** - Cannot have two admins with same email
3. **Soft delete** - Deleted admins are marked inactive, not removed
4. **Role-based access** - Only super_admin can create/delete admins
5. **JWT Secret** - Keep it secure! Change in production
6. **Inactive admins** - Cannot login even with correct password

---

## Troubleshooting

**"No token provided":**

- Add `Authorization: Bearer TOKEN` header

**"Invalid token":**

- Token may be expired or corrupted
- Login again to get new token

**"Access denied":**

- You don't have permission
- Only super_admin can create/delete admins

**"Email already in use":**

- Email already registered to another admin
- Use different email

**"Admin not found":**

- Invalid admin ID
- Check the ID is correct
