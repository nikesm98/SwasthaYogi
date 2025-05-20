const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./Routes/userRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const authenticateUser = require('./MiddleWare/authMiddleWare');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));


app.use('/api/user', userRoutes);


app.use('/api/admin', authenticateUser, adminRoutes);
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
