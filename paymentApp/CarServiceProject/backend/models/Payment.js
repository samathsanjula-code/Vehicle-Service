const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: [true, "Booking ID is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, "Notes cannot exceed 300 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);