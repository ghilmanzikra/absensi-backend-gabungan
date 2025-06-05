// controllers/guruController.js
const Guru = require('../models/Guru');
const Kelas = require('../models/Kelas');

const guruController = {
  // Get guru profile
  getProfile: (req, res) => {
    const username = req.user.username || req.user.id;
    
    console.log('📋 Getting profile for guru:', username);

    Guru.getProfileByUsername(username, (err, results) => {
      if (err) {
        console.error('❌ Error getting guru profile:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
        console.log('❌ Guru profile not found for:', username);
        return res.status(404).json({ message: 'Profil guru tidak ditemukan' });
      }

      console.log('✅ Guru profile found:', results[0].nama);
      res.json({
        message: 'Profile guru berhasil diambil',
        role: 'guru',
        profile: results[0]
      });
    });
  },

  // Get kelas yang diajar oleh guru
  getKelas: (req, res) => {
    const { guru_id } = req.query;
    const username = req.user.username || req.user.id;

    console.log('📚 Getting kelas for guru:', username, 'guru_id:', guru_id);

    if (!guru_id) {
      console.warn('❌ Parameter guru_id tidak ditemukan');
      return res.status(400).json({ message: 'Parameter guru_id dibutuhkan' });
    }

    Kelas.getByGuru(guru_id, (err, result) => {
      if (err) {
        console.error('❌ Query error saat mengambil data kelas:', err);
        return res.status(500).json({ message: 'Gagal ambil data kelas' });
      }

      console.log(`✅ ${result.length} kelas ditemukan untuk guru_id: ${guru_id}`);
      res.json({ 
        message: 'Data kelas berhasil diambil',
        guru_id, 
        jumlah_kelas: result.length, 
        kelas: result 
      });
    });
  },

  // Get all guru (untuk admin)
  getAllGuru: (req, res) => {
    console.log('👥 Getting all guru data');

    Guru.getAll((err, results) => {
      if (err) {
        console.error('❌ Error getting all guru:', err);
        return res.status(500).json({ message: 'Error getting guru data' });
      }

      console.log(`✅ Found ${results.length} guru records`);
      res.json({
        message: 'Data guru berhasil diambil',
        total_guru: results.length,
        guru: results
      });
    });
  },

  // Update guru profile
  updateProfile: (req, res) => {
    const username = req.user.username || req.user.id;
    const { nama, alamat, no_hp } = req.body;

    console.log('✏️ Updating profile for guru:', username);

    // First get guru profile to get the ID
    Guru.getProfileByUsername(username, (err, guruResults) => {
      if (err) {
        console.error('❌ Error getting guru profile:', err);
        return res.status(500).json({ message: 'Error getting guru data' });
      }

      if (guruResults.length === 0) {
        return res.status(404).json({ message: 'Guru tidak ditemukan' });
      }

      const guruId = guruResults[0].id;
      const currentData = guruResults[0];

      // Prepare update data (only update provided fields)
      const updateData = {
        nama: nama || currentData.nama,
        nip: currentData.nip, // NIP shouldn't be changed
        jenis_kelamin: currentData.jenis_kelamin, // Gender shouldn't be changed
        alamat: alamat !== undefined ? alamat : currentData.alamat,
        no_hp: no_hp !== undefined ? no_hp : currentData.no_hp
      };

      Guru.update(guruId, updateData, (err, result) => {
        if (err) {
          console.error('❌ Error updating guru profile:', err);
          return res.status(500).json({ message: 'Error updating profile' });
        }

        console.log('✅ Guru profile updated successfully:', username);
        res.json({
          message: 'Profile berhasil diupdate',
          updated_fields: Object.keys(req.body)
        });
      });
    });
  },

  // Get guru dashboard stats
  getDashboardStats: (req, res) => {
    const username = req.user.username || req.user.id;

    console.log('📊 Getting dashboard stats for guru:', username);

    // First get guru profile to get the ID
    Guru.getProfileByUsername(username, (err, guruResults) => {
      if (err) {
        console.error('❌ Error getting guru profile:', err);
        return res.status(500).json({ message: 'Error getting guru data' });
      }

      if (guruResults.length === 0) {
        return res.status(404).json({ message: 'Guru tidak ditemukan' });
      }

      const guruId = guruResults[0].id;

      // Get kelas count
      Kelas.getByGuru(guruId, (err, kelasResults) => {
        if (err) {
          console.error('❌ Error getting kelas data:', err);
          return res.status(500).json({ message: 'Error getting dashboard data' });
        }

        res.json({
          message: 'Dashboard stats berhasil diambil',
          guru: {
            id: guruResults[0].id,
            nama: guruResults[0].nama,
            nip: guruResults[0].nip
          },
          stats: {
            total_kelas: kelasResults.length,
            kelas_list: kelasResults
          }
        });
      });
    });
  }
};

module.exports = guruController;
