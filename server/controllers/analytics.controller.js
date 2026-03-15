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

export const getReports = asyncHandler(async (req, res) => {

  // Revenue by category 
  const revenueByCategory = await Booking.aggregate([
    { $match: { paymentStatus: 'paid' } },
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
        _id: '$tourData.category',
        revenue: { $sum: '$totalAmount' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
  ])

  // Bookings by month 
  const bookingsByMonth = await Booking.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        bookings: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ])

  const MONTH_NAMES = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]

  const formattedBookingsByMonth = bookingsByMonth.map((m) => ({
    month: MONTH_NAMES[m._id.month],
    bookings: m.bookings,
    revenue: Math.round(m.revenue / 100000 * 10) / 10,
  }))

  const bookingsChartData = formattedBookingsByMonth.length > 0
    ? formattedBookingsByMonth
    : [
        { month: 'Jan', bookings: 8, revenue: 12 },
        { month: 'Feb', bookings: 10, revenue: 15 },
        { month: 'Mar', bookings: 14, revenue: 18 },
        { month: 'Apr', bookings: 11, revenue: 14 },
        { month: 'May', bookings: 16, revenue: 21 },
        { month: 'Jun', bookings: 20, revenue: 25 },
        { month: 'Jul', bookings: 17, revenue: 22 },
        { month: 'Aug', bookings: 23, revenue: 28 },
      ]

  // Payment status breakdown
  const paymentBreakdown = await Booking.aggregate([
    {
      $group: {
        _id: '$paymentStatus',
        count: { $sum: 1 },
        amount: { $sum: '$totalAmount' },
      },
    },
  ])

  //  Top tours by bookings 
  const topTours = await Booking.aggregate([
    {
      $group: {
        _id: '$tour',
        bookings: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { bookings: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'tours',
        localField: '_id',
        foreignField: '_id',
        as: 'tourData',
      },
    },
    { $unwind: '$tourData' },
    {
      $project: {
        title: '$tourData.title',
        bookings: 1,
        revenue: 1,
      },
    },
  ])

  // Leads by source 
  const leadsBySource = await Lead.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ])

  // Leads conversion funnel
  const leadsFunnel = await Lead.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  const funnelOrder = ['new', 'contacted', 'interested', 'booked', 'lost']
  const formattedFunnel = funnelOrder.map((status) => ({
    status,
    count: leadsFunnel.find((f) => f._id === status)?.count || 0,
  }))

  // Agent performance 
  const agentPerformance = await Lead.aggregate([
    {
      $group: {
        _id: '$assignedAgent',
        total: { $sum: 1 },
        booked: {
          $sum: { $cond: [{ $eq: ['$status', 'booked'] }, 1, 0] },
        },
        lost: {
          $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'agentData',
      },
    },
    { $unwind: '$agentData' },
    {
      $project: {
        name: '$agentData.name',
        total: 1,
        booked: 1,
        lost: 1,
        conversionRate: {
          $round: [
            { $multiply: [{ $divide: ['$booked', '$total'] }, 100] },
            0,
          ],
        },
      },
    },
    { $sort: { booked: -1 } },
  ])

  res.json({
    success: true,
    revenueByCategory,
    bookingsChartData,
    paymentBreakdown,
    topTours,
    leadsBySource,
    leadsFunnel: formattedFunnel,
    agentPerformance,
  })
})