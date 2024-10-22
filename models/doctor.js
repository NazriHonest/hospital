import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    specialization: { type: String, required: true },
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
    notes: [
        {
            patientId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Patient',
                required: true
            },
            note: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Doctor', doctorSchema);
