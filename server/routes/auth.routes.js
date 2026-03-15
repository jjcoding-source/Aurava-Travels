import express from 'express'
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  seedDemoUsers,
  getAllUsers,
  toggleUserStatus,
} from '../controllers/auth.controller.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/seed', seedDemoUsers)

router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)

router.get('/users', protect, adminOnly, getAllUsers)
router.put('/users/:id/toggle', protect, adminOnly, toggleUserStatus)

export default router