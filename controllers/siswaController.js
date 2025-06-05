// controllers/siswaController.js
const Siswa = require('../models/Siswa');
const Absen = require('../models/Absen');

const siswaController = {
  // Get siswa profile
  getProfile: (req, res) => {
    const username = req.user.username || req.user.id;
    
    console.log('📋 Getting profile for siswa:', username);

    Siswa.getProfileByUsername(username, (err, results) => {
      if (err) {
        console.error('❌ Error getting siswa profile:', err);
        return res.status(500).json({ message: 'Error getting profile' });
      }

      if (results.length === 0) {
        console.log('❌ Siswa profile not found for:', username);
        return res.status(404).json({ message: 'Profile siswa tidak ditemukan' });
      }

      console.log('✅ Siswa profile found:', results[0].nama);
      res.json({
        message: 'Profile siswa berhasil diambil',
        profile: results[0]
      });
    });
  },

  // Get siswa absensi history
  getAbsensi: (req, res) => {
    const username = req.user.username || req.user.id;
    
    console.log('📊 Getting absensi for siswa:', username);

    // First get siswa profile to get the ID
    Siswa.getProfileByUsername(username, (err, siswaResults) => {
      if (err) {
        console.error('❌ Error getting siswa profile:', err);
        return res.status(500).json({ message: 'Error getting siswa data' });
      }

      if (siswaResults.length === 0) {
        return res.status(404).json({ message: 'Siswa tidak ditemukan' });
      }

      const siswaId = siswaResults[0].id;

      // Get absensi history
      Absen.getBySiswa(siswaId, (err, absenResults) => {
        if (err) {
          console.error('❌ Error getting absensi:', err);
          return res.status(500).json({ message: 'Error getting absensi' });
        }

        console.log(`✅ Found ${absenResults.length} absensi records for siswa:`, username);
        res.json({
          message: 'Riwayat absensi berhasil diambil',
          siswa: {
            id: siswaResults[0].id,
            nama: siswaResults[0].nama,
            nis: siswaResults[0].nis,
            kelas: siswaResults[0].nama_kelas
          },
          total_records: absenResults.length,
          absensi: absenResults
        });
      });
    });
  },

  // Get all siswa (untuk admin/guru)
  getAllSiswa: (req, res) => {
    const { id_kelas } = req.query;

    if (id_kelas) {
      // Get siswa by kelas
      Siswa.getByKelas(id_kelas, (err, results) => {
        if (err) {
          console.error('❌ Error getting siswa by kelas:', err);
          return res.status(500).json({ message: 'Error getting siswa data' });
        }

        res.json({
          message: 'Data siswa berhasil diambil',
          id_kelas: parseInt(id_kelas),
          total_siswa: results.length,
          siswa: results
        });
      });
    } else {
      // This would require a new method in Siswa model to get all siswa
      res.status(400).json({ message: 'Parameter id_kelas diperlukan' });
    }
  },

  // Update siswa profile
  updateProfile: (req, res) => {
    const username = req.user.username || req.user.id;
    const { nama, alamat, no_hp } = req.body;

    console.log('✏️ Updating profile for siswa:', username);

    // First get siswa profile to get the ID
    Siswa.getProfileByUsername(username, (err, siswaResults) => {
      if (err) {
        console.error('❌ Error getting siswa profile:', err);
        return res.status(500).json({ message: 'Error getting siswa data' });
      }

      if (siswaResults.length === 0) {
        return res.status(404).json({ message: 'Siswa tidak ditemukan' });
      }

      const siswaId = siswaResults[0].id;
      const currentData = siswaResults[0];

      // Prepare update data (only update provided fields)
      const updateData = {
        nama: nama || currentData.nama,
        nis: currentData.nis, // NIS shouldn't be changed
        jenis_kelamin: currentData.jenis_kelamin, // Gender shouldn't be changed
        alamat: alamat !== undefined ? alamat : currentData.alamat,
        no_hp: no_hp !== undefined ? no_hp : currentData.no_hp,
        id_kelas: currentData.id_kelas // Class shouldn't be changed by siswa
      };

      Siswa.update(siswaId, updateData, (err, result) => {
        if (err) {
          console.error('❌ Error updating siswa profile:', err);
          return res.status(500).json({ message: 'Error updating profile' });
        }

        console.log('✅ Siswa profile updated successfully:', username);
        res.json({
          message: 'Profile berhasil diupdate',
          updated_fields: Object.keys(req.body)
        });
      });
    });
  }
};

module.exports = siswaController;
