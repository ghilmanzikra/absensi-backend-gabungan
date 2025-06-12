# API Documentation - Unified Backend

Complete API documentation for the Student Attendance System unified backend.

## 🌐 Base URL
```
https://absensi-backend-gabungan-production.up.railway.app
```

## 🔐 Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📋 Response Format
All responses follow this general format:
```json
{
  "message": "Description of the result",
  "data": {}, // Response data (varies by endpoint)
  "timestamp": "2025-06-05T03:44:00.493Z" // Optional
}
```

## 🚀 System Endpoints

### GET /
Get basic server information
- **Auth Required**: No
- **Response**:
```json
{
  "message": "Unified Backend Server is running! 🚀",
  "version": "1.0.0",
  "description": "Student Attendance System - Unified Backend for Siswa & Guru",
  "endpoints": {
    "auth": "/api/auth",
    "siswa": "/api/siswa", 
    "guru": "/api/guru",
    "absen": "/api/absen",
    "kelas": "/api/kelas"
  },
  "timestamp": "2025-06-05T03:44:00.493Z"
}
```

### GET /health
Health check endpoint
- **Auth Required**: No
- **Response**:
```json
{
  "status": "OK",
  "message": "Server is healthy",
  "timestamp": "2025-06-05T03:44:00.493Z",
  "uptime": 123.456
}
```

## 🔑 Authentication Endpoints

### POST /api/auth/login
Login for both students and teachers
- **Auth Required**: No

#### Login as Student (Siswa)
- **Body**:
```json
{
  "username": "siswa1",
  "password": "siswa1"
}
```
- **Success Response (200)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "siswa",
  "user": {
    "username": "siswa1",
    "role": "siswa"
  }
}
```

#### Login as Teacher (Guru)
- **Body**:
```json
{
  "username": "guru1",
  "password": "guru1"
}
```
- **Success Response (200)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "guru",
  "user": {
    "username": "guru1",
    "role": "guru"
  }
}
```

- **Error Responses**:
  - `400`: Username dan password harus diisi
  - `404`: User not found
  - `401`: Invalid password
  - `500`: Server error

### POST /api/auth/register
Register new user (admin only)
- **Auth Required**: No
- **Body**:
```json
{
  "username": "newuser",
  "password": "password123",
  "role": "siswa"
}
```
- **Success Response (201)**:
```json
{
  "message": "User berhasil dibuat",
  "user": {
    "username": "newuser",
    "role": "siswa"
  }
}
```

### GET /api/auth/test
Test authentication routes
- **Auth Required**: No
- **Response**:
```json
{
  "message": "Auth routes working!",
  "timestamp": "2025-06-05T03:44:00.493Z"
}
```

## 👨‍🎓 Student (Siswa) Endpoints

### GET /api/siswa/profile
Get student profile information
- **Auth Required**: Yes (Siswa role)
- **Success Response (200)**:
```json
{
  "message": "Profile siswa berhasil diambil",
  "profile": {
    "id": "1",
    "nama": "Aldi",
    "nis": "123456",
    "jenis_kelamin": "L",
    "alamat": null,
    "no_hp": null,
    "username": "siswa1",
    "id_kelas": 1,
    "nama_kelas": "X-IPA"
  }
}
```

### GET /api/siswa/absensi
Get student attendance history
- **Auth Required**: Yes (Siswa role)
- **Success Response (200)**:
```json
{
  "message": "Riwayat absensi berhasil diambil",
  "siswa": {
    "id": "1",
    "nama": "Aldi",
    "nis": "123456",
    "kelas": "X-IPA"
  },
  "total_records": 5,
  "absensi": [
    {
      "id": 1,
      "tanggal": "2025-06-05",
      "status": "hadir",
      "nama_kelas": "X-IPA",
      "nama_guru": "Pak Budi"
    }
  ]
}
```

### PUT /api/siswa/profile
Update student profile
- **Auth Required**: Yes (Siswa role)
- **Body**:
```json
{
  "nama": "Aldi Updated",
  "alamat": "Jl. Baru No. 123",
  "no_hp": "081234567890"
}
```
- **Success Response (200)**:
```json
{
  "message": "Profile berhasil diupdate",
  "updated_fields": ["nama", "alamat", "no_hp"]
}
```

