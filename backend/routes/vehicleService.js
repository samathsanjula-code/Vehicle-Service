const express = require('express');
const router = express.Router();
const VehicleService = require('../models/VehicleService');

// @route   POST /api/vehicle-service
// @desc    Register a new vehicle service request
// @access  Public (or Private if auth is needed)
router.post('/', async (req, res) => {
  try {
    const {
      customerDetails,
      vehicleDetails,
      serviceDetails,
    } = req.body;

    const newRequest = new VehicleService({
      customerDetails,
      vehicleDetails,
      serviceDetails,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error('❌ Error saving vehicle service:', err.message);
    res.status(500).json({ message: 'Server error while saving vehicle service' });
  }
});

// @route   GET /api/vehicle-service
// @desc    Get all service requests
// @access  Public (for demo, should be Admin-only)
router.get('/', async (req, res) => {
  try {
    const requests = await VehicleService.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('❌ Error fetching service requests:', err.message);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
});

module.exports = router;
