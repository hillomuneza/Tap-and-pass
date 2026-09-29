import { db } from '../database/fileDb.js'

export function getDevices(req, res) {
  res.json({ data: db.getDevices() })
}

export function getDevice(req, res) {
  const device = db.getDevices().find(d => d.id === req.params.id)
  if (!device) return res.status(404).json({ error: 'Device not found' })
  res.json({ data: device })
}

export function updateDeviceStatus(req, res) {
  const devices = db.getDevices()
  const device = devices.find(d => d.id === req.params.id)
  if (!device) return res.status(404).json({ error: 'Device not found' })
  device.status = req.body.status || device.status
  device.last_seen = new Date().toISOString()
  db.setDevices(devices)
  res.json({ data: device })
}
