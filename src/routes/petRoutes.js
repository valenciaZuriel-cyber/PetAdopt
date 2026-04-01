const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

// Esta ruta SÍ se queda protegida (Solo Admins)
router.post('/admin/register', auth, adminAuth, petController.registerPet);

// Esta ruta ahora es PÚBLICA (Le quitamos el "auth")
router.get('/available', petController.getAvailablePets);

module.exports = router;