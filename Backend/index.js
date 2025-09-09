import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import medicineRoutes from './routes/medicine.js';
import medicalReportRoutes from './routes/medical-report.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/medical-report', medicalReportRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
        .then(() => {
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        })
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

export default app;
