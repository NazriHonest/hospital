import express from 'express';
import { updatePrescriptionStatus } from '../controllers/pharmacistController.js';
import {authenticate} from '../middleware/authMiddleware.js'; // Middleware to authenticate user
const router = express.Router();

// Only pharmacists should be able to access this route
router.put('/update-status', authenticate(['pharmacist']), updatePrescriptionStatus);

export default router;
