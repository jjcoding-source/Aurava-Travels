import express from 'express'
import { getDashboardAnalytics } from '../controllers/analytics.controller.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/dashboard', protect, adminOnly, getDashboardAnalytics)

export default router