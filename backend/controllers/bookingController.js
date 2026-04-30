const Booking = require('../models/Booking');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { vehicleId, serviceType, scheduledDate, scheduledTime, notes } = req.body;
    
    const newBooking = await Booking.create({
      customerId: req.user.id,
      vehicleId,
      serviceType,
      scheduledDate,
      scheduledTime,
      notes
    });
    
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: error.message || 'Failed to create booking' });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customerId', 'fullName email phone')
      .populate('vehicleId');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'fullName email phone')
      .populate('vehicleId');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to view this booking
    if (booking.customerId._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
};

// Get bookings by user ID
exports.getBookingsByUser = async (req, res) => {
  try {
    // Only allow users to fetch their own bookings, unless admin
    if (req.params.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view these bookings' });
    }
    
    const bookings = await Booking.find({ customerId: req.params.userId })
      .populate('vehicleId')
      .sort({ scheduledDate: 1, scheduledTime: 1 });
      
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Failed to fetch user bookings' });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.customerId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(400).json({ message: error.message || 'Failed to update booking' });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.customerId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
};
