import { db } from '../database/fileDb.js'
import { publishAllow, publishDeny, publishReset, isMQTTConnected } from '../hardware/mqtt.js'

export function cardDetected(req, res) {
  const { card_id, device_id } = req.body
  const devices = db.getDevices()
  const device = devices.find(d => d.id === device_id)
  if (!device) return res.status(404).json({ error: 'Device not found' })
  device.last_seen = new Date().toISOString()
  db.setDevices(devices)
  return res.json({ status: 'ok', message: 'Card detected', device_id, mqtt: isMQTTConnected() })
}

export function getDeviceStatus(req, res) {
  const device = db.getDevices().find(d => d.id === req.params.deviceId)
  if (!device) return res.status(404).json({ error: 'Device not found' })
  return res.json({ data: device })
}

export function sendAllowCommand(req, res) {
  const { device_id } = req.body
  const devices = db.getDevices()
  const device = devices.find(d => d.id === device_id)
  if (!device) return res.status(404).json({ error: 'Device not found' })
  device.last_seen = new Date().toISOString()
  db.setDevices(devices)
  const mqttSent = publishAllow(device_id)
  return res.json({ status: 'ok', command: 'ALLOW', device_id, mqtt: mqttSent })
}

export function sendDenyCommand(req, res) {
  const { device_id, reason } = req.body
  const devices = db.getDevices()
  const device = devices.find(d => d.id === device_id)
  if (!device) return res.status(404).json({ error: 'Device not found' })
  device.last_seen = new Date().toISOString()
  db.setDevices(devices)
  const mqttSent = publishDeny(device_id, reason)
  return res.json({ status: 'ok', command: 'DENY', device_id, mqtt: mqttSent })
}

export function resetDevice(req, res) {
  const { device_id } = req.body
  const devices = db.getDevices()
  const device = devices.find(d => d.id === device_id)
  if (!device) return res.status(404).json({ error: 'Device not found' })
  device.last_seen = new Date().toISOString()
  db.setDevices(devices)
  const mqttSent = publishReset(device_id)
  return res.json({ status: 'ok', command: 'RESET', device_id, mqtt: mqttSent })
}
