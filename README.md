# Unified Backend - Student Attendance System

Unified backend system that combines both student (siswa) and teacher (guru) functionalities for the attendance management system.

## 🌐 Live Production URL
```
https://absensi-backend-gabungan-production.up.railway.app
```

**Status**: ✅ **DEPLOYED & READY TO USE**

## 📱 For Frontend Developers

### Quick Start Guide
1. **Base URL**: `https://absensi-backend-gabungan-production.up.railway.app`
2. **Documentation**: See `API_DOCUMENTATION.md` for complete API reference
3. **Authentication**: Use JWT tokens in Authorization header
4. **Test Credentials**:
   - **Student**: `username: siswa1`, `password: siswa1`
   - **Teacher**: `username: guru1`, `password: guru1`

### Essential Endpoints for Mobile App
```
POST /api/auth/login          # Login (both student & teacher)
GET  /api/siswa/profile       # Student profile
GET  /api/siswa/absensi       # Student attendance history
GET  /api/guru/profile        # Teacher profile
POST /api/absen/submit        # Submit attendance (teacher)
GET  /api/absen               # Get attendance data
GET  /api/kelas/all           # Get all classes
```

### Example Integration
```javascript
// Login example for Android/React Native
const login = async (username, password) => {
  const response = await fetch('https://absensi-backend-gabungan-production.up.railway.app/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  return data; // Contains token and user info
};
```

## 🚀 Features

- **Authentication System**: Login for both students and teachers
- **Student Features**: View profile, check attendance history
- **Teacher Features**: Manage profile, submit attendance, view classes
- **Attendance Management**: Submit, view, and manage attendance records
- **Class Management**: Create, update, and manage classes
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for students and teachers

## 📁 Project Structure

```
unified-backend/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── README.md             # This file
├── config/
│   └── db.js             # Database configuration
├── controllers/
│   ├── authController.js # Authentication logic
│   ├── siswaController.js # Student-related logic
│   ├── guruController.js # Teacher-related logic
│   ├── absenController.js # Attendance logic
│   └── kelasController.js # Class management logic
├── models/
│   ├── User.js           # User model
│   ├── Siswa.js          # Student model
│   ├── Guru.js           # Teacher model
│   ├── Absen.js          # Attendance model
│   └── Kelas.js          # Class model
├── middleware/
│   └── authMiddleware.js # Authentication middleware
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── siswa.js          # Student routes
│   ├── guru.js           # Teacher routes
│   ├── absen.js          # Attendance routes
│   └── kelas.js          # Class routes
└── tools/
    └── addUser.js        # User creation utility
```

## 🛠️ Installation

1. **Clone or copy the unified-backend folder**

2. **Install dependencies**
   ```bash
   cd unified-backend
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database configuration:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=absensi_app
   JWT_SECRET_KEY=your_secret_key
   ```

4. **Setup database**
   - Make sure MySQL is running
   - Import the database schema from `UASPB2025/absensi_app.sql`
   - Or create the database manually with the required tables

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login for both students and teachers
- `POST /api/auth/register` - Register new user (admin only)

### Student Routes
- `GET /api/siswa/profile` - Get student profile
- `GET /api/siswa/absensi` - Get student attendance history
- `PUT /api/siswa/profile` - Update student profile

### Teacher Routes
- `GET /api/guru/profile` - Get teacher profile
- `PUT /api/guru/profile` - Update teacher profile
- `GET /api/guru/kelas` - Get classes taught by teacher
- `GET /api/guru/dashboard` - Get teacher dashboard stats

### Attendance Routes
- `POST /api/absen/submit` - Submit attendance (teacher only)
- `GET /api/absen` - Get attendance by class and date
- `GET /api/absen/stats` - Get attendance statistics
- `PUT /api/absen/:id` - Update attendance status
- `DELETE /api/absen/:id` - Delete attendance record

### Class Routes
- `GET /api/kelas` - Get classes by teacher
- `GET /api/kelas/all` - Get all classes
- `GET /api/kelas/:id` - Get class details
- `POST /api/kelas` - Create new class
- `PUT /api/kelas/:id` - Update class
- `DELETE /api/kelas/:id` - Delete class

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Login Example

**Production (Live Server):**
```bash
curl -X POST https://absensi-backend-gabungan-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "siswa1", "password": "siswa1"}'
```

**Local Development:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "siswa1", "password": "siswa1"}'
```

## 🗄️ Database Schema

The system uses the following main tables:
- `user` - User authentication data
- `siswa` - Student information
- `guru` - Teacher information
- `kelas` - Class information
- `absen` - Attendance records

## 🔧 Development Tools

### Add New Users
Use the provided tool to add new users:
```bash
node tools/addUser.js
```

### Environment Variables
- `PORT` - Server port (default: 5000)
- `DB_HOST` - Database host
- `DB_USER` - Database username
- `DB_PASS` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET_KEY` - JWT secret key

## 🚦 Testing

**Test Production Server:**
```bash
curl https://absensi-backend-gabungan-production.up.railway.app/health
```

**Test Local Server:**
```bash
curl http://localhost:5000/health
```

## 📝 Migration from Separate Backends

This unified backend replaces:
- `absensi-backend` (student system on port 3000)
- `UASPB2025` (teacher system on port 5000)

### Key Changes:
1. **Single Port**: Now runs on port 5000 only
2. **Unified Authentication**: Single login endpoint for both roles
3. **Role-based Routes**: Separate routes for students and teachers
4. **Improved Security**: Enhanced JWT middleware with role checking
5. **Better Error Handling**: Comprehensive error responses
6. **Logging**: Detailed request logging for debugging
