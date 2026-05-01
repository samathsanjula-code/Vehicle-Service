const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^0\d{9}$/, 'Phone must be 10 digits starting with 0'],
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      trim: true,
    },
    availability: {
      type: String,
      enum: ['Available', 'Busy', 'Offline'],
      default: 'Available',
    },
    level: {
      type: String,
      enum: ['Junior', 'Senior', 'Expert'],
      default: 'Junior',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mechanic', mechanicSchema);
