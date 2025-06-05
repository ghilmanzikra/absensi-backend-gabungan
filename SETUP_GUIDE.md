# Setup Guide - Unified Backend

Complete setup guide for the Student Attendance System unified backend.

## 📋 Prerequisites

### Required Software
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** (comes with Node.js)

### Optional Tools
- **Postman** (for API testing)
- **MySQL Workbench** (for database management)
- **Git** (for version control)

## 🚀 Quick Start

### 1. Database Setup

#### Create Database
```sql
CREATE DATABASE absensi_app;
USE absensi_app;
```

#### Import Database Schema
Use the provided SQL file from the original UASPB2025 project:
```bash
mysql -u root -p absensi_app < path/to/UASPB2025/absensi_app.sql
```

Or manually create tables:
```sql
-- User table for authentication
CREATE TABLE `user` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('guru','siswa') NOT NULL,
  PRIMARY KEY (`username`)
);

-- Guru table
CREATE TABLE `guru` (
  `id` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `nip` varchar(20) NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `alamat` text,
  `no_hp` varchar(20),
  `username` varchar(50),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nip` (`nip`),
  UNIQUE KEY `username` (`username`)
);

-- Kelas table
CREATE TABLE `kelas` (
  `id_kelas` int(11) NOT NULL AUTO_INCREMENT,
  `nama_kelas` varchar(50) NOT NULL,
  `guru_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id_kelas`),
  KEY `fk_kelas_guru` (`guru_id`),
  FOREIGN KEY (`guru_id`) REFERENCES `guru` (`id`)
);

-- Siswa table
CREATE TABLE `siswa` (
  `id` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `nis` varchar(20) NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `alamat` text,
  `no_hp` varchar(20),
  `id_kelas` int(11),
  `username` varchar(50),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nis` (`nis`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_siswa_kelas` (`id_kelas`),
  FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id_kelas`)
);

-- Absen table
CREATE TABLE `absen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_siswa` varchar(50) NOT NULL,
  `id_kelas` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `status` enum('hadir','sakit','izin','tidak ada keterangan') NOT NULL,
  `guru_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_siswa` (`id_siswa`),
  KEY `id_kelas` (`id_kelas`),
  KEY `fk_absen_guru` (`guru_id`),
  FOREIGN KEY (`id_siswa`) REFERENCES `siswa` (`id`),
  FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id_kelas`),
  FOREIGN KEY (`guru_id`) REFERENCES `guru` (`id`)
);
```

#### Insert Sample Data
```sql
-- Insert sample users
INSERT INTO `user` (`username`, `password`, `role`) VALUES
('guru1', 'guru1', 'guru'),
('siswa1', 'siswa1', 'siswa'),
('siswa2', 'siswa2', 'siswa'),
('siswa3', 'siswa3', 'siswa');

-- Insert sample guru
INSERT INTO `guru` (`id`, `nama`, `nip`, `jenis_kelamin`, `alamat`, `no_hp`, `username`) VALUES
('1', 'Pak Budi', '123456789', 'L', 'Jl. Guru No. 1', '081234567890', 'guru1');

-- Insert sample kelas
INSERT INTO `kelas` (`id_kelas`, `nama_kelas`, `guru_id`) VALUES
(1, 'X-IPA', '1');

-- Insert sample siswa
INSERT INTO `siswa` (`id`, `nama`, `nis`, `jenis_kelamin`, `alamat`, `no_hp`, `id_kelas`, `username`) VALUES
('1', 'Aldi', '123456', 'L', NULL, NULL, 1, 'siswa1'),
('2', 'Yanto', '123455', 'L', NULL, NULL, 1, 'siswa2'),
('3', 'Ratna', '123555', 'P', NULL, NULL, 1, 'siswa3');
```

### 2. Backend Setup

#### Clone/Copy Project
```bash
# If using git
git clone <repository-url>
cd unified-backend

# Or copy the unified-backend folder to your desired location
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=absensi_app

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_SECRET=your_super_secret_jwt_key_here
```

#### Start the Server
```bash
# Development mode (with auto-restart)
npm start

# Or production mode
npm run prod
```

### 3. Verify Installation

#### Check Server Status
Open browser and go to: `http://localhost:5000`

You should see:
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
  }
}
```

#### Test Database Connection
Check server logs for:
```
✅ Connected to database successfully!
```

If you see database connection error, verify:
- MySQL is running
- Database credentials in `.env` are correct
- Database `absensi_app` exists

#### Test Authentication
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "siswa1", "password": "siswa1"}'
```

Expected response:
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

## 🔧 Advanced Configuration

### Custom Port
Change port in `.env`:
```env
PORT=3000
```

### Production Setup
```env
NODE_ENV=production
```

### SSL/HTTPS (Optional)
For production, consider using:
- Nginx as reverse proxy
- Let's Encrypt for SSL certificates
- PM2 for process management

### Database Optimization
For production:
- Use connection pooling
- Set up database backups
- Configure proper indexes
- Monitor query performance

## 🧪 Testing Setup

### Using Postman
1. Import `POSTMAN_COLLECTION.json`
2. Set environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `authToken`: (will be set automatically after login)

### Using curl
See examples in `API_DOCUMENTATION.md`

### Automated Testing
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests (if implemented)
npm test
```

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <process_id> /F

# Or use different port in .env
PORT=3001
```

#### Database Connection Failed
1. Check MySQL service is running
2. Verify credentials in `.env`
3. Test connection manually:
```bash
mysql -u root -p -h localhost
```

#### JWT Token Issues
1. Check `JWT_SECRET_KEY` in `.env`
2. Ensure token is included in requests:
```
Authorization: Bearer <token>
```

#### CORS Issues (Frontend Integration)
Add CORS configuration in `app.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

### Debug Mode
Set environment for detailed logging:
```env
NODE_ENV=development
DEBUG=*
```

### Log Files
Server logs are displayed in console. For production, consider:
- Winston for structured logging
- Log rotation
- Error tracking (Sentry, etc.)

## 📞 Support

### Getting Help
1. Check server console for error messages
2. Verify all environment variables are set
3. Test database connection separately
4. Use Postman collection for API testing
5. Check `API_DOCUMENTATION.md` for endpoint details

### Common Commands
```bash
# Restart server
npm start

# Check dependencies
npm list

# Update dependencies
npm update

# Clear npm cache
npm cache clean --force
```

---

**Setup Complete!** 🎉

Your unified backend should now be running successfully. Proceed to integrate with your frontend application using the API endpoints documented in `API_DOCUMENTATION.md`.
