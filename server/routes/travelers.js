import { Router } from 'express'
import { getTravelers, getTraveler, getTravelerByCard, updateTravelerPhoto } from '../controllers/travelerController.js'
import { authMiddleware } from '../middleware/auth.js'
import { db } from '../database/fileDb.js'

const router = Router()
router.get('/', authMiddleware, getTravelers)
router.get('/search', authMiddleware, (req, res) => { getTravelers(req, res) })
router.get('/card/:cardId', authMiddleware, getTravelerByCard)
router.get('/:id', authMiddleware, getTraveler)
router.post('/:id/photo', authMiddleware, updateTravelerPhoto)
router.post('/:id/photo-match', authMiddleware, (req, res) => {
  const travelerId = req.params.id
  const { match, confidence, source } = req.body || {}
  const travelers = db.getTravelers()
  const traveler = travelers.find(t => t.id === travelerId)
  if (!traveler) return res.status(404).json({ error: 'Traveler not found' })
  res.json({
    data: {
      id: traveler.id,
      full_name: traveler.full_name,
      match: !!match,
      confidence: confidence || 0,
      source: source || 'external',
      message: match ? 'Face match accepted' : 'Face match rejected'
    }
  })
})

export default router