### GET /api/siswa/list
Get all students by class (for guru/admin)
- **Auth Required**: Yes (Any role)
- **Query Parameters**: `id_kelas` (required)
- **Example**: `/api/siswa/list?id_kelas=1`
- **Success Response (200)**:
```json
{
  "message": "Data siswa berhasil diambil",
  "id_kelas": 1,
  "total_siswa": 3,
  "siswa": [
    {
      "id": "1",
      "nama": "Aldi",
      "nis": "123456",
      "jenis_kelamin": "L",
      "username": "siswa1"
    }
  ]
}
```

### GET /api/siswa/test
Test student routes
- **Auth Required**: Yes (Siswa role)
- **Response**:
```json
{
  "message": "Siswa routes working!",
  "user": {
    "id": "siswa1",
    "username": "siswa1",
    "role": "siswa"
  },
  "timestamp": "2025-06-05T03:44:00.493Z"
}
```

## 👨‍🏫 Teacher (Guru) Endpoints

### GET /api/guru/profile
Get teacher profile information
- **Auth Required**: Yes (Guru role)
- **Success Response (200)**:
```json
{
  "message": "Profile guru berhasil diambil",
  "role": "guru",
  "profile": {
    "id": "1",
    "nama": "Pak Budi",
    "nip": "123456789",
    "jenis_kelamin": "L",
    "alamat": "Jl. Guru No. 1",
    "no_hp": "081234567890",
    "username": "guru1"
  }
}
```

### PUT /api/guru/profile
Update teacher profile
- **Auth Required**: Yes (Guru role)
- **Body**:
```json
{
  "nama": "Pak Budi Updated",
  "alamat": "Jl. Guru Baru No. 123",
  "no_hp": "081234567890"
}
```
- **Success Response (200)**:
```json
{
  "message": "Profile berhasil diupdate",
  "updated_fields": ["nama", "alamat", "no_hp"]
}
```

### GET /api/guru/kelas
Get classes taught by teacher
- **Auth Required**: Yes (Guru role)
- **Query Parameters**: `guru_id` (required)
- **Example**: `/api/guru/kelas?guru_id=1`
- **Success Response (200)**:
```json
{
  "message": "Data kelas berhasil diambil",
  "guru_id": "1",
  "jumlah_kelas": 2,
  "kelas": [
    {
      "id_kelas": 1,
      "nama_kelas": "X-IPA"
    },
    {
      "id_kelas": 2,
      "nama_kelas": "X-IPS"
    }
  ]
}
```

### GET /api/guru/dashboard
Get teacher dashboard statistics
- **Auth Required**: Yes (Guru role)
- **Success Response (200)**:
```json
{
  "message": "Dashboard stats berhasil diambil",
  "guru": {
    "id": "1",
    "nama": "Pak Budi",
    "nip": "123456789"
  },
  "stats": {
    "total_kelas": 2,
    "kelas_list": [
      {
        "id_kelas": 1,
        "nama_kelas": "X-IPA"
      }
    ]
  }
}
```

### GET /api/guru/list
Get all teachers (for admin)
- **Auth Required**: Yes (Any role)
- **Success Response (200)**:
```json
{
  "message": "Data guru berhasil diambil",
  "total_guru": 1,
  "guru": [
    {
      "id": "1",
      "nama": "Pak Budi",
      "nip": "123456789",
      "jenis_kelamin": "L",
      "alamat": "Jl. Guru No. 1",
      "no_hp": "081234567890",
      "username": "guru1"
    }
  ]
}
```

### GET /api/guru/test
Test teacher routes
- **Auth Required**: Yes (Guru role)
- **Response**:
```json
{
  "message": "Guru routes working!",
  "user": {
    "id": "guru1",
    "username": "guru1",
    "role": "guru"
  },
  "timestamp": "2025-06-05T03:44:00.493Z"
}
```

## 📝 Attendance (Absen) Endpoints

### POST /api/absen/submit
Submit attendance for a class (guru only)
- **Auth Required**: Yes (Guru role)
- **Body**:
```json
{
  "id_kelas": 1,
  "tanggal": "2025-06-05",
  "guru_id": "1",
  "absensi": [
    {
      "id_siswa": "1",
      "status": "hadir"
    },
    {
      "id_siswa": "2",
      "status": "sakit"
    },
    {
      "id_siswa": "3",
      "status": "izin"
    }
  ]
}
```
- **Success Response (200)**:
```json
{
  "message": "Absen berhasil disimpan",
  "inserted": 3,
  "tanggal": "2025-06-05",
  "id_kelas": 1
}
```
- **Status Options**: `"hadir"`, `"sakit"`, `"izin"`, `"tidak ada keterangan"`

