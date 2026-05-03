const mongoose = require('mongoose');

const vehicleServiceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerDetails: {
    type: Object,
    default: {},
  },
  vehicleDetails: {
    type: Object,
    default: {},
  },
  serviceDetails: {
    type: Object,
    default: {},
  }
}, { timestamps: true });

module.exports = mongoose.model('VehicleService', vehicleServiceSchema);
