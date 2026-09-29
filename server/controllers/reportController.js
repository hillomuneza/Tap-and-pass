import { db } from '../database/fileDb.js'

export function getDailyReport(req, res) {
  const today = new Date().toISOString().split('T')[0]
  const todayCrossings = db.getCrossings().filter(c => c.created_at?.startsWith(today))
  const approved = todayCrossings.filter(c => c.status === 'approved').length
  const denied = todayCrossings.filter(c => c.status === 'denied').length
  const pending = todayCrossings.filter(c => c.status === 'pending').length
  res.json({
    date: today,
    total: todayCrossings.length,
    approved,
    denied,
    pending,
    approval_rate: todayCrossings.length ? Math.round((approved / todayCrossings.length) * 100) : 0
  })
}

export function getMonthlyReport(req, res) {
  const month = new Date().toISOString().slice(0, 7)
  const monthCrossings = db.getCrossings().filter(c => c.created_at?.startsWith(month))
  const approved = monthCrossings.filter(c => c.status === 'approved').length
  const denied = monthCrossings.filter(c => c.status === 'denied').length
  const pending = monthCrossings.filter(c => c.status === 'pending').length
  res.json({
    month,
    total: monthCrossings.length,
    approved,
    denied,
    pending,
    approval_rate: monthCrossings.length ? Math.round((approved / monthCrossings.length) * 100) : 0
  })
}

export function getCheckpointReport(req, res) {
  const checkpointId = Number(req.params.checkpointId)
  const crossings = db.getCrossings().filter(c => c.checkpoint_id === checkpointId)
  const approved = crossings.filter(c => c.status === 'approved').length
  const denied = crossings.filter(c => c.status === 'denied').length
  const pending = crossings.filter(c => c.status === 'pending').length
  res.json({
    checkpoint_id: checkpointId,
    total: crossings.length,
    approved,
    denied,
    pending,
    approval_rate: crossings.length ? Math.round((approved / crossings.length) * 100) : 0
  })
}
