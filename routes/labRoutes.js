// routes/labRoutes.js
import express from 'express';
import { sendNotesToLab, updateLabResult, getPatientLabResults } from '../controllers/labController.js';
import { authenticate } from '../middleware/authMiddleware.js';


const router = express.Router();

// Route for doctors to send notes to lab for a patient
router.post('/send', authenticate(['doctor']), sendNotesToLab);

// Route for labs to update the result of a test
router.put('/result/:testId', authenticate(['lab']), updateLabResult);

// Route for doctors to get lab results for a specific patient
router.get('/results/:patientId', authenticate(['doctor']), getPatientLabResults);

export default router;
