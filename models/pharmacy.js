import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    medications: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
            duration: { type: String, required: true }
        }
    ],
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    date: { type: Date, default: Date.now }
});

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

export default Pharmacy;
