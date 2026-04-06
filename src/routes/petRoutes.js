const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

// Esta ruta SÍ se queda protegida (Solo Admins)
router.post('/admin/register', auth, adminAuth, petController.registerPet);
router.delete('/admin/delete/:id', auth, adminAuth, petController.deletePetAdmin);

router.get('/available', petController.getAvailablePets);
router.get('/:id', petController.getPetById);


module.exports = router;