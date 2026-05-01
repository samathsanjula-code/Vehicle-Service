const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle ID is required']
  },
  serviceType: {
    type: [String],
    required: [true, 'At least one service type is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Pending Payment', 'Confirmed', 'Assigned', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  assignedMechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mechanic',
    default: null
  },
  notes: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
