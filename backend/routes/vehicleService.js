const express = require('express');
const router = express.Router();
const VehicleService = require('../models/VehicleService');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/vehicle-service
// @desc    Register a new vehicle service request
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      customerDetails,
      vehicleDetails,
    } = req.body;

    const newRequest = new VehicleService({
      customerDetails,
      vehicleDetails,
      owner: req.user.id,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error('❌ Error saving vehicle service:', err.message);
    res.status(500).json({ message: 'Server error while saving vehicle service' });
  }
});

// @route   GET /api/vehicle-service
// @desc    Get all service requests for the logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const requests = await VehicleService.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('❌ Error fetching service requests:', err.message);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
});

// @route   PUT /api/vehicle-service/:id
// @desc    Update a service request
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { customerDetails, vehicleDetails, serviceDetails } = req.body;
    
    let request = await VehicleService.findOne({ _id: req.params.id, owner: req.user.id });
    if (!request) return res.status(404).json({ message: 'Record not found' });

    request.customerDetails = customerDetails || request.customerDetails;
    request.vehicleDetails = vehicleDetails || request.vehicleDetails;
    request.serviceDetails = serviceDetails || request.serviceDetails;

    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error while updating request' });
  }
});

// @route   DELETE /api/vehicle-service/:id
// @desc    Delete a service request
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await VehicleService.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!request) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting request' });
  }
});

module.exports = router;
