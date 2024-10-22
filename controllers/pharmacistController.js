import Prescription from '../models/prescription.js';

// Controller to update prescription status by pharmacist
export async function updatePrescriptionStatus(req, res) {
    const { prescriptionId, status } = req.body; // Get prescription ID and new status from request body

    if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // Check if user is a pharmacist
        if (req.user.role !== 'pharmacist') {
            return res.status(403).json({ message: 'Access denied. Only pharmacists can update status' });
        }

        // Find the prescription by ID
        const prescription = await Prescription.findById(prescriptionId);
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        // If prescription is already completed, we don't need to update again
        if (prescription.status === 'completed' && status === 'completed') {
            return res.status(400).json({ message: 'Prescription is already completed' });
        }

        // Update the prescription status
        prescription.status = status;
        await prescription.save();

        // Update the status in the pharmacy model
        const pharmacyRecord = await Pharmacy.findOne({ prescriptionId: prescriptionId });
        if (pharmacyRecord) {
            pharmacyRecord.status = status;
            await pharmacyRecord.save();
        }

        // Send response
        res.status(200).json({
            message: `Prescription status updated to ${status}`,
            prescription
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}
