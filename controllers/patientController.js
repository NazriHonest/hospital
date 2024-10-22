import Patient from '../models/patient.js';
import Doctor from '../models/doctor.js';
import User from '../models/user.js';

export async function registerPatient(req, res) {
    try {
        const { name, age, doctorId } = req.body;
        
        const doctor = await Doctor.findById({doctorId});
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        const patient = new Patient({
            name,
            age,
            doctor: doctorId
        });

        await patient.save();
        doctor.patients.push(patient._id);
        await doctor.save();

        res.status(201).json({ message: "Patient registered successfully", patient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getPatientInfo(req, res) {
    try {
        const patient = await Patient.findById(req.params.id).populate('doctor');
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
