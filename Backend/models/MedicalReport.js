import mongoose from 'mongoose';

const MedicalReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    type: { type: String, enum: ['prescription', 'report', 'scan'], required: true },
    summary: String,
    diagnosis: String,
    medications: [String],
    recommendations: [String]
});

export default mongoose.model('MedicalReport', MedicalReportSchema);