### GET /api/absen
Get attendance by class and date
- **Auth Required**: Yes (Any role)
- **Query Parameters**:
  - `id_kelas` (required)
  - `tanggal` (required, format: YYYY-MM-DD)
- **Example**: `/api/absen?id_kelas=1&tanggal=2025-06-05`
- **Success Response (200)**:
```json
{
  "message": "Data absensi berhasil diambil",
  "tanggal": "2025-06-05",
  "id_kelas": 1,
  "jumlah_siswa": 3,
  "summary": {
    "hadir": 2,
    "sakit": 1,
    "izin": 0,
    "tidak ada keterangan": 0
  },
  "data": [
    {
      "id": 1,
      "id_siswa": "1",
      "nama_siswa": "Aldi",
      "nis": "123456",
      "jenis_kelamin": "L",
      "tanggal": "2025-06-05",
      "status": "hadir",
      "nama_kelas": "X-IPA",
      "nama_guru": "Pak Budi"
    }
  ]
}
```

### GET /api/absen/stats
Get attendance statistics by class
- **Auth Required**: Yes (Any role)
- **Query Parameters**: `id_kelas` (required)
- **Example**: `/api/absen/stats?id_kelas=1`
- **Success Response (200)**:
```json
{
  "message": "Statistik absensi berhasil diambil",
  "id_kelas": 1,
  "statistics": [
    {
      "status": "hadir",
      "jumlah": 45
    },
    {
      "status": "sakit",
      "jumlah": 3
    },
    {
      "status": "izin",
      "jumlah": 2
    }
  ]
}
```

### PUT /api/absen/:id
Update attendance status
- **Auth Required**: Yes (Guru role)
- **URL Parameters**: `id` (attendance record ID)
- **Body**:
```json
{
  "status": "hadir"
}
```
- **Success Response (200)**:
```json
{
  "message": "Status absensi berhasil diupdate",
  "id": 1,
  "new_status": "hadir"
}
```

### DELETE /api/absen/:id
Delete attendance record
- **Auth Required**: Yes (Guru role)
- **URL Parameters**: `id` (attendance record ID)
- **Success Response (200)**:
```json
{
  "message": "Data absensi berhasil dihapus",
  "deleted_id": 1
}
```

### GET /api/absen/test
Test attendance routes
- **Auth Required**: Yes (Any role)
- **Response**:
```json
{
  "message": "Absen routes working!",
  "user": {
    "id": "guru1",
    "username": "guru1",
    "role": "guru"
  },
  "timestamp": "2025-06-05T03:44:00.493Z"
}
```

## 🏫 Class (Kelas) Endpoints

### GET /api/kelas/all
Get all classes with student count
- **Auth Required**: Yes (Any role)
- **Success Response (200)**:
```json
{
  "message": "Data kelas berhasil diambil",
  "total_kelas": 2,
  "kelas": [
    {
      "id_kelas": 1,
      "nama_kelas": "X-IPA",
      "guru_id": "1",
      "nama_guru": "Pak Budi",
      "jumlah_siswa": 3
    },
    {
      "id_kelas": 2,
      "nama_kelas": "X-IPS",
      "guru_id": "1",
      "nama_guru": "Pak Budi",
      "jumlah_siswa": 2
    }
  ]
}
```

### GET /api/kelas
Get classes by teacher ID
- **Auth Required**: Yes (Any role)
- **Query Parameters**: `guru_id` (required)
- **Example**: `/api/kelas?guru_id=1`
- **Success Response (200)**:
```json
{
  "message": "Data kelas berhasil diambil",
  "guru_id": "1",
  "jumlah_kelas": 2,
  "kelas": [
    {
      "id_kelas": 1,
      "nama_kelas": "X-IPA"
    },
    {
      "id_kelas": 2,
      "nama_kelas": "X-IPS"
    }
  ]
}
```

### GET /api/kelas/:id
Get class details with student list
- **Auth Required**: Yes (Any role)
- **URL Parameters**: `id` (class ID)
- **Success Response (200)**:
```json
{
  "message": "Detail kelas berhasil diambil",
  "kelas": {
    "id_kelas": 1,
    "nama_kelas": "X-IPA",
    "guru_id": "1",
    "nama_guru": "Pak Budi"
  },
  "jumlah_siswa": 3,
  "siswa": [
    {
      "id": "1",
      "nama": "Aldi",
      "nis": "123456",
      "jenis_kelamin": "L",
      "username": "siswa1"
    }
  ]
}
```

