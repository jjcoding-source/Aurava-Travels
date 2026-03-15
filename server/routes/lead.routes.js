import express from 'express'
import {
  getAllLeads,
  createLead,
  updateLead,
  deleteLead,
  seedLeads,
} from '../controllers/lead.controller.js'
import { protect, agentOrAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/seed', seedLeads)
router.get('/', protect, agentOrAdmin, getAllLeads)
router.post('/', protect, agentOrAdmin, createLead)
router.put('/:id', protect, agentOrAdmin, updateLead)
router.delete('/:id', protect, agentOrAdmin, deleteLead)

export default router