import express from 'express';
const router = express.Router();
// Use named imports for doctorController
import { registerDoctor, getDoctorDashboard, addPatientNotes, getDoctorPrescriptions, getAllDoctors, getDoctorById } from '../controllers/doctorController.js';

import { authenticate } from '../middleware/authMiddleware.js';



// Register a new doctor
router.post('/register', registerDoctor);

// Get doctor's dashboard (authentication required)
router.get('/dashboard', authenticate(['doctor']), getDoctorDashboard);

// Add notes for a specific patient (authentication required)
router.post('/:id/notes', authenticate(['doctor']), addPatientNotes);

// Route to get all prescriptions for a doctor
router.get('/doctor-prescriptions', authenticate(['doctor']), getDoctorPrescriptions);

// Route to get all doctors
router.get('/all-doctors', getAllDoctors);

// Route to get a doctor by ID
router.get('/doctors/:id', getDoctorById);



export default router;
