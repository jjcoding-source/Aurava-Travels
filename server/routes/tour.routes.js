import express from 'express'
import {
  getAllTours,
  getFeaturedTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  seedTours,
} from '../controllers/tour.controller.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllTours)
router.get('/featured', getFeaturedTours)
router.post('/seed', seedTours)
router.get('/:id', getTourById)

// Admin only routes
router.post('/', protect, adminOnly, createTour)
router.put('/:id', protect, adminOnly, updateTour)
router.delete('/:id', protect, adminOnly, deleteTour)

export default router