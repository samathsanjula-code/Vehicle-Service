const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Drop the problematic old index if it exists
Vehicle.collection.dropIndex('licensePlate_1').catch(err => {
  // If the index doesn't exist, it's fine, just ignore the error
  if (err.codeName !== 'IndexNotFound') {
    console.log('Note: licensePlate index check -', err.message);
  }
});
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

// GET all vehicles for Admin (All users' vehicles)
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    const vehicles = await Vehicle.find()
      .populate("owner", "fullName email phone")
      .sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching all vehicles" });
  }
});

// GET a single vehicle by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // If Admin, don't filter by owner. If regular user, only show their own vehicles.
    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id };
    
    const vehicle = await Vehicle.findOne(query).populate("owner", "fullName email phone");
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching vehicle' });
  }
});

// POST add a new vehicle
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized, user missing' });
    }

    const { customerDetails, vehicleDetails, image } = req.body;

    // Safety check: ensure required vehicleDetails exist
    if (!vehicleDetails || !vehicleDetails.brand || !vehicleDetails.model || !vehicleDetails.regNumber || !vehicleDetails.category) {
      console.log("❌ Validation failed. Missing fields:", { 
        category: vehicleDetails?.category,
        brand: vehicleDetails?.brand,
        model: vehicleDetails?.model,
        regNumber: vehicleDetails?.regNumber 
      });
      return res.status(400).json({ message: 'Missing required information: Brand, Model, Reg Number, and Category are mandatory.' });
    }

    const newVehicle = new Vehicle({
      customerDetails: customerDetails || {},
      vehicleDetails: vehicleDetails,
      image: image || null,
      owner: req.user.id,
    });

    const savedVehicle = await newVehicle.save();
    console.log('✅ Vehicle saved successfully:', savedVehicle._id);
    res.status(201).json(savedVehicle);
  } catch (err) {
    console.error('❌ POST ERROR:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      return res.status(400).json({ 
        message: `Duplicate Error: The ${field} '${value}' is already registered. Please use a different one.` 
      });
    }
    res.status(500).json({ message: err.message || 'Server error while saving vehicle' });
  }
});

// DELETE a vehicle
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id };
    const vehicle = await Vehicle.findOneAndDelete(query);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting vehicle' });
  }
});

// UPDATE a vehicle
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { customerDetails, vehicleDetails, image, status } = req.body;
    const query = req.user.isAdmin ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id };
    let vehicle = await Vehicle.findOne(query);
    
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    if (customerDetails) vehicle.customerDetails = customerDetails;
    if (vehicleDetails) vehicle.vehicleDetails = vehicleDetails;
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
