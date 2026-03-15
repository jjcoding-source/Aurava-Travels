import express from 'express'
import {
  getDashboardAnalytics,
  getReports,
} from '../controllers/analytics.controller.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/dashboard', protect, adminOnly, getDashboardAnalytics)
router.get('/reports', protect, adminOnly, getReports)

export default router