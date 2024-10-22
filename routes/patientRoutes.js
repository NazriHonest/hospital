import express from 'express';
import { registerPatient, getPatientInfo } from '../controllers/patientController.js';

const router = express.Router();

router.post('/register', registerPatient);
router.get('/:id', getPatientInfo);

export default router;
