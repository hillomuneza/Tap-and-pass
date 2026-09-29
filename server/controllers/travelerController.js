import { db } from '../database/fileDb.js'
import { isExpired } from '../utils/helpers.js'

export function getTravelers(req, res) {
  const { search, query, nationality, status } = req.query
  const term = (search ?? query ?? '').toString().trim()
  let results = [...db.getTravelers()]
  if (term) {
    const q = term.toLowerCase()
    results = results.filter(t =>
      (t.full_name || '').toLowerCase().includes(q) ||
      (t.id || '').toLowerCase().includes(q) ||
      (t.passport_number || '').toLowerCase().includes(q)
    )
  }
  if (nationality) {
    results = results.filter(t => t.nationality.toLowerCase() === nationality.toLowerCase())
  }
  if (status) {
    results = results.filter(t => t.status === status)
  }
  res.json({ data: results, total: results.length })
}

export function getTraveler(req, res) {
  const traveler = db.getTravelers().find(t => t.id === req.params.id)
  if (!traveler) return res.status(404).json({ error: 'Traveler not found' })
  const docExpired = isExpired(traveler.passport_expiry)
  res.json({ data: { ...traveler, document_expired: docExpired } })
}

export function getTravelerByCard(req, res) {
  const traveler = db.getTravelers().find(t => t.id === req.params.cardId)
  if (!traveler) return res.status(404).json({ error: 'Card not recognized' })
  const docExpired = isExpired(traveler.passport_expiry)
  res.json({ data: { ...traveler, document_expired: docExpired } })
}

export function registerTraveler(req, res) {
  const { card_id, full_name, date_of_birth, nationality, passport_number, passport_expiry } = req.body
  if (!card_id || !full_name || !passport_number) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const travelers = db.getTravelers()
  if (travelers.find(t => t.id === card_id)) {
    return res.status(409).json({ error: 'Card already registered' })
  }
  const newTraveler = {
    id: card_id,
    full_name,
    date_of_birth,
    nationality,
    passport_number,
    passport_expiry,
    photo: null,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  travelers.push(newTraveler)
  db.setTravelers(travelers)
  res.status(201).json({ data: newTraveler })
}

export function updateTravelerPhoto(req, res) {
  const travelerId = req.params.id
  const { photo } = req.body
  const travelers = db.getTravelers()
  const traveler = travelers.find(t => t.id === travelerId)
  if (!traveler) return res.status(404).json({ error: 'Traveler not found' })
  traveler.photo = photo
  traveler.updated_at = new Date().toISOString()
  db.setTravelers(travelers)
  res.json({ data: traveler })
}
