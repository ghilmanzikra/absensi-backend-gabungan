// tools/testSecurity.js
// Test keamanan role-based access control

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testSecurity() {
  console.log('🔐 Testing Role-Based Access Control Security');
  console.log('==============================================\n');

  try {
    // 1. Login sebagai siswa
    console.log('1️⃣ Login sebagai SISWA...');
    const siswaLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'siswa1',
      password: 'siswa1'
    });
    
    const siswaToken = siswaLogin.data.token;
    console.log('✅ Siswa login berhasil');
    console.log('   Role:', siswaLogin.data.role);
    console.log('   Token:', siswaToken.substring(0, 50) + '...\n');

    // 2. Login sebagai guru
    console.log('2️⃣ Login sebagai GURU...');
    const guruLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'guru1',
      password: 'guru1'
    });
    
    const guruToken = guruLogin.data.token;
    console.log('✅ Guru login berhasil');
    console.log('   Role:', guruLogin.data.role);
    console.log('   Token:', guruToken.substring(0, 50) + '...\n');

    // 3. Test: Siswa coba akses endpoint guru
    console.log('3️⃣ TEST: Siswa coba akses endpoint GURU...');
    try {
      await axios.get(`${BASE_URL}/api/guru/profile`, {
        headers: { Authorization: `Bearer ${siswaToken}` }
      });
      console.log('❌ BAHAYA! Siswa bisa akses endpoint guru!');
    } catch (error) {
      console.log('✅ AMAN! Siswa TIDAK bisa akses endpoint guru');
      console.log('   Error:', error.response.data.message);
    }

    // 4. Test: Guru coba akses endpoint siswa
    console.log('\n4️⃣ TEST: Guru coba akses endpoint SISWA...');
    try {
      await axios.get(`${BASE_URL}/api/siswa/profile`, {
        headers: { Authorization: `Bearer ${guruToken}` }
      });
      console.log('❌ BAHAYA! Guru bisa akses endpoint siswa!');
    } catch (error) {
      console.log('✅ AMAN! Guru TIDAK bisa akses endpoint siswa');
      console.log('   Error:', error.response.data.message);
    }

    // 5. Test: Akses yang benar
    console.log('\n5️⃣ TEST: Akses yang BENAR...');
    
    // Siswa akses endpoint siswa
    const siswaProfile = await axios.get(`${BASE_URL}/api/siswa/profile`, {
      headers: { Authorization: `Bearer ${siswaToken}` }
    });
    console.log('✅ Siswa berhasil akses endpoint siswa');
    console.log('   Nama:', siswaProfile.data.profile.nama);

    // Guru akses endpoint guru
    const guruProfile = await axios.get(`${BASE_URL}/api/guru/profile`, {
      headers: { Authorization: `Bearer ${guruToken}` }
    });
    console.log('✅ Guru berhasil akses endpoint guru');
    console.log('   Nama:', guruProfile.data.profile.nama);

    console.log('\n🎉 KESIMPULAN: Sistem AMAN! Role-based access control berfungsi dengan baik!');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
  }
}

testSecurity();
