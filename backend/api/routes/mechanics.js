const express = require('express');
const Mechanic = require('../models/Mechanic');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET all mechanics
router.get('/', async (req, res) => {
  try {
    const mechanics = await Mechanic.find().sort({ createdAt: -1 });
    res.json(mechanics);
  } catch (error) {
    console.error('❌ Fetch mechanics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST to add new mechanic
router.post('/', adminAuth, async (req, res) => {
  try {
    const mechanic = new Mechanic(req.body);
    await mechanic.save();
    res.status(201).json({ message: 'Mechanic added successfully', mechanic });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('❌ Add mechanic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT to update mechanic
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const mechanic = await Mechanic.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true 
    });
    
    if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });
    res.json({ message: 'Mechanic updated successfully', mechanic });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('❌ Update mechanic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a mechanic
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const mechanic = await Mechanic.findByIdAndDelete(req.params.id);
    if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });
    res.json({ message: 'Mechanic deleted successfully' });
  } catch (error) {
    console.error('❌ Delete mechanic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
