import { Router } from 'express'
import { getSettings, updateSettings, exportBackup, importBackup } from '../controllers/settingController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.get('/', authMiddleware, getSettings)
router.put('/', authMiddleware, updateSettings)
router.post('/', authMiddleware, updateSettings)
router.get('/backup', authMiddleware, exportBackup)
router.post('/restore', authMiddleware, importBackup)

export default router
