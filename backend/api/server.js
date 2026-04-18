require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const mechanicsRoutes = require('./routes/mechanics');

const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mechanics', mechanicsRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MotoHub API is running 🚗' });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb+srv://pusa:sam123@vehicle.nmh4rje.mongodb.net/motohub')
  .then(async () => {
    console.log('✅ MongoDB connected successfully to Atlas (mongodb+srv://pusa:sam123@vehicle.nmh4rje.mongodb.net/)');
    
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
        console.log('✅ Admin account seeded (admin@motohub.com)');
      } else if (!adminAcc.isAdmin) {
        adminAcc.isAdmin = true;
        await adminAcc.save();
        console.log('✅ Existing admin account upgraded to isAdmin=true');
      }
    } catch (e) {
      console.log('❌ Seeding failure:', e.message);
    }

    // Only listen if not running in a serverless environment (like Vercel)
    if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
      const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 MotoHub API server running on port ${PORT}`);
      });
      // Handle the case where the port is in use and skip listening for Vercel anyway.
      server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
          console.log(`Port ${PORT} in use, assuming serverless execution.`);
        }
      });
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

module.exports = app;
