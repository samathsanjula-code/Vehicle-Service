const mongoose = require('mongoose');

// We create a Schema to ensure every record has the same fields.
const serviceRecordSchema = new mongoose.Schema({
  // 'userId' links this record to a specific user.
  // Why: So when a user logs in, the system knows exactly which cars belong to them.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNumber: { type: String, required: true },
  // 'serviceDate' defaults to today's date if not provided.
  serviceDate: { type: Date, default: Date.now },
  serviceType: { type: String, required: true },
  mileage: { type: Number, required: true },
  description: { type: String },
  cost: { type: Number, required: true },
  // 'billImage' stores the file path of the photo on the server.
  // Why: The admin needs to see the physical receipt to verify the cost.
  billImage: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true }); // Automatically tracks when the record was created.

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);