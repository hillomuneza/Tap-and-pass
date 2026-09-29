import { Router } from 'express'
import { cardDetected, getDeviceStatus, sendAllowCommand, sendDenyCommand, resetDevice } from '../controllers/hardwareController.js'

const router = Router()
router.post('/card-detected', cardDetected)
router.get('/status/:deviceId', getDeviceStatus)
router.post('/allow', sendAllowCommand)
router.post('/deny', sendDenyCommand)
router.post('/reset', resetDevice)

export default router
