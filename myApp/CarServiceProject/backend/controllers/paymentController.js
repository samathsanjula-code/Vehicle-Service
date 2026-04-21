const mongoose = require("mongoose");
const Payment = require("../models/Payment");

const validStatuses = ["Paid", "Pending"];

const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, status, paymentDate, notes } = req.body;

    if (!bookingId || !String(bookingId).trim()) {
      return res.status(400).json({ success: false, message: "Booking ID is required" });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be greater than 0" });
    }

    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Status must be either Paid or Pending" });
    }

    const payment = await Payment.create({
      bookingId: String(bookingId).trim(),
      amount: numericAmount,
      status: status || "Pending",
      paymentDate: paymentDate || Date.now(),
      notes: notes ? String(notes).trim() : "",
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && validStatuses.includes(status)) {
      filter.status = status;
    }

    if (search && String(search).trim()) {
      filter.bookingId = { $regex: String(search).trim(), $options: "i" };
    }

    const payments = await Payment.find(filter).sort({ paymentDate: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid payment ID" });
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message,
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid payment ID" });
    }

    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Status must be either Paid or Pending" });
    }

    const payment = await Payment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid payment ID" });
    }

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
};