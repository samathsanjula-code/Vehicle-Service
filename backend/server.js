require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const fs = require('fs');

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service'); // Service routes import
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MotoHub API is running 🚗' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({ message: err.message || 'Internal server error' });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully to Atlas');
    
    // Seed Admin
    try {
      const adminAcc = await User.findOne({ email: 'admin@motohub.com' });
      if (!adminAcc) {
        await User.create({
          fullName: 'System Admin',
          email: 'admin@motohub.com',
          phone: '0000000000',
          passwordHash: 'admin123',
          isAdmin: true
        });
        console.log('✅ Admin account seeded');
      }
    } catch (e) {
      console.log('❌ Seeding failure:', e.message);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 API server: http:/192.168.2.96${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });