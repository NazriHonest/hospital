// routes/labRoutes.js
import express from 'express';
import { sendNotesToLab, updateLabResult, getPatientLabResults, getAllPatientNotes, sendLabResults } from '../controllers/labController.js';
import { authenticate } from '../middleware/authMiddleware.js';


const router = express.Router();

// Route for doctors to send notes to lab for a patient
router.post('/send-notes', authenticate(['doctor']), sendNotesToLab);

// Route for labs to update the result of a test
router.put('/result/:testId', authenticate(['lab']), updateLabResult);

// Route to get all patient notes for lab technicians
router.get('/patients-notes', authenticate(['lab']), getAllPatientNotes);

// Route for doctors to get lab results for a specific patient
router.get('/results/:patientId', authenticate(['doctor']), getPatientLabResults);

// Route to send lab results
router.post('/results', authMiddleware, sendLabResults);

export default router;
