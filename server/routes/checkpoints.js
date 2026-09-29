import { Router } from 'express'
import { getCheckpoints, getCheckpoint } from '../controllers/checkpointController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.get('/', authMiddleware, getCheckpoints)
router.get('/:id', authMiddleware, getCheckpoint)

export default router
