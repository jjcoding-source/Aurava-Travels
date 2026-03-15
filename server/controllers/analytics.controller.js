import asyncHandler from 'express-async-handler'
import Booking from '../models/Booking.model.js'
import Tour from '../models/Tour.model.js'
import Lead from '../models/Lead.model.js'
import User from '../models/User.model.js'


export const getDashboardAnalytics = asyncHandler(async (req, res) => {

  const revenueResult = await Booking.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ])
  const totalRevenue = revenueResult[0]?.total || 0

  const totalBookings = await Booking.countDocuments()
  const paidBookings = await Booking.countDocuments({ paymentStatus: 'paid' })

  const totalLeads = await Lead.countDocuments()
  const bookedLeads = await Lead.countDocuments({ status: 'booked' })
  const activeLeads = await Lead.countDocuments({
    status: { $in: ['new', 'contacted', 'interested'] },
  })
  const conversionRate = totalLeads > 0
    ? Math.round((bookedLeads / totalLeads) * 100)
    : 0

  const monthlyRevenue = await Booking.aggregate([
    { $match: { paymentStatus: 'paid' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalAmount' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 8 },
  ])

  const MONTH_NAMES = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]

  const formattedMonthly = monthlyRevenue.map((m) => ({
    month: MONTH_NAMES[m._id.month],
    revenue: Math.round(m.revenue / 100000 * 10) / 10,
    bookings: m.bookings,
  }))

  const chartData = formattedMonthly.length > 0
    ? formattedMonthly
    : [
        { month: 'Jan', revenue: 12, bookings: 8 },
        { month: 'Feb', revenue: 15, bookings: 10 },
        { month: 'Mar', revenue: 18, bookings: 14 },
        { month: 'Apr', revenue: 14, bookings: 11 },
        { month: 'May', revenue: 21, bookings: 16 },
        { month: 'Jun', revenue: 25, bookings: 20 },
        { month: 'Jul', revenue: 22, bookings: 17 },
        { month: 'Aug', revenue: 28, bookings: 23 },
      ]

  const topDestinations = await Booking.aggregate([
    {
      $lookup: {
        from: 'tours',
        localField: 'tour',
        foreignField: '_id',
        as: 'tourData',
      },
    },
    { $unwind: '$tourData' },
    {
      $group: {
        _id: { $arrayElemAt: ['$tourData.countries', 0] },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { bookings: -1 } },
    { $limit: 6 },
  ])

  const formattedDestinations = topDestinations.length > 0
    ? topDestinations.map((d) => ({
        name: d._id,
        bookings: d.bookings,
      }))
    : [
        { name: 'Switzerland', bookings: 120 },
        { name: 'France', bookings: 95 },
        { name: 'Italy', bookings: 80 },
        { name: 'Japan', bookings: 65 },
        { name: 'Maldives', bookings: 52 },
        { name: 'Dubai', bookings: 42 },
      ]

  const recentBookings = await Booking.find()
    .populate('user', 'name email')
    .populate('tour', 'title countries')
    .sort({ createdAt: -1 })
    .limit(5)

  const recentLeads = await Lead.find()
    .populate('assignedAgent', 'name')
    .sort({ createdAt: -1 })
    .limit(5)

  const totalCustomers = await User.countDocuments({ role: 'customer' })

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalBookings,
      paidBookings,
      totalLeads,
      activeLeads,
      bookedLeads,
      conversionRate,
      totalCustomers,
    },
    chartData,
    topDestinations: formattedDestinations,
    recentBookings,
    recentLeads,
  })
})