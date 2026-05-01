require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/services', require('./routes/services'));

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
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Database Connection ──────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully to Atlas');
    console.log(`📡 Database: ${mongoose.connection.name}`);

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

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 MotoHub API server running on port ${PORT}`);
      console.log(`🌐 Access from device: http://<YOUR_LAN_IP>:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
