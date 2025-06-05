// controllers/absenController.js
const Absen = require('../models/Absen');
const Siswa = require('../models/Siswa');

const absenController = {
  // Submit absensi (untuk guru)
  submitAbsen: (req, res) => {
    const { id_kelas, tanggal, guru_id, absensi } = req.body;

    console.log('📝 Submitting absensi for kelas:', id_kelas, 'tanggal:', tanggal);

    if (!id_kelas || !tanggal || !guru_id || !Array.isArray(absensi)) {
      return res.status(400).json({ message: 'Data absen tidak lengkap' });
    }

    if (absensi.length === 0) {
      return res.status(400).json({ message: 'Data absensi siswa tidak boleh kosong' });
    }

    // Validate absensi data
    for (let i = 0; i < absensi.length; i++) {
      const item = absensi[i];
      if (!item.id_siswa || !item.status) {
        return res.status(400).json({ 
          message: `Data absensi tidak lengkap pada index ${i}` 
        });
      }
      
      if (!['hadir', 'sakit', 'izin', 'tidak ada keterangan'].includes(item.status)) {
        return res.status(400).json({ 
          message: `Status absensi tidak valid: ${item.status}` 
        });
      }
    }

    // Prepare data for bulk insert
    const absenData = absensi.map(item => [
      item.id_siswa,
      id_kelas,
      tanggal,
      item.status,
      guru_id
    ]);

    console.log(`📊 Inserting ${absenData.length} absensi records`);

    Absen.insert(absenData, (err, result) => {
      if (err) {
        console.error('❌ Insert absen error:', err);
        return res.status(500).json({ message: 'Gagal menyimpan data absen', error: err.message });
      }

      console.log('✅ Absensi berhasil disimpan, affected rows:', result.affectedRows);
      res.json({ 
        message: 'Absen berhasil disimpan', 
        inserted: result.affectedRows,
        tanggal,
        id_kelas: parseInt(id_kelas)
      });
    });
  },

  // Get absensi by kelas and tanggal
  getAbsen: (req, res) => {
    const { id_kelas, tanggal } = req.query;

    console.log('📋 Getting absensi for kelas:', id_kelas, 'tanggal:', tanggal);

    if (!id_kelas || !tanggal) {
      return res.status(400).json({ message: 'Parameter id_kelas dan tanggal diperlukan' });
    }

    Absen.getByKelasAndTanggal(id_kelas, tanggal, (err, result) => {
      if (err) {
        console.error('❌ Get absen error:', err);
        return res.status(500).json({ message: 'Gagal mengambil data absen', error: err.message });
      }

      console.log(`✅ Found ${result.length} absensi records`);

      // Group by status for summary
      const summary = result.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});

      res.json({
        message: 'Data absensi berhasil diambil',
        tanggal,
        id_kelas: parseInt(id_kelas),
        jumlah_siswa: result.length,
        summary,
        data: result
      });
    });
  },

  // Get absensi statistics by kelas
  getAbsenStats: (req, res) => {
    const { id_kelas } = req.query;

    console.log('📊 Getting absensi stats for kelas:', id_kelas);

    if (!id_kelas) {
      return res.status(400).json({ message: 'Parameter id_kelas diperlukan' });
    }

    Absen.getStatsByKelas(id_kelas, (err, result) => {
      if (err) {
        console.error('❌ Get absen stats error:', err);
        return res.status(500).json({ message: 'Gagal mengambil statistik absen' });
      }

      console.log(`✅ Found absensi stats for kelas ${id_kelas}`);

      res.json({
        message: 'Statistik absensi berhasil diambil',
        id_kelas: parseInt(id_kelas),
        statistics: result
      });
    });
  },

  // Update single absensi status
  updateAbsenStatus: (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log('✏️ Updating absensi status for ID:', id, 'to:', status);

    if (!status) {
      return res.status(400).json({ message: 'Status absensi diperlukan' });
    }

    if (!['hadir', 'sakit', 'izin', 'tidak ada keterangan'].includes(status)) {
      return res.status(400).json({ message: 'Status absensi tidak valid' });
    }

    Absen.updateStatus(id, status, (err, result) => {
      if (err) {
        console.error('❌ Update absen status error:', err);
        return res.status(500).json({ message: 'Gagal mengupdate status absen' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Data absensi tidak ditemukan' });
      }

      console.log('✅ Absensi status updated successfully');
      res.json({
        message: 'Status absensi berhasil diupdate',
        id: parseInt(id),
        new_status: status
      });
    });
  },

  // Delete absensi record
  deleteAbsen: (req, res) => {
    const { id } = req.params;

    console.log('🗑️ Deleting absensi record ID:', id);

    Absen.delete(id, (err, result) => {
      if (err) {
        console.error('❌ Delete absen error:', err);
        return res.status(500).json({ message: 'Gagal menghapus data absen' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Data absensi tidak ditemukan' });
      }

      console.log('✅ Absensi record deleted successfully');
      res.json({
        message: 'Data absensi berhasil dihapus',
        deleted_id: parseInt(id)
      });
    });
  }
};

module.exports = absenController;
