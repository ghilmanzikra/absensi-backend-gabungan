# Migration Guide - From Separate Backends to Unified Backend

This document explains how to migrate from the separate `absensi-backend` and `UASPB2025` backends to the new unified backend system.

## 🔄 What Changed

### Before (Separate Backends)
- **absensi-backend** (Port 3000): Student attendance system
- **UASPB2025** (Port 5000): Teacher system

### After (Unified Backend)
- **unified-backend** (Port 5000): Combined system for both students and teachers

## 📋 Migration Steps

### 1. Database Setup
The unified backend uses the same database schema as `UASPB2025`. If you were using `absensi-backend`, you need to:

1. **Import the database schema**:
   ```sql
   -- Use the schema from UASPB2025/absensi_app.sql
   SOURCE path/to/UASPB2025/absensi_app.sql;
   ```

2. **Migrate existing user data** (if any):
   ```sql
   -- Update password hashing if needed
   -- The unified backend supports both plain text and bcrypt passwords
   ```

### 2. Environment Configuration
Create `.env` file in unified-backend folder:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=absensi_app
JWT_SECRET_KEY=your_secret_key
```

### 3. Frontend Changes Required

#### Authentication Endpoints
**Old endpoints:**
- Student login: `POST http://localhost:3000/api/siswa/login`
- Teacher login: `POST http://localhost:5000/api/auth/login`

**New unified endpoint:**
- Both roles: `POST http://localhost:5000/api/auth/login`

#### API Base URLs
Update all frontend API calls to use `http://localhost:5000` as the base URL.

#### Endpoint Mapping

| Old Endpoint | New Endpoint | Notes |
|--------------|--------------|-------|
| `POST /api/siswa/login` | `POST /api/auth/login` | Unified login |
| `GET /api/siswa/profile` | `GET /api/siswa/profile` | Same |
| `GET /api/siswa/absensi` | `GET /api/siswa/absensi` | Same |
| `GET /api/profile` | `GET /api/guru/profile` or `/api/siswa/profile` | Role-based |
| `POST /api/absen/submit` | `POST /api/absen/submit` | Same |
| `GET /api/absen` | `GET /api/absen` | Same |
| `GET /api/kelas` | `GET /api/kelas` | Same |

### 4. Authentication Changes

#### JWT Token Structure
The token payload now includes:
```json
{
  "id": "username",
  "username": "username", 
  "role": "guru|siswa"
}
```

#### Role-based Access
- Student routes require `role: "siswa"`
- Teacher routes require `role: "guru"`
- Some routes accept both roles

### 5. Response Format Changes

#### Login Response
**Before (separate systems):**
```json
// absensi-backend
{ "token": "..." }

// UASPB2025  
{ "message": "Login successful", "token": "...", "role": "guru", "user": {...} }
```

**After (unified):**
```json
{
  "message": "Login successful",
  "token": "...",
  "role": "guru|siswa",
  "user": {
    "username": "...",
    "role": "..."
  }
}
```

## 🧪 Testing Migration

### 1. Test Authentication
```bash
# Test student login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "siswa1", "password": "siswa1"}'

# Test teacher login  
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "guru1", "password": "guru1"}'
```

### 2. Test Protected Routes
```bash
# Get student profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/siswa/profile

# Get teacher profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/guru/profile
```

### 3. Test Legacy Compatibility
The unified backend includes legacy route redirects for backward compatibility.

## ⚠️ Breaking Changes

1. **Port Change**: Everything now runs on port 5000
2. **Login Endpoint**: Student login moved from `/api/siswa/login` to `/api/auth/login`
3. **Profile Endpoint**: `/api/profile` now redirects based on user role
4. **Error Responses**: More consistent error response format

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **JWT Token Issues**
   - Check `JWT_SECRET_KEY` in `.env`
   - Ensure token is sent in Authorization header
   - Verify token format: `Bearer <token>`

3. **Role Access Denied**
   - Check user role in database
   - Ensure correct endpoint for user role
   - Verify JWT payload includes role

### Debug Mode
Set `NODE_ENV=development` in `.env` for detailed error messages.

## 📞 Support

If you encounter issues during migration:
1. Check server logs for detailed error messages
2. Verify database schema matches expected structure
3. Test endpoints individually using curl or Postman
4. Check that all environment variables are set correctly

## 🎯 Next Steps

After successful migration:
1. Update frontend to use new unified endpoints
2. Test all functionality thoroughly
3. Update any documentation or API references
4. Consider implementing additional features available in unified backend
