const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensicontroller');
const { addUserData } = require('../middleware/permissionMiddleware');

// Middleware untuk menambahkan data user
router.use(addUserData);

// Endpoint untuk check-in
router.post('/check-in', presensiController.CheckIn);

// Endpoint untuk check-out
router.post('/check-out', presensiController.CheckOut);

// Endpoint GET semua presensi
router.get('/', presensiController.getAllPresensi);

// Endpoint update (PUT)
router.put('/:id', presensiController.updatePresensi);

// Endpoint DELETE
router.delete('/:id', presensiController.deletePresensi);

module.exports = router;
