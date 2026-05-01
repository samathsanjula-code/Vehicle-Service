const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerDetails: {
    fullName: { type: String },
    contactNumber: { type: String },
  },
  vehicleDetails: {
    category: {
      type: String,
      enum: ['car', 'motorcycle', 'van', 'truck'],
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: { type: String },
    regNumber: {
      type: String,
      required: true,
      unique: true,
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic'],
    },
  },
  serviceDetails: {
    serviceType: { type: String },
    preferredDate: { type: Date },
    preferredTimeSlot: { type: String },
    issueDescription: { type: String },
  },
  image: { type: String },
  status: {
    type: String,
    default: 'Healthy',
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
