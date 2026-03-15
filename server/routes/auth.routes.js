import express from 'express'
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  seedDemoUsers,
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/seed', seedDemoUsers)

router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)

export default router