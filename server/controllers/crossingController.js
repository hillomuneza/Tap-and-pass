import { db } from '../database/fileDb.js'
import { generateId } from '../utils/helpers.js'

export function getCrossings(req, res) {
  const { status, checkpoint_id, officer_id, date_from, date_to } = req.query
  let results = [...db.getCrossings()]
  if (status) results = results.filter(c => c.status === status)
  if (checkpoint_id) results = results.filter(c => c.checkpoint_id === Number(checkpoint_id))
  if (officer_id) results = results.filter(c => c.officer_id === Number(officer_id))
  if (date_from) results = results.filter(c => c.created_at >= date_from)
  if (date_to) results = results.filter(c => c.created_at <= date_to)
  results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  res.json({ data: results, total: results.length })
}

export function getCrossing(req, res) {
  const crossing = db.getCrossings().find(c => c.id === req.params.id)
  if (!crossing) return res.status(404).json({ error: 'Crossing not found' })
  res.json({ data: crossing })
}

export function approveCrossing(req, res) {
  const { reason } = req.body
  const crossings = db.getCrossings()
  const crossing = crossings.find(c => c.id === req.params.id)
  if (!crossing) return res.status(404).json({ error: 'Crossing not found' })
  if (crossing.status !== 'pending') return res.status(400).json({ error: 'Crossing already decided' })
  crossing.status = 'approved'
  crossing.decision_reason = reason || 'Verified identity'
  crossing.decision_at = new Date().toISOString()
  crossing.decided_by = req.user?.id || null
  db.setCrossings(crossings)
  res.json({ data: crossing })
}

export function denyCrossing(req, res) {
  const { reason } = req.body
  if (!reason) return res.status(400).json({ error: 'Reason is required for denial' })
  const crossings = db.getCrossings()
  const crossing = crossings.find(c => c.id === req.params.id)
  if (!crossing) return res.status(404).json({ error: 'Crossing not found' })
  if (crossing.status !== 'pending') return res.status(400).json({ error: 'Crossing already decided' })
  crossing.status = 'denied'
  crossing.decision_reason = reason
  crossing.decision_at = new Date().toISOString()
  crossing.decided_by = req.user?.id || null
  db.setCrossings(crossings)
  res.json({ data: crossing })
}

export function overrideCrossing(req, res) {
  const { reason, newStatus } = req.body
  if (!newStatus || !['approved', 'denied'].includes(newStatus)) {
    return res.status(400).json({ error: 'Valid newStatus is required: approved or denied' })
  }
  if (!reason) return res.status(400).json({ error: 'Reason is required for override' })
  const crossings = db.getCrossings()
  const crossing = crossings.find(c => c.id === req.params.id)
  if (!crossing) return res.status(404).json({ error: 'Crossing not found' })
  if (crossing.status === newStatus) return res.status(400).json({ error: `Crossing is already ${newStatus}` })
  crossing.status = newStatus
  crossing.decision_reason = reason
  crossing.decision_at = new Date().toISOString()
  crossing.overridden_by = req.user?.id || null
  crossing.overridden_at = new Date().toISOString()
  db.setCrossings(crossings)
  res.json({ data: crossing })
}

export function createCrossing(req, res) {
  const { traveler_id, card_id, checkpoint_id, direction } = req.body
  if (!traveler_id || !card_id || !checkpoint_id) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const newCrossing = {
    id: generateId('TP'),
    traveler_id,
    card_id,
    officer_id: req.user?.id || null,
    department_id: req.user?.department_id || null,
    checkpoint_id: Number(checkpoint_id),
    direction: direction || 'entry',
    status: 'pending',
    decision_reason: null,
    created_at: new Date().toISOString(),
    decision_at: null
  }
  const crossings = db.getCrossings()
  crossings.push(newCrossing)
  db.setCrossings(crossings)
  res.status(201).json({ data: newCrossing })
}
