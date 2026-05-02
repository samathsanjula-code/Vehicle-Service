const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUser,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

router.use(authMiddleware);

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.get('/user/:userId', getBookingsByUser);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
