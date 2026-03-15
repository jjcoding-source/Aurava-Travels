import express from 'express'
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  seedDemoUsers,
  getAllUsers,
  toggleUserStatus,
  createAgent,
} from '../controllers/auth.controller.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/seed', seedDemoUsers)

// Private routes
router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)

// Admin only routes
router.get('/users', protect, adminOnly, getAllUsers)
router.put('/users/:id/toggle', protect, adminOnly, toggleUserStatus)
router.post('/agents', protect, adminOnly, createAgent)

export default router