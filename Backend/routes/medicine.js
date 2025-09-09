import express from 'express';
import Medicine from '../models/Medicine.js';
import { verifyToken } from './auth.js';

const router = express.Router();

function calculateNextDose(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const nextDose = new Date();
    nextDose.setHours(hours, minutes, 0, 0);
    if (nextDose <= new Date()) {
        nextDose.setDate(nextDose.getDate() + 1);
    }
    return nextDose;
}

// Add medicine
router.post('/', verifyToken, async (req, res) => {
    const { name, dosage, time, frequency } = req.body;
    if (!name || !dosage || !time || !frequency) return res.status(400).json({ message: 'All fields required' });
    try {
        const nextDose = calculateNextDose(time);
        const medicine = new Medicine({
            userId: req.user.id,
            name,
            dosage,
            time,
            frequency,
            isActive: true,
            nextDose
        });
        await medicine.save();
        res.status(201).json(medicine);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all medicines for user
router.get('/', verifyToken, async (req, res) => {
    try {
        const medicines = await Medicine.find({ userId: req.user.id });
        res.json(medicines);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update medicine
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updates = req.body;
        if (updates.time) {
            updates.nextDose = calculateNextDose(updates.time);
        }
        const medicine = await Medicine.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            updates,
            { new: true }
        );
        res.json(medicine);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete medicine
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Medicine.deleteOne({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Medicine deleted' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get medicines due now
router.get('/alerts/due', verifyToken, async (req, res) => {
    try {
        const now = new Date();
        const medicines = await Medicine.find({ userId: req.user.id, isActive: true, nextDose: { $lte: now } });
        res.json(medicines);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
