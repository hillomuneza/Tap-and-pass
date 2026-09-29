import { Router } from 'express'
import { getDailyReport, getMonthlyReport, getCheckpointReport } from '../controllers/reportController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.get('/daily', authMiddleware, getDailyReport)
router.get('/monthly', authMiddleware, getMonthlyReport)
router.get('/checkpoint/:checkpointId', authMiddleware, getCheckpointReport)

export default router
