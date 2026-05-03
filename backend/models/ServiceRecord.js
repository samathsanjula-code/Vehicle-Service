const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNumber: { type: String, required: true },
  serviceDate: { type: Date, default: Date.now },
  serviceType: { type: String, required: true },
  mileage: { type: Number, required: true },
  description: { type: String },
  cost: { type: Number, required: true },
  billImage: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);