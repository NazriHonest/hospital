import express from 'express';
const router = express.Router();
// Use named imports for doctorController
import { registerDoctor, getDoctorDashboard, addPatientNotes, getDoctorPrescriptions } from '../controllers/doctorController.js';

import { authenticate } from '../middleware/authMiddleware.js';



// Register a new doctor
router.post('/register', registerDoctor);

// Get doctor's dashboard (authentication required)
router.get('/dashboard', authenticate(['doctor']), getDoctorDashboard);

// Add notes for a specific patient (authentication required)
router.post('/:id/notes', authenticate(['doctor']), addPatientNotes);

// Route to get all prescriptions for a doctor
router.get('/doctor-prescriptions', authenticate(['doctor']), getDoctorPrescriptions);



export default router;
