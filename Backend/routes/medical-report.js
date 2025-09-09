import express from 'express';
import multer from 'multer';
import MedicalReport from '../models/MedicalReport.js';
import { verifyToken } from './auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Mock AI analysis functions
function generateMockSummary(type) {
    const summaries = {
        prescription: "Blood pressure medication prescribed for hypertension management.",
        report: "Blood test results indicate normal levels with slight vitamin D deficiency.",
        scan: "X-ray results show no abnormalities in chest region."
    };
    return summaries[type] || "Medical document analyzed successfully.";
}
function generateMockDiagnosis(type) {
    const diagnoses = {
        prescription: "Hypertension (High Blood Pressure)",
        report: "Vitamin D Deficiency",
        scan: "Normal Chest X-ray"
    };
    return diagnoses[type] || "No significant findings";
}
function generateMockMedications(type) {
    const medications = {
        prescription: ["Lisinopril 10mg - Once daily", "Metformin 500mg - Twice daily"],
        report: ["Vitamin D3 1000 IU - Daily"],
        scan: []
    };
    return medications[type] || [];
}
function generateMockRecommendations(type) {
    const recommendations = {
        prescription: ["Take with food", "Monitor blood pressure daily", "Avoid high sodium foods"],
        report: ["Increase sun exposure", "Include vitamin D rich foods", "Follow up in 3 months"],
        scan: ["Maintain healthy lifestyle", "Annual check-up recommended"]
    };
    return recommendations[type] || ["Follow doctor's advice"];
}

// Upload report
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
    const { type } = req.body;
    const file = req.file;
    if (!file || !type) return res.status(400).json({ message: 'File and type are required' });
    try {
        const report = new MedicalReport({
            userId: req.user.id,
            fileName: file.originalname,
            type,
            summary: generateMockSummary(type),
            diagnosis: generateMockDiagnosis(type),
            medications: generateMockMedications(type),
            recommendations: generateMockRecommendations(type)
        });
        await report.save();
        res.status(201).json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all reports for user
router.get('/', verifyToken, async (req, res) => {
    try {
        const reports = await MedicalReport.find({ userId: req.user.id });
        res.json(reports);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete report
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await MedicalReport.deleteOne({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Report deleted' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
