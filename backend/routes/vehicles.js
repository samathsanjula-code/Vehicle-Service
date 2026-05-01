const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const authMiddleware = require('../middleware/auth');

// GET all vehicles for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching vehicles' });
  }
});

// POST add a new vehicle
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized, user missing' });
    }

    const { customerDetails, vehicleDetails, serviceDetails, image } = req.body;

    // Safety check: ensure required vehicleDetails exist
    if (!vehicleDetails || !vehicleDetails.brand || !vehicleDetails.model || !vehicleDetails.regNumber || !vehicleDetails.category) {
      return res.status(400).json({ message: 'Missing required vehicle information (Category, Brand, Model, or Reg Number)' });
    }

    const newVehicle = new Vehicle({
      customerDetails: customerDetails || {},
      vehicleDetails: vehicleDetails,
      serviceDetails: serviceDetails || {},
      image: image || null,
      owner: req.user.id,
    });

    const savedVehicle = await newVehicle.save();
    console.log('✅ Vehicle saved successfully:', savedVehicle._id);
    res.status(201).json(savedVehicle);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Vehicle with this Registration Number already exists.' });
    
    // LOG THE FULL ERROR TO A FILE SO I CAN READ IT
    const fs = require('fs');
    const errorData = `\n--- ERROR at ${new Date().toISOString()} ---\n${err.stack}\n${JSON.stringify(err, null, 2)}\n`;
    fs.appendFileSync('./error_log.txt', errorData);

    console.error('❌ POST ERROR:', err.message);
    res.status(500).json({ message: err.message || 'Server error while saving vehicle' });
  }
});

// DELETE a vehicle
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting vehicle' });
  }
});

// UPDATE a vehicle
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { customerDetails, vehicleDetails, serviceDetails, image, status } = req.body;
    let vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user.id });
    
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    if (customerDetails) vehicle.customerDetails = customerDetails;
    if (vehicleDetails) vehicle.vehicleDetails = vehicleDetails;
    if (serviceDetails) vehicle.serviceDetails = serviceDetails;
    if (image !== undefined) vehicle.image = image;
    if (status) vehicle.status = status;

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error('❌ PUT ERROR:', err);
    res.status(500).json({ message: err.message || 'Server error while updating vehicle' });
  }
});

module.exports = router;
