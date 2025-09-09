import mongoose from 'mongoose';

const MedicineSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    time: { type: String, required: true },
    frequency: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    nextDose: { type: Date }
});

export default mongoose.model('Medicine', MedicineSchema);
