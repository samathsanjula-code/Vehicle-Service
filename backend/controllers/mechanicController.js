const Mechanic = require('../models/Mechanic');

// Get all mechanics
exports.getAllMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find().sort({ createdAt: -1 });
    res.status(200).json(mechanics);
  } catch (error) {
    console.error('Error fetching mechanics:', error);
    res.status(500).json({ message: 'Failed to fetch mechanics' });
  }
};

// Create a new mechanic
exports.createMechanic = async (req, res) => {
  try {
    const { name, specialization, phone, experience, availability, level } = req.body;
    
    // Validate required fields
    if (!name || !specialization || !phone || !experience) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newMechanic = await Mechanic.create({
      name,
      specialization,
      phone,
      experience,
      availability: availability || 'Available',
      level: level || 'Junior'
    });
    
    res.status(201).json(newMechanic);
  } catch (error) {
    console.error('Error creating mechanic:', error);
    res.status(400).json({ message: error.message || 'Failed to create mechanic' });
  }
};

// Get mechanic by ID
exports.getMechanicById = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
      
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    res.status(200).json(mechanic);
  } catch (error) {
    console.error('Error fetching mechanic:', error);
    res.status(500).json({ message: 'Failed to fetch mechanic' });
  }
};

// Update mechanic
exports.updateMechanic = async (req, res) => {
  try {
    const mechanic = await Mechanic.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    res.status(200).json(mechanic);
  } catch (error) {
    console.error('Error updating mechanic:', error);
    res.status(400).json({ message: error.message || 'Failed to update mechanic' });
  }
};

// Delete mechanic
exports.deleteMechanic = async (req, res) => {
  try {
    const mechanic = await Mechanic.findByIdAndDelete(req.params.id);
    
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    
    res.status(200).json({ message: 'Mechanic deleted successfully' });
  } catch (error) {
    console.error('Error deleting mechanic:', error);
    res.status(500).json({ message: 'Failed to delete mechanic' });
  }
};