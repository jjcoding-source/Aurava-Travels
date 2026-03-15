import asyncHandler from 'express-async-handler'
import User from '../models/User.model.js'
import generateToken from '../utils/generateToken.js'

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please provide name, email and password')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User with this email already exists')
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'customer',
  })

  if (user) {
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id, user.role),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide email and password')
  }

  const user = await User.findOne({ email })

  if (!user) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  if (!user.isActive) {
    res.status(401)
    throw new Error('Your account has been deactivated')
  }

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token: generateToken(user._id, user.role),
  })
})

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.json({
    success: true,
    user,
  })
})

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  user.name = req.body.name || user.name
  user.phone = req.body.phone || user.phone

  if (req.body.password) {
    if (req.body.password.length < 6) {
      res.status(400)
      throw new Error('Password must be at least 6 characters')
    }
    user.password = req.body.password
  }

  const updatedUser = await user.save()

  res.json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
    },
    token: generateToken(updatedUser._id, updatedUser.role),
  })
})

export const seedDemoUsers = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403)
    throw new Error('Seeding not allowed in production')
  }

  await User.deleteMany({
    email: {
      $in: [
        'admin@aurava.in',
        'agent@aurava.in',
        'customer@aurava.in',
      ],
    },
  })

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@aurava.in',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
  })

  const agent = await User.create({
    name: 'Sales Agent',
    email: 'agent@aurava.in',
    password: 'agent123',
    phone: '9876543211',
    role: 'agent',
  })

  const customer = await User.create({
    name: 'Demo Customer',
    email: 'customer@aurava.in',
    password: 'customer123',
    phone: '9876543212',
    role: 'customer',
  })

  res.status(201).json({
    success: true,
    message: '3 demo users created',
    users: [
      { name: admin.name, email: admin.email, role: admin.role },
      { name: agent.name, email: agent.email, role: agent.role },
      { name: customer.name, email: customer.email, role: customer.role },
    ],
  })
})

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query

  const filter = {}
  if (role) filter.role = role
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }

  const total = await User.countDocuments(filter)
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    users,
  })
})

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (user.role === 'admin') {
    res.status(400)
    throw new Error('Cannot deactivate admin account')
  }

  user.isActive = !user.isActive
  await user.save()

  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  })
})


export const createAgent = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please provide name, email and password')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User with this email already exists')
  }

  const agent = await User.create({
    name,
    email,
    phone,
    password,
    role: 'agent',
  })

  res.status(201).json({
    success: true,
    user: {
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
    },
  })
})