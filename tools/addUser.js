// tools/addUser.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Configuration - Edit these values as needed
const users = [
  {
    username: 'siswa123',
    password: 'password123',
    role: 'siswa'
  },
  {
    username: 'guru123',
    password: 'password123',
    role: 'guru'
  }
];

async function addUsers() {
  console.log('🔧 Starting user creation process...');
  
  for (const user of users) {
    try {
      console.log(`\n➕ Creating user: ${user.username} (${user.role})`);
      
      // Check if user already exists
      const checkSql = 'SELECT username FROM user WHERE username = ?';
      const existingUser = await queryPromise(checkSql, [user.username]);
      
      if (existingUser.length > 0) {
        console.log(`⚠️  User ${user.username} already exists, skipping...`);
        continue;
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      console.log(`🔐 Password hashed for ${user.username}`);
      
      // Insert user
      const insertSql = 'INSERT INTO user (username, password, role) VALUES (?, ?, ?)';
      const result = await queryPromise(insertSql, [user.username, hashedPassword, user.role]);
      
      console.log(`✅ User ${user.username} created successfully!`);
      
    } catch (error) {
      console.error(`❌ Error creating user ${user.username}:`, error.message);
    }
  }
  
  console.log('\n🎉 User creation process completed!');
  process.exit(0);
}

// Helper function to promisify database queries
function queryPromise(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Process interrupted');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the script
console.log('🚀 User Creation Tool - Unified Backend');
console.log('=====================================');
addUsers();
