import { Router } from 'express'
import { createCrossing, getCrossings, approveCrossing, denyCrossing, overrideCrossing } from '../controllers/crossingController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.get('/', authMiddleware, getCrossings)
router.post('/', authMiddleware, createCrossing)
router.post('/:id/approve', authMiddleware, approveCrossing)
router.post('/:id/deny', authMiddleware, denyCrossing)
router.post('/:id/override', authMiddleware, overrideCrossing)

export default router
