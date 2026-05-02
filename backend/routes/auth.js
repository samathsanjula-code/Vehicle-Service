const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  try {
    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      console.log('❌ Registration failed: Missing required fields');
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log(`❌ Registration failed: Email already in use — ${email}`);
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Validate password length
    if (password.length < 6) {
      console.log(`❌ Registration failed: Password too short — ${email}`);
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Create new user (passwordHash field triggers pre-save hashing)
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      passwordHash: password,
    });

    await newUser.save();

    console.log(`✅ Registration successful: ${newUser.email} (ID: ${newUser._id})`);

    return res.status(201).json({
      message: 'Account created successfully. Please log in.',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        loyaltyPoints: newUser.loyaltyPoints,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      console.log(`❌ Registration validation error: ${messages.join(', ')}`);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('❌ Registration server error:', err.message);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      console.log('❌ Login failed: Missing credentials');
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log(`❌ Login failed: No account found — ${email}`);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Verify password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      console.log(`❌ Login failed: Wrong password — ${email}`);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, fullName: user.fullName, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ Login successful: ${user.email} (ID: ${user._id})`);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        loyaltyPoints: user.loyaltyPoints,
      },
    });
  } catch (err) {
    console.error('❌ Login server error:', err.message);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── GET /api/auth/me (protected) ────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error('❌ /me error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