### POST /api/kelas
Create new class (guru only)
- **Auth Required**: Yes (Guru role)
- **Body**:
```json
{
  "nama_kelas": "XI-IPA",
  "guru_id": "1"
}
```
- **Success Response (201)**:
```json
{
  "message": "Kelas berhasil dibuat",
  "kelas": {
    "id_kelas": 3,
    "nama_kelas": "XI-IPA",
    "guru_id": "1"
  }
}
```

### PUT /api/kelas/:id
Update class information (guru only)
- **Auth Required**: Yes (Guru role)
- **URL Parameters**: `id` (class ID)
- **Body**:
```json
{
  "nama_kelas": "XI-IPA Updated",
  "guru_id": "2"
}
```
- **Success Response (200)**:
```json
{
  "message": "Kelas berhasil diupdate",
  "kelas": {
    "id_kelas": 3,
    "nama_kelas": "XI-IPA Updated",
    "guru_id": "2"
  }
}
```

### DELETE /api/kelas/:id
Delete class (guru only)
- **Auth Required**: Yes (Guru role)
- **URL Parameters**: `id` (class ID)
- **Success Response (200)**:
```json
{
  "message": "Kelas berhasil dihapus",
  "deleted_id": 3
}
```
- **Error Response (400)**: If class still has students
```json
{
  "message": "Tidak dapat menghapus kelas. Masih ada 5 siswa di kelas ini."
}
```

### GET /api/kelas/test-connection
Test class routes
- **Auth Required**: Yes (Any role)
- **Response**:
```json
{
  "message": "Kelas routes working!",
  "user": {
    "id": "guru1",
    "username": "guru1",
    "role": "guru"
  },
  "timestamp": "2025-06-05T03:44:00.493Z"
}
```

## 🔄 Legacy Endpoints

### GET /api/profile
Legacy profile endpoint (redirects based on role)
- **Auth Required**: Yes (Any role)
- **Behavior**:
  - If user role is `guru`: redirects to `/api/guru/profile`
  - If user role is `siswa`: redirects to `/api/siswa/profile`

### POST /api/siswa/login
Legacy student login endpoint
- **Auth Required**: No
- **Response (301)**:
```json
{
  "message": "Login endpoint has moved to /api/auth/login",
  "redirect": "/api/auth/login"
}
```

## ❌ Error Responses

### Common Error Codes
- **400 Bad Request**: Missing or invalid parameters
- **401 Unauthorized**: Invalid credentials
- **403 Forbidden**: Access denied (wrong role or missing token)
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **500 Internal Server Error**: Database or server error

### Error Response Format
```json
{
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## 📝 Request Examples

### Using curl

#### Login as Student (Siswa)
```bash
curl -X POST https://absensi-backend-gabungan-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "siswa1", "password": "siswa1"}'
```

#### Login as Teacher (Guru)
```bash
curl -X POST https://absensi-backend-gabungan-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "guru1", "password": "guru1"}'
```

#### Get Profile (with token)
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://absensi-backend-gabungan-production.up.railway.app/api/siswa/profile
```

#### Submit Attendance
```bash
curl -X POST https://absensi-backend-gabungan-production.up.railway.app/api/absen/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "id_kelas": 1,
    "tanggal": "2025-06-05",
    "guru_id": "1",
    "absensi": [
      {"id_siswa": "1", "status": "hadir"},
      {"id_siswa": "2", "status": "sakit"}
    ]
  }'
```

## 🔧 Development Notes

### Default Login Credentials

#### Teacher (Guru) Account
- **Username**: `guru1`
- **Password**: `guru1`
- **Role**: `guru`

#### Student (Siswa) Accounts
- **Username**: `siswa1`, **Password**: `siswa1`, **Role**: `siswa`
- **Username**: `siswa2`, **Password**: `siswa2`, **Role**: `siswa`
- **Username**: `siswa3`, **Password**: `siswa3`, **Role**: `siswa`

### JWT Token Structure
```json
{
  "id": "username",
  "username": "username",
  "role": "guru|siswa",
  "iat": 1625097600,
  "exp": 1625184000
}
```

### Database Tables Used
- `user`: Authentication data
- `siswa`: Student information
- `guru`: Teacher information
- `kelas`: Class information
- `absen`: Attendance records

### Environment Variables
- `PORT`: Server port (default: 5000)
- `DB_HOST`: Database host
- `DB_USER`: Database username
- `DB_PASS`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET_KEY`: JWT secret key
- `NODE_ENV`: Environment (development/production)

---

**Last Updated**: June 5, 2025
**Version**: 1.0.0
**Backend**: Unified Student Attendance System
