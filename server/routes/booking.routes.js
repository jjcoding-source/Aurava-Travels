import express from 'express'
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updatePaymentStatus,
  cancelBooking,
} from '../controllers/booking.controller.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, createBooking)
router.get('/my', protect, getMyBookings)
router.get('/:id', protect, getBookingById)
router.put('/:id/pay', protect, updatePaymentStatus)
router.put('/:id/cancel', protect, cancelBooking)

router.get('/', protect, adminOnly, getAllBookings)

export default router