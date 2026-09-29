import { Router } from 'express'
import { getAuditLogs, createAuditLog } from '../controllers/auditController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.get('/', authMiddleware, getAuditLogs)
router.post('/', authMiddleware, createAuditLog)

export default router
