// controllers/labController.js
import LabTest from '../models/lab_test.js';
import Doctor from '../models/doctor.js';
import Patient from '../models/patient.js';

// Controller to send patient notes to the lab
export async function sendNotesToLab(req, res) {
    try {
        const { patientId, notes } = req.body; // Get patient ID and notes from the request body
        const userId = req.user._id; // Get the doctor ID from the logged-in user (via JWT token)


        // Check if both doctor and patient exist
        const doctor = await Doctor.findOne({user: userId});
        if (!doctor) {
            console.log("Doctor not found with ID:", doctorId);
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            console.log("Patient not found with ID:", patientId);
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Ensure the doctor is assigned to this patient
        if (patient.assignedDoctor.toString() !== doctor._id.toString()) {
            return res.status(403).json({ message: 'Doctor is not assigned to this patient' });
        }

        // Create a new lab test entry
        const labTest = new LabTest({
            doctorId: doctor._id,
            patientId: patient._id,
            notes: notes
        });

        // Save the lab test
        await labTest.save();

        res.status(200).json({ message: 'Notes sent to lab for examination', labTest });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
}

// Controller for lab to update the result of a lab test
export async function updateLabResult(req, res) {
    try {
        const { result } = req.body; // Get the result from the request body
        const { testId } = req.params; // Get the lab test ID from route params

        // Find the lab test by ID
        const labTest = await LabTest.findById(testId);

        if (!labTest) {
            return res.status(404).json({ message: 'Lab test not found' });
        }

        // Update the result and status
        labTest.result = result;
        labTest.status = 'Completed';
        labTest.completedAt = new Date();

        // Save the updated lab test
        await labTest.save();

        res.status(200).json({ message: 'Lab test result updated successfully', labTest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controller to retrieve lab results for a specific patient
export async function getPatientLabResults(req, res) {
    try {
        const { patientId } = req.params; // Get patient ID from route params
        const userId = req.user._id; // Get doctor ID from the authenticated user

        // Find the doctor based on the logged-in user's ID
        const doctor = await Doctor.findOne({ user: userId });

        // If no doctor is found for this user, return an error
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const doctorId = doctor._id; 

        // Find all lab tests for the patient performed by the logged-in doctor
        const labTests = await LabTest.find({ patientId: patientId, doctorId: doctorId });

        if (!labTests.length) {
            console.log(`No lab tests found for patient ID: ${patientId}`);
            return res.status(404).json({ message: 'No lab tests found for this patient' });
        }

        res.status(200).json({ labTests });
    } catch (error) {
        console.error('Error fetching lab results:', error.message);
        res.status(500).json({ error: error.message });
    }
}

export default {
    sendNotesToLab,
    updateLabResult,
    getPatientLabResults,
  };