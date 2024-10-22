import express from 'express';
import { prescribeMedication, sendPrescriptionToPharmacy } from '../controllers/prescriptionController.js';
import {authenticate} from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to prescribe medication
// Only doctors should be allowed to access this route
router.post('/prescribe', authenticate(['doctor']), prescribeMedication);

// Route to send prescription to the pharmacy
// Only doctors should be allowed to access this route
router.post('/send-to-pharmacy', authenticate(['doctor']), sendPrescriptionToPharmacy);

export default router;
