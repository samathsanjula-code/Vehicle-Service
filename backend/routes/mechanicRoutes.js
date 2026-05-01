const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanicController');
const authMiddleware = require('../middleware/auth');

// All mechanic routes require authentication
router.use(authMiddleware);

// Get all mechanics
router.get('/', mechanicController.getAllMechanics);

// Create a new mechanic
router.post('/', mechanicController.createMechanic);

// Get mechanic by ID
router.get('/:id', mechanicController.getMechanicById);

// Update mechanic
router.put('/:id', mechanicController.updateMechanic);

// Delete mechanic
router.delete('/:id', mechanicController.deleteMechanic);

module.exports = router;
