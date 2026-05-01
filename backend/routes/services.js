const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: 'Service not found' });
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Service not found' });
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/services
// @desc    Add a new service
// @access  Public (should ideally be Admin only)
router.post('/', async (req, res) => {
  try {
    const { name, category, price, discountPrice, description, features, icon } = req.body;

    const newService = new Service({
      name,
      category,
      price,
      discountPrice,
      description,
      features,
      icon: icon || 'sparkles-outline'
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { name, category, price, discountPrice, description, features, icon } = req.body;
    
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: 'Service not found' });

    service.name = name || service.name;
    service.category = category || service.category;
    service.price = price || service.price;
    service.discountPrice = discountPrice !== undefined ? discountPrice : service.discountPrice;
    service.description = description || service.description;
    if (features) service.features = features;
    service.icon = icon || service.icon;

    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Service not found' });
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: 'Service not found' });

    await service.deleteOne();
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Service not found' });
    res.status(500).send('Server Error');
  }
});

module.exports = router;
