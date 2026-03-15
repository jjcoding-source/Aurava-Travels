import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.model.js'

export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized — no token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    next()
  } catch (error) {
    res.status(401)
    throw new Error('Not authorized — token invalid or expired')
  }
})

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403)
    throw new Error('Access denied — admin only')
  }
}

export const agentOrAdmin = (req, res, next) => {
  if (req.user && ['admin', 'agent'].includes(req.user.role)) {
    next()
  } else {
    res.status(403)
    throw new Error('Access denied — agents and admins only')
  }
}