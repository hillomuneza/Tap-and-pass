import { Router } from 'express'
import { users } from '../models/data.js'

const router = Router()

router.post('/forgot-password', (req, res) => {
  const { email } = req.body
  const user = users.find(u => u.email === email && u.status === 'active')
  if (!user) {
    return res.status(404).json({ error: 'No active account found with that email' })
  }
  const resetToken = Math.random().toString(36).substring(2, 15)
  console.log(`Password reset token for ${email}: ${resetToken}`)
  return res.json({ message: 'Password reset link sent to email', resetToken })
})

router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' })
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  return res.json({ message: 'Password reset successful' })
})

export default router
