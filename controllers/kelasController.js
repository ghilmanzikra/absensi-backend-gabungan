// controllers/kelasController.js
const Kelas = require('../models/Kelas');
const Siswa = require('../models/Siswa');

const kelasController = {
  // Get all kelas
  getAllKelas: (req, res) => {
    console.log('📚 Getting all kelas data');

    Kelas.getWithSiswaCount((err, result) => {
      if (err) {
        console.error('❌ Error getting all kelas:', err);
        return res.status(500).json({ message: 'Gagal mengambil data kelas' });
      }

      console.log(`✅ Found ${result.length} kelas records`);
      res.json({
        message: 'Data kelas berhasil diambil',
        total_kelas: result.length,
        kelas: result
      });
    });
  },

  // Get kelas by guru ID
  getKelasByGuru: (req, res) => {
    const { guru_id } = req.query;
    
    console.log('📚 Getting kelas for guru_id:', guru_id);

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
        guru_id: guru_id, 
        jumlah_kelas: result.length, 
        kelas: result 
      });
    });
  },

  // Get kelas by ID with details
  getKelasById: (req, res) => {
    const { id } = req.params;

    console.log('📋 Getting kelas details for ID:', id);

    if (!id) {
      return res.status(400).json({ message: 'Parameter id_kelas diperlukan' });
    }

    Kelas.getById(id, (err, kelasResult) => {
      if (err) {
        console.error('❌ Error getting kelas by ID:', err);
        return res.status(500).json({ message: 'Gagal mengambil data kelas' });
      }

      if (kelasResult.length === 0) {
        return res.status(404).json({ message: 'Kelas tidak ditemukan' });
      }

      // Get siswa in this kelas
      Kelas.getSiswaInKelas(id, (err, siswaResult) => {
        if (err) {
          console.error('❌ Error getting siswa in kelas:', err);
          return res.status(500).json({ message: 'Gagal mengambil data siswa' });
        }

        console.log(`✅ Kelas found with ${siswaResult.length} siswa`);
        res.json({
          message: 'Detail kelas berhasil diambil',
          kelas: kelasResult[0],
          jumlah_siswa: siswaResult.length,
          siswa: siswaResult
        });
      });
    });
  },

  // Create new kelas
  createKelas: (req, res) => {
    const { nama_kelas, guru_id } = req.body;

    console.log('➕ Creating new kelas:', nama_kelas, 'for guru:', guru_id);

    if (!nama_kelas || !guru_id) {
      return res.status(400).json({ message: 'Nama kelas dan guru_id diperlukan' });
    }

    const kelasData = { nama_kelas, guru_id };

    Kelas.create(kelasData, (err, result) => {
      if (err) {
        console.error('❌ Error creating kelas:', err);
        return res.status(500).json({ message: 'Gagal membuat kelas baru' });
      }

      console.log('✅ Kelas created successfully with ID:', result.insertId);
      res.status(201).json({
        message: 'Kelas berhasil dibuat',
        kelas: {
          id_kelas: result.insertId,
          nama_kelas,
          guru_id
        }
      });
    });
  },

  // Update kelas
  updateKelas: (req, res) => {
    const { id } = req.params;
    const { nama_kelas, guru_id } = req.body;

    console.log('✏️ Updating kelas ID:', id);

    if (!id) {
      return res.status(400).json({ message: 'Parameter id_kelas diperlukan' });
    }

    if (!nama_kelas && !guru_id) {
      return res.status(400).json({ message: 'Minimal satu field harus diisi untuk update' });
    }

    // Get current kelas data first
    Kelas.getById(id, (err, currentData) => {
      if (err) {
        console.error('❌ Error getting current kelas data:', err);
        return res.status(500).json({ message: 'Gagal mengambil data kelas' });
      }

      if (currentData.length === 0) {
        return res.status(404).json({ message: 'Kelas tidak ditemukan' });
      }

      const updateData = {
        nama_kelas: nama_kelas || currentData[0].nama_kelas,
        guru_id: guru_id || currentData[0].guru_id
      };

      Kelas.update(id, updateData, (err, result) => {
        if (err) {
          console.error('❌ Error updating kelas:', err);
          return res.status(500).json({ message: 'Gagal mengupdate kelas' });
        }

        console.log('✅ Kelas updated successfully');
        res.json({
          message: 'Kelas berhasil diupdate',
          kelas: {
            id_kelas: parseInt(id),
            ...updateData
          }
        });
      });
    });
  },

  // Delete kelas
  deleteKelas: (req, res) => {
    const { id } = req.params;

    console.log('🗑️ Deleting kelas ID:', id);

    if (!id) {
      return res.status(400).json({ message: 'Parameter id_kelas diperlukan' });
    }

    // Check if kelas has siswa
    Kelas.getSiswaInKelas(id, (err, siswaResult) => {
      if (err) {
        console.error('❌ Error checking siswa in kelas:', err);
        return res.status(500).json({ message: 'Gagal memeriksa data siswa' });
      }

      if (siswaResult.length > 0) {
        return res.status(400).json({ 
          message: `Tidak dapat menghapus kelas. Masih ada ${siswaResult.length} siswa di kelas ini.` 
        });
      }

      Kelas.delete(id, (err, result) => {
        if (err) {
          console.error('❌ Error deleting kelas:', err);
          return res.status(500).json({ message: 'Gagal menghapus kelas' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Kelas tidak ditemukan' });
        }

        console.log('✅ Kelas deleted successfully');
        res.json({
          message: 'Kelas berhasil dihapus',
          deleted_id: parseInt(id)
        });
      });
    });
  }
};

module.exports = kelasController;
