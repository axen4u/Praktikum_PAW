const { Presensi } = require('../models');
const presensiRecords = require("../data/presensiData");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = (req, res) => {
  const { id: userId, nama: userName } = req.user;
  const waktuSekarang = new Date();
  const existingRecord = presensiRecords.find(
    (record) => record.userId === userId && record.checkOut === null
  );
  if (existingRecord) {
    return res
      .status(400)
      .json({ message: "Anda sudah melakukan check-in hari ini." });
  }
  const newRecord = {
    userId,
    nama: userName,
    checkIn: waktuSekarang,
    checkOut: null,
  };
  presensiRecords.push(newRecord);

  const formattedData = {
    ...newRecord,
    checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
  };
  console.log(
    `DATA TERUPDATE: Karyawan ${userName} (ID: ${userId}) melakukan check-in.`
  );

  res.status(201).json({
    message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
      waktuSekarang,
      "HH:mm:ss",
      { timeZone }
    )} WIB`,
    data: formattedData,
  });
};



exports.CheckOut = (req, res) => {
  const { id: userId, nama: userName } = req.user;
  const waktuSekarang = new Date();
  const recordToUpdate = presensiRecords.find(
    (record) => record.userId === userId && record.checkOut === null
  );

  if (!recordToUpdate) {
    return res.status(404).json({
      message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
    });
  }
  recordToUpdate.checkOut = waktuSekarang;
  const formattedData = {
    ...recordToUpdate,
    checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
      timeZone,
    }),
    checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", {
      timeZone,
    }),
  };

  console.log(
    `DATA TERUPDATE: Karyawan ${userName} (ID: ${userId}) melakukan check-out.`
  );

  res.json({
    message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
      waktuSekarang,
      "HH:mm:ss",
      { timeZone }
    )} WIB`,
    data: formattedData,
  });
};

exports.deletePresensi = (req, res) => {
  try {
    const presensiId = parseInt(req.params.id);

    // Cari indeks record sesuai ID
    const index = presensiRecords.findIndex(
      (record, i) => i + 1 === presensiId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Hapus data dari array
    presensiRecords.splice(index, 1);

    console.log(`Catatan presensi dengan ID ${presensiId} telah dihapus.`);

    return res.json({ message: "Catatan presensi berhasil dihapus." });
  } catch (error) {
    console.error("Error saat menghapus presensi:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;
    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
      });
    }
    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }


    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.nama = nama || recordToUpdate.nama;
    await recordToUpdate.save();


    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// Controller: presensicontroller.js
exports.getAllPresensi = (req, res) => {
  try {
    // Format checkIn/checkOut jika ada
    const formattedData = presensiRecords.map(record => ({
      ...record,
      checkIn: record.checkIn
        ? format(record.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone })
        : null,
      checkOut: record.checkOut
        ? format(record.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone })
        : null,
    }));

    res.json({
      message: "Daftar semua presensi",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error saat mengambil data presensi:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};




