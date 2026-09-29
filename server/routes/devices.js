import { Router } from 'express'
import { getDevices, getDevice, updateDeviceStatus } from '../controllers/deviceController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.get('/', authMiddleware, getDevices)
router.get('/:id', authMiddleware, getDevice)
router.patch('/:id', authMiddleware, updateDeviceStatus)

export default router
