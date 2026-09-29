import { db } from '../database/fileDb.js'

const SETTINGS_FILE = 'settings.json'

function readSettings() {
  try {
    const raw = db.getSettings ? db.getSettings() : null
    if (raw) return raw
  } catch {
    // fallback
  }
  return {
    systemName: 'TAP & PASS',
    checkerAccessKey: '1234',
    offlineMode: true,
    defaultLanguage: 'en',
    dataRetentionDays: 90,
    autoSync: true
  }
}

function writeSettings(settings) {
  db.setSettings(settings)
}

export function getSettings(req, res) {
  const settings = readSettings()
  res.json({ data: settings })
}

export function updateSettings(req, res) {
  const updated = req.body
  const current = readSettings()
  const merged = { ...current, ...updated }
  writeSettings(merged)
  res.json({ data: merged })
}

export function exportBackup(req, res) {
  try {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: readSettings(),
      users: db.getUsers(),
      travelers: db.getTravelers(),
      crossings: db.getCrossings(),
      checkpoints: db.getCheckpoints(),
      devices: db.getDevices(),
      alerts: db.getAlerts(),
      auditLogs: db.getAuditLogs(),
      roles: db.getRoles(),
      departments: db.getDepartments()
    }
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="tap-and-pass-backup-${new Date().toISOString().slice(0, 10)}.json"`)
    res.send(JSON.stringify(backup, null, 2))
  } catch (err) {
    res.status(500).json({ error: 'Failed to export backup' })
  }
}

export function importBackup(req, res) {
  try {
    const payload = req.body
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid backup file' })
    }
    if (payload.users) db.setUsers(payload.users)
    if (payload.travelers) db.setTravelers(payload.travelers)
    if (payload.crossings) db.setCrossings(payload.crossings)
    if (payload.checkpoints) db.setCheckpoints(payload.checkpoints)
    if (payload.devices) db.setDevices(payload.devices)
    if (payload.alerts) db.setAlerts(payload.alerts)
    if (payload.auditLogs) db.setAuditLogs(payload.auditLogs)
    if (payload.roles) db.setRoles(payload.roles)
    if (payload.departments) db.setDepartments(payload.departments)
    if (payload.settings) writeSettings(payload.settings)
    res.json({ data: { message: 'Backup imported successfully' } })
  } catch (err) {
    res.status(500).json({ error: 'Failed to import backup' })
  }
}
