import { WebSocketServer, WebSocket } from 'ws'
import { borderCrossings, travelers, devices } from '../models/data.js'

const WS_PORT = Number(process.env.WS_PORT || 4002)
const clients = new Set()

let wss = null

try {
  wss = new WebSocketServer({ port: WS_PORT })
  wss.on('error', (err) => {
    if (err?.code === 'EADDRINUSE') {
      console.warn(`WebSocket port ${WS_PORT} is already in use. Continuing without hardware WebSocket listeners.`)
    } else {
      console.warn('WebSocket server error:', err.message)
    }
    wss = null
  })
  wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress
    clients.add(ws)
    console.log(`WebSocket client connected from ${ip}`)

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString())
        handleMessage(ws, message)
      } catch (err) {
        sendError(ws, 'Invalid message format')
      }
    })

    ws.on('close', () => {
      clients.delete(ws)
      console.log('WebSocket client disconnected')
    })

    ws.on('error', (err) => {
      console.error('WebSocket error:', err)
      clients.delete(ws)
    })
  })
} catch (err) {
  if (err && err.code === 'EADDRINUSE') {
    console.warn(`WebSocket port ${WS_PORT} is already in use. Continuing without hardware WebSocket listeners.`)
  } else {
    console.warn('WebSocket server failed to start:', err.message)
  }
}

function broadcast(data) {
  if (!wss) return
  const payload = JSON.stringify(data)
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload)
    }
  })
}

function sendTo(ws, data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data))
  }
}

function sendError(ws, message) {
  sendTo(ws, { type: 'error', message })
}

function handleMessage(ws, message) {
  const { type, payload } = message

  switch (type) {
    case 'ping':
      sendTo(ws, { type: 'pong', timestamp: new Date().toISOString() })
      break

    case 'card_detected': {
      const { card_id, device_id } = payload
      const traveler = travelers.find(t => t.id === card_id)
      const device = devices.find(d => d.id === device_id)

      if (!traveler) {
        sendTo(ws, { type: 'card_not_found', card_id, device_id })
        broadcast({
          type: 'alert',
          payload: {
            type: 'invalid_card',
            severity: 'warning',
            message: `Card ${card_id} not recognized`,
            card_id,
            device_id,
            timestamp: new Date().toISOString()
          }
        })
        break
      }

      if (!device) {
        sendTo(ws, { type: 'device_not_found', device_id })
        break
      }

      device.last_seen = new Date().toISOString()

      const crossing = {
        id: `TP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(borderCrossings.length + 422).padStart(5, '0')}`,
        traveler_id: traveler.id,
        card_id: traveler.id,
        officer_id: null,
        department_id: null,
        checkpoint_id: device.checkpoint_id,
        direction: 'entry',
        status: 'pending',
        decision_reason: null,
        created_at: new Date().toISOString(),
        decision_at: null
      }
      borderCrossings.push(crossing)

      sendTo(ws, {
        type: 'traveler_found',
        payload: {
          traveler,
          crossing,
          device
        }
      })

      broadcast({
        type: 'crossing_created',
        payload: {
          crossing_id: crossing.id,
          traveler_name: traveler.full_name,
          checkpoint_id: device.checkpoint_id,
          timestamp: crossing.created_at
        }
      })
      break
    }

    case 'allow': {
      const { crossing_id, device_id } = payload
      const crossing = borderCrossings.find(c => c.id === crossing_id)
      const device = devices.find(d => d.id === device_id)

      if (crossing && crossing.status === 'pending') {
        crossing.status = 'approved'
        crossing.decision_at = new Date().toISOString()
      }

      if (device) {
        device.last_seen = new Date().toISOString()
      }

      broadcast({
        type: 'signal',
        payload: {
          command: 'ALLOW',
          crossing_id,
          device_id,
          timestamp: new Date().toISOString()
        }
      })

      sendTo(ws, {
        type: 'decision_confirmed',
        payload: {
          crossing_id,
          status: 'approved',
          command: 'ALLOW'
        }
      })
      break
    }

    case 'deny': {
      const { crossing_id, device_id, reason } = payload
      const crossing = borderCrossings.find(c => c.id === crossing_id)
      const device = devices.find(d => d.id === device_id)

      if (crossing && crossing.status === 'pending') {
        crossing.status = 'denied'
        crossing.decision_reason = reason || 'Denied by officer'
        crossing.decision_at = new Date().toISOString()
      }

      if (device) {
        device.last_seen = new Date().toISOString()
      }

      broadcast({
        type: 'signal',
        payload: {
          command: 'DENY',
          crossing_id,
          device_id,
          reason,
          timestamp: new Date().toISOString()
        }
      })

      sendTo(ws, {
        type: 'decision_confirmed',
        payload: {
          crossing_id,
          status: 'denied',
          command: 'DENY',
          reason
        }
      })
      break
    }

    case 'reset': {
      const { device_id } = payload
      const device = devices.find(d => d.id === device_id)
      if (device) {
        device.last_seen = new Date().toISOString()
      }

      broadcast({
        type: 'signal',
        payload: {
          command: 'RESET',
          device_id,
          timestamp: new Date().toISOString()
        }
      })
      break
    }

    case 'device_status': {
      const { device_id, status } = payload
      const device = devices.find(d => d.id === device_id)
      if (device) {
        device.status = status
        device.last_seen = new Date().toISOString()
        broadcast({
          type: 'device_update',
          payload: {
            device_id,
            status,
            last_seen: device.last_seen
          }
        })
      }
      break
    }

    default:
      sendError(ws, `Unknown message type: ${type}`)
  }
}

export function broadcastCardDetected(cardId, deviceId) {
  const traveler = travelers.find(t => t.id === cardId)
  if (!traveler) return
  broadcast({
    type: 'card_detected',
    payload: {
      card_id: cardId,
      device_id: deviceId,
      traveler,
      timestamp: new Date().toISOString()
    }
  })
}

export function getConnectedClientsCount() {
  return clients.size
}

export function getWebSocketStatus() {
  return { status: wss ? 'ok' : 'unavailable', port: WS_PORT }
}

export { wss }
