const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  features: { type: [String], default: [] },
  icon: { type: String, default: 'sparkles-outline' },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
