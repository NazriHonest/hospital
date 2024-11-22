import Doctor from '../models/doctor.js';
import Patient from '../models/patient.js';
import User from '../models/user.js';
import bcrypt from 'bcrypt';


export async function registerDoctor(req, res){
    const { name, email, password, specialization } = req.body;

    try {
        // Check if the doctor already exists
        let user = await Doctor.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }

        // Create a new doctor
        user = new User({
            name,
            email,
            password,
            role: 'doctor',  // Ensure role is set to 'doctor'
            specialization
        });

        new Doctor({
            name: user.name,
            specialization: user.specialization,
        });

        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the doctor to the database
        await user.save();

        // Generate a JWT token
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                specialization: user.specialization
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// export async function getDoctorDashboard(req, res) {
//     try {
//         // Use req.user._id since the doctor is authenticated, and we attach the user to the request
//         const doctor = await Doctor.findOne({user: req.user._id}).populate('patients');

//         if (!doctor) {
//             return res.status(404).json({ message: "Doctor not found" });
//         }

//         // Find all patients assigned to this doctor (assuming you have 'assignedDoctor' in the Patient model)
//         const patients = await Patient.find({ assignedDoctor: doctor._id }).populate('user', 'name email');

//         // Respond with doctor info and patients assigned to the doctor
//         res.status(200).json({ doctor, patients });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

export async function getDoctorDashboard(req, res) {
    try {
        // Find the doctor by the authenticated user's ID
        const doctor = await Doctor.findOne({ user: req.user._id })
            .populate({
                path: 'patients',
                populate: { path: 'user', select: 'name email' } // Populate user details for each patient
            })
            .populate('user', 'name email gender'); // Populate the doctor's user details

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Respond with the populated doctor object
        res.status(200).json({ doctor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}





export async function addPatientNotes(req, res) {
    try {
        const { notes, patientId } = req.body; // Expecting note content and patient ID in request body
        const doctor = await Doctor.findById(req.params.id); // Find the doctor by their ID (from route params)
        const patient = await Patient.findById(patientId); // Find the patient by the patient ID

        // Check if both doctor and patient exist
        if (!doctor || !patient) {
            return res.status(404).json({ message: "Doctor or Patient not found" });
        }

        // Push the note with patientId, note content, and the current date into the doctor's notes array
        doctor.notes.push({
            patientId: patientId,
            note: notes,
            date: new Date() // Current date
        });

        // Save the updated doctor document
        await doctor.save();

        res.status(200).json({ message: "Notes added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controller to get all prescriptions for a doctor
export async function getDoctorPrescriptions(req, res) {
    try {
        const doctorId = req.user._id; // Get the logged-in doctor's ID

        // Find all prescriptions for the doctor
        const prescriptions = await Prescription.find({ doctorId }).populate('patientId', 'name');

        if (!prescriptions.length) {
            return res.status(404).json({ message: 'No prescriptions found' });
        }

        res.status(200).json({ prescriptions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get all doctors
export async function getAllDoctors(req, res){
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve doctors", error });
    }
};

// Get doctor by ID
export async function getDoctorById(req, res){
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve doctor", error });
    }
};


export default {
    registerDoctor,
    getDoctorDashboard,
    addPatientNotes,
    getDoctorPrescriptions,
    getAllDoctors,
    getDoctorById
  };