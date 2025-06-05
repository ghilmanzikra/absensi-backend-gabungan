// tools/decodeJWT.js
// Simple JWT decoder for testing purposes

const jwt = require('jsonwebtoken');

// Token siswa dari test sebelumnya
const siswaToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNpc3dhMSIsInVzZXJuYW1lIjoic2lzd2ExIiwicm9sZSI6InNpc3dhIiwiaWF0IjoxNzQ5MDk4NTAxLCJleHAiOjE3NDkxODQ5MDF9.vcDywH7HC9oMvF_4Aza0Kn5YbGxiOcGaKXFWgNNP5Tk";

console.log('🔍 Decoding Siswa Token:');
console.log('========================');

try {
  // Decode without verification (just to see payload)
  const decoded = jwt.decode(siswaToken);
  console.log('Payload:', JSON.stringify(decoded, null, 2));
  
  console.log('\n📋 Token Details:');
  console.log('- Username:', decoded.username);
  console.log('- Role:', decoded.role);
  console.log('- Issued At:', new Date(decoded.iat * 1000));
  console.log('- Expires At:', new Date(decoded.exp * 1000));
  
} catch (error) {
  console.error('❌ Error decoding token:', error.message);
}
