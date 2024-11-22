import bcrypt from 'bcrypt';
import User from '../models/user.js';// User model that stores all user data
import Doctor from '../models/doctor.js';
import Patient from '../models/patient.js';
import generateToken from '../utils/jwtUtilis.js';  // JWT generation function

// Controller to handle user registration
export async function registerUser (req, res) {
    const { name, gender, email, password, role, specialization, assignedDoctor, medicalHistory, currentMedications } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        user = new User({
            name,
            gender,
            email,
            password,
            role: role ? role : 'patient'  // Default to 'patient' if no role is specified
        });

        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user to the database
        await user.save();


        // If the role is doctor, also create an entry in the Doctor model
        if (user.role === 'doctor') {
            if (!specialization) {
                return res.status(400).json({ message: 'Specialization is required for doctors' });
            }

            const doctor = new Doctor({
                user: user._id,  // Reference to the User model
                specialization
            });

            try {
                await doctor.save();
            } catch (err) {
                console.error('Error saving doctor:', err.message);
                return res.status(500).json({ message: 'Failed to save doctor details.' });
            } // Save the doctor to the Doctor model
        }

        // If the user selects the role of 'patient', create an entry in the Patient model
        if (user.role === 'patient') {
            if (!assignedDoctor) {
                return res.status(400).json({ message: 'Assigned doctor is required for patients.' });
            }

            const doctor = await Doctor.findById(assignedDoctor);
            if (!doctor) {
                return res.status(404).json({ message: 'Assigned doctor not found.' });
            }

            const patient = new Patient({
                user: user._id,  // Reference to the user
                assignedDoctor: doctor._id,
                medicalHistory,
                currentMedications
            });

            // Save patient details to the Patient model
            await patient.save();

            // Update the Doctor's patients field with the new patient's ID
            //doctor.patients.push(patient._id);

            doctor.patients.push({
                _id: patient._id,
                user: patient.user,
                medicalHistory: patient.medicalHistory,
                currentMedications: patient.currentMedications,
              });


            await doctor.save();
        }


        // Generate a JWT token
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                gender: user.gender,
                email: user.email,
                role: user.role,
                specialization: user.role === 'doctor' ? specialization : undefined  // Only return specialization if doctor
            }
        });
    } catch (error) {
        console.error(error.message);
        console.error('Server error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to handle user login
export async function loginUser(req, res){
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// export default {
//     registerUser,
//     loginUser
// };
