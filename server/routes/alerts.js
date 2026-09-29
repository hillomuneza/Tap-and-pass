import { Router } from 'express'
import { getAlerts } from '../controllers/alertController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.get('/', authMiddleware, getAlerts)

export default router
