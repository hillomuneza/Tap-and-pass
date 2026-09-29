import { db } from '../database/fileDb.js'

export function getAlerts(req, res) {
  const alerts = db.getAlerts() || []
  res.json({ data: alerts })
}
