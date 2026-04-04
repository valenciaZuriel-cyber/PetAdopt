const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');


router.post('/request', auth, adoptionController.requestAdoption);

router.put('/validate/:id', auth, adoptionController.validateAdoption);

router.patch('/admin/status/:id', auth, adminAuth, adoptionController.updateAdoptionStatus);

router.delete('/admin/cancel/:id', auth, adminAuth, adoptionController.cancelAdoption);

router.get('/my-requests', auth, adoptionController.getUserRequests);

router.get('/admin/all', auth, adminAuth, adoptionController.getAllRequestsAdmin);

module.exports = router;