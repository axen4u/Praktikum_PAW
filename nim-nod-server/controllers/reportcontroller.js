const presensiRecords = require("../data/presensidata");
exports.getDailyReport = (req, res) => {
  console.log("Controller: Mengambil data laporan harian dari array...");
  res.json({
    reportDate: new Date().toLocaleDateString(),
    data: presensiRecords,
  });
};

