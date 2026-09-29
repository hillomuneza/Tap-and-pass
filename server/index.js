import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import authRoutes from './routes/auth.js'
import travelerRoutes from './routes/travelers.js'
import crossingRoutes from './routes/crossings.js'
import checkpointRoutes from './routes/checkpoints.js'
import deviceRoutes from './routes/devices.js'
import reportRoutes from './routes/reports.js'
import auditRoutes from './routes/audit.js'
import hardwareRoutes from './routes/hardware.js'
import passwordResetRoutes from './routes/passwordReset.js'
import settingsRoutes from './routes/settings.js'
import alertsRoutes from './routes/alerts.js'
import usersRoutes from './routes/users.js'
import { errorHandler } from './middleware/errorHandler.js'
import { seedData } from './services/seedData.js'
import { getWebSocketStatus, wss } from './hardware/websocket.js'
import { connectMQTT, isMQTTConnected } from './hardware/mqtt.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.join(__dirname, '../dist')

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET']
const missing = requiredEnvVars.filter(key => !process.env[key])
if (missing.length > 0) {
  console.warn(`Missing required environment variables: ${missing.join(', ')}`)
}

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/travelers', travelerRoutes)
app.use('/api/crossings', crossingRoutes)
app.use('/api/checkpoints', checkpointRoutes)
app.use('/api/devices', deviceRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/audit', auditRoutes)
app.use('/api/device', hardwareRoutes)
app.use('/api/password-reset', passwordResetRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/alerts', alertsRoutes)
app.use('/api/users', usersRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'tap-and-pass-api',
    websocket: getWebSocketStatus()
  })
})

app.get('/api/device/ws-status', (req, res) => {
  const websocket = getWebSocketStatus()
  res.json({ status: 'ok', wsPort: websocket.port, websocket: websocket.status, connectedClients: wss ? wss.clients.size : 0 })
})

app.get('/api/device/mqtt-status', (req, res) => {
  res.json({ status: 'ok', mqtt: isMQTTConnected() })
})

if (process.env.NODE_ENV === 'production' || process.env.DIST_BUILD === 'true') {
  app.use(express.static(distPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use(errorHandler)

seedData()

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tap & Pass backend running on http://localhost:${PORT}`)
  console.log(`Hardware WebSocket running on ws://localhost:4002`)
})

connectMQTT().catch(err => {
  console.warn('MQTT connection failed (optional):', err.message)
})

