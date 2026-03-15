import asyncHandler from 'express-async-handler'
import Booking from '../models/Booking.model.js'
import Tour from '../models/Tour.model.js'


export const createBooking = asyncHandler(async (req, res) => {
  const { tourId, departureDate, seatsBooked, travellers } = req.body

  if (!tourId || !departureDate || !seatsBooked) {
    res.status(400)
    throw new Error('Please provide tour, departure date and seats')
  }

  const tour = await Tour.findById(tourId)
  if (!tour) {
    res.status(404)
    throw new Error('Tour not found')
  }

  const departure = tour.departureDates.find(
    (d) => d.date === departureDate
  )
  if (!departure) {
    res.status(400)
    throw new Error('Selected departure date not found')
  }
  if (departure.seatsLeft < seatsBooked) {
    res.status(400)
    throw new Error(`Only ${departure.seatsLeft} seats available`)
  }

  
  const totalAmount = tour.price * seatsBooked

  const booking = await Booking.create({
    user: req.user._id,
    tour: tourId,
    departureDate,
    seatsBooked,
    totalAmount,
    travellers: travellers || [],
    paymentStatus: 'pending',
    bookingStatus: 'confirmed',
  })

  departure.seatsLeft -= seatsBooked
  tour.seatsAvailable -= seatsBooked
  await tour.save()

  const populatedBooking = await Booking.findById(booking._id)
    .populate('tour', 'title countries duration price image')
    .populate('user', 'name email phone')

  res.status(201).json({
    success: true,
    booking: populatedBooking,
  })
})


export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('tour', 'title countries duration price image badge')
    .sort({ createdAt: -1 })

  res.json({
    success: true,
    count: bookings.length,
    bookings,
  })
})


export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('tour', 'title countries duration price image')
    .populate('user', 'name email phone')

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }

  
  if (
    booking.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403)
    throw new Error('Not authorized to view this booking')
  }

  res.json({
    success: true,
    booking,
  })
})

export const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query

  const filter = {}
  if (status) filter.paymentStatus = status

  const total = await Booking.countDocuments(filter)
  const bookings = await Booking.find(filter)
    .populate('tour', 'title countries duration')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    bookings,
  })
})

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }

  booking.paymentStatus = 'paid'
  booking.paymentId = req.body.paymentId || 'manual'
  await booking.save()

  res.json({
    success: true,
    booking,
  })
})

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('tour')

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }

  if (
    booking.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403)
    throw new Error('Not authorized to cancel this booking')
  }

  if (booking.bookingStatus === 'cancelled') {
    res.status(400)
    throw new Error('Booking is already cancelled')
  }

  // Restore seats
  const tour = await Tour.findById(booking.tour._id)
  if (tour) {
    const departure = tour.departureDates.find(
      (d) => d.date === booking.departureDate
    )
    if (departure) {
      departure.seatsLeft += booking.seatsBooked
    }
    tour.seatsAvailable += booking.seatsBooked
    await tour.save()
  }

  booking.bookingStatus = 'cancelled'
  await booking.save()

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    booking,
  })
})