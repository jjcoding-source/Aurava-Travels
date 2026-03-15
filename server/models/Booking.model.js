import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    departureDate: {
      type: String,
      required: true,
    },
    seatsBooked: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: {
      type: String,
      default: '',
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    travellers: [
      {
        name: String,
        age: Number,
        passportNumber: String,
      },
    ],
  },
  { timestamps: true }
)

const Booking = mongoose.model('Booking', bookingSchema)
export default Booking