import { db } from '../database/fileDb.js'

export function getAuditLogs(req, res) {
  const { user_id, action, resource, date_from, date_to } = req.query
  let results = [...db.getAuditLogs()]
  if (user_id) results = results.filter(l => l.user_id === Number(user_id))
  if (action) results = results.filter(l => l.action === action)
  if (resource) results = results.filter(l => l.resource === resource)
  if (date_from) results = results.filter(l => l.timestamp >= date_from)
  if (date_to) results = results.filter(l => l.timestamp <= date_to)
  results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  res.json({ data: results, total: results.length })
}

export function createAuditLog(req, res) {
  const logs = db.getAuditLogs()
  const log = {
    id: logs.length + 1,
    ...req.body,
    timestamp: new Date().toISOString()
  }
  logs.push(log)
  db.setAuditLogs(logs)
  res.status(201).json({ data: log })
}
