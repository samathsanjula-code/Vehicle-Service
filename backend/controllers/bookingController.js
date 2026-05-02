const Booking = require("../models/Booking");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { vehicleId, serviceId, date, time, notes, totalAmount } = req.body;

    const booking = new Booking({
      user: req.user.id,
      vehicle: vehicleId,
      service: serviceId,
      date,
      time,
      notes,
      totalAmount,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", ["fullName", "email"])
      .populate("vehicle")
      .populate("service");
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", ["fullName", "email"])
      .populate("vehicle")
      .populate("service");
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get bookings by user
const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("vehicle")
      .populate("service")
      .sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update booking status
const updateBooking = async (req, res) => {
  try {
    const { status, mechanicId } = req.body;
    let booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    if (status) booking.status = status;
    if (mechanicId) booking.mechanic = mechanicId;

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    await booking.deleteOne();
    res.json({ msg: "Booking removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUser,
  updateBooking,
  deleteBooking,
};
