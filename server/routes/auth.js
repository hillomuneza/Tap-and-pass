import { Router } from 'express'
import { login, logout, checkerLogin } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.post('/login', login)
router.post('/checker-login', checkerLogin)
router.post('/logout', authMiddleware, logout)

export default router
