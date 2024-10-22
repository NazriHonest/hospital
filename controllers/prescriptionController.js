import Prescription from '../models/prescription.js';
import Pharmacy from '../models/pharmacy.js';
import Doctor from '../models/doctor.js';
import Patient from '../models/patient.js';

// Controller to handle prescribing medication
export async function prescribeMedication(req, res) {
    try {
        const { patientId, medications } = req.body;  // Medications array and patient ID
        const userId = req.user._id;  // Get the logged-in doctor's ID

        // Find both patient and doctor exist
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

        const doctorId = doctor._id;

        // Create a new prescription Entry
        const prescription = new Prescription({
            doctorId: doctor._id,
            patientId: patient._id,
            medications
        });

        // Save the prescription
        await prescription.save();

        // Update the patient's current medications
        patient.currentMedications.push(...medications);
        await patient.save();

        res.status(200).json({ message: 'Medication prescribed successfully', prescription });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

// Controller to send prescription to the pharmacy
export async function sendPrescriptionToPharmacy(req, res) {
    try {
        const { prescriptionId, patientId } = req.body; // Get prescription ID and patient ID

        // Find the prescription and patient
        const prescription = await Prescription.findById(prescriptionId);
        const patient = await Patient.findById(patientId);

        if (!prescription || !patient) {
            return res.status(404).json({ message: 'Prescription or Patient not found' });
        }

        // Create a new pharmacy record for the prescription
        const pharmacy = new Pharmacy({
            prescriptionId,
            patientId,
            medications: prescription.medications
        });

        // Save the pharmacy record
        await pharmacy.save();

        res.status(200).json({ message: 'Prescription sent to pharmacy', pharmacy });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}
