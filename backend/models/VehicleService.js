const mongoose = require('mongoose');

const vehicleServiceSchema = new mongoose.Schema({
  customerDetails: {
    fullName: { type: String },
    contactNumber: { type: String, required: true },
  },
  vehicleDetails: {
    category: { type: String },
    brand: { type: String },
    model: { type: String },
    year: { type: String },
    regNumber: { type: String, required: true },
    fuelType: { type: String },
    transmission: { type: String },
  },
  serviceDetails: {
    serviceType: { type: String },
    preferredDate: { type: Date },
    preferredTimeSlot: { type: String },
    issueDescription: { type: String },
    images: [{ type: String }], // Array of URIs or file paths
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VehicleService', vehicleServiceSchema);
