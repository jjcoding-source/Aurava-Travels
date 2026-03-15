import asyncHandler from 'express-async-handler'
import Lead from '../models/Lead.model.js'
import User from '../models/User.model.js'


export const getAllLeads = asyncHandler(async (req, res) => {
  const { status, agent, search } = req.query

  const filter = {}

  if (req.user.role === 'agent') {
    filter.assignedAgent = req.user._id
  }

  if (status) filter.status = status
  if (agent && req.user.role === 'admin') {
    const agentUser = await User.findOne({ name: new RegExp(agent, 'i') })
    if (agentUser) filter.assignedAgent = agentUser._id
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { destination: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }

  const leads = await Lead.find(filter)
    .populate('assignedAgent', 'name email')
    .sort({ createdAt: -1 })

  const grouped = {
    new: [],
    contacted: [],
    interested: [],
    booked: [],
    lost: [],
  }

  leads.forEach((lead) => {
    if (grouped[lead.status]) {
      grouped[lead.status].push(lead)
    }
  })

  res.json({
    success: true,
    total: leads.length,
    leads,
    grouped,
  })
})

export const createLead = asyncHandler(async (req, res) => {
  const {
    name, email, phone, destination,
    month, budget, source, agent, notes,
  } = req.body

  if (!name || !destination) {
    res.status(400)
    throw new Error('Name and destination are required')
  }

  let assignedAgent = req.user._id
  if (agent && req.user.role === 'admin') {
    const agentUser = await User.findOne({
      role: { $in: ['agent', 'admin'] },
      $or: [
        { _id: agent },
        { name: new RegExp(agent, 'i') },
      ],
    })
    if (agentUser) assignedAgent = agentUser._id
  }

  const lead = await Lead.create({
    name,
    email,
    phone,
    destination,
    month,
    budget,
    source: source || 'Website',
    status: 'new',
    assignedAgent,
    isHot: false,
    notes: notes ? [{ text: notes, addedBy: req.user.name }] : [],
  })

  const populatedLead = await Lead.findById(lead._id)
    .populate('assignedAgent', 'name email')

  res.status(201).json({
    success: true,
    lead: populatedLead,
  })
})

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id)

  if (!lead) {
    res.status(404)
    throw new Error('Lead not found')
  }

  const { status, isHot, notes, followUpDate, budget, month } = req.body

  if (status) lead.status = status
  if (typeof isHot === 'boolean') lead.isHot = isHot
  if (followUpDate) lead.followUpDate = followUpDate
  if (budget) lead.budget = budget
  if (month) lead.month = month

  if (notes) {
    lead.notes.push({
      text: notes,
      addedBy: req.user.name,
      addedAt: new Date(),
    })
  }

  await lead.save()

  const updatedLead = await Lead.findById(lead._id)
    .populate('assignedAgent', 'name email')

  res.json({
    success: true,
    lead: updatedLead,
  })
})


export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id)

  if (!lead) {
    res.status(404)
    throw new Error('Lead not found')
  }

  await lead.deleteOne()

  res.json({
    success: true,
    message: 'Lead deleted successfully',
  })
})


export const seedLeads = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403)
    throw new Error('Seeding not allowed in production')
  }

  // Find agents
  const agents = await User.find({ role: { $in: ['agent', 'admin'] } })
  if (agents.length === 0) {
    res.status(400)
    throw new Error('No agents found — seed users first')
  }

  const agentId = agents[0]._id

  await Lead.deleteMany({})

  await Lead.insertMany([
    { name: 'Nisha Gupta', email: 'nisha@email.com', phone: '9876543210', destination: 'Dubai', month: 'Sep 2025', budget: '1.2L', source: 'WhatsApp', status: 'new', assignedAgent: agentId, isHot: false, notes: [{ text: 'Interested in 5-day package', addedBy: 'System' }] },
    { name: 'Suresh Pillai', email: 'suresh@email.com', phone: '9823456781', destination: 'Singapore', month: 'Oct 2025', budget: '1.5L', source: 'Facebook Ad', status: 'new', assignedAgent: agentId, isHot: false, notes: [{ text: 'Family trip with 2 kids', addedBy: 'System' }] },
    { name: 'Divya Menon', email: 'divya@email.com', phone: '9345678901', destination: 'Japan', month: 'Mar 2026', budget: '2.5L', source: 'Phone', status: 'contacted', assignedAgent: agentId, isHot: true, notes: [{ text: 'Couple trip for anniversary', addedBy: 'System' }] },
    { name: 'Kiran Bhat', email: 'kiran@email.com', phone: '9456789012', destination: 'Switzerland', month: 'Jan 2026', budget: '2L', source: 'WhatsApp', status: 'contacted', assignedAgent: agentId, isHot: false, notes: [{ text: 'Honeymoon package inquiry', addedBy: 'System' }] },
    { name: 'Ankit Sharma', email: 'ankit@email.com', phone: '9678901234', destination: 'Europe', month: 'Sep 2025', budget: '2.5L', source: 'Referral', status: 'interested', assignedAgent: agentId, isHot: true, notes: [{ text: 'Group of 4 friends', addedBy: 'System' }] },
    { name: 'Rohan Das', email: 'rohan@email.com', phone: '9789012345', destination: 'Switzerland', month: 'Aug 2025', budget: '2L', source: 'Referral', status: 'interested', assignedAgent: agentId, isHot: false, notes: [{ text: 'Solo trip planned', addedBy: 'System' }] },
    { name: 'Saurabh Jain', email: 'saurabh@email.com', phone: '9890123456', destination: 'Maldives', month: 'Jul 2025', budget: '3.2L', source: 'Website', status: 'booked', assignedAgent: agentId, isHot: false, notes: [{ text: 'Paid in full', addedBy: 'System' }] },
    { name: 'Rahul Sharma', email: 'rahul@email.com', phone: '9901234567', destination: 'Europe', month: 'Jun 2025', budget: '5L', source: 'Referral', status: 'booked', assignedAgent: agentId, isHot: false, notes: [{ text: 'Departure confirmed 15 Jun', addedBy: 'System' }] },
    { name: 'Vijay Kumar', email: 'vijay@email.com', phone: '9123456780', destination: 'Europe', month: 'Jun 2025', budget: '2L', source: 'Website', status: 'lost', assignedAgent: agentId, isHot: false, notes: [{ text: 'Said too expensive', addedBy: 'System' }] },
    { name: 'Geeta Mishra', email: 'geeta@email.com', phone: '9234567891', destination: 'Japan', month: 'Aug 2025', budget: '2.2L', source: 'Facebook Ad', status: 'lost', assignedAgent: agentId, isHot: false, notes: [{ text: 'Booked with another agency', addedBy: 'System' }] },
  ])

  res.status(201).json({
    success: true,
    message: '10 demo leads seeded',
  })
})