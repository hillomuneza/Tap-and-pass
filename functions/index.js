import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { setGlobalOptions } from 'firebase-functions/v2'
import { onRequest } from 'firebase-functions/v2/https'

initializeApp()
export const db = getFirestore()
export const auth = getAuth()

setGlobalOptions({ maxInstances: 10 })

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

const CHECKER_ACCESS_KEY = process.env.CHECKER_ACCESS_KEY || '1234'

function generateId(prefix = 'TP') {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0')
  return `${prefix}-${yyyy}${mm}${dd}-${seq}`
}

function normalizeCheckpoint(checkpoint) {
  if (!checkpoint) return checkpoint
  if (checkpoint.border_name !== undefined && checkpoint.border === undefined) {
    checkpoint = { ...checkpoint, border: checkpoint.border_name }
  }
  return checkpoint
}

function isExpired(expiryDate) {
  if (!expiryDate) return false
  return new Date(expiryDate) < new Date()
}

async function getCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

async function getDocument(collectionName, docId) {
  const docRef = db.collection(collectionName).doc(String(docId))
  const snapshot = await docRef.get()
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

async function setDocument(collectionName, docId, data) {
  const docRef = db.collection(collectionName).doc(String(docId))
  await docRef.set(data)
  return { id: docId, ...data }
}

async function createDocument(collectionName, data) {
  const docRef = db.collection(collectionName).doc()
  await docRef.set(data)
  return { id: docRef.id, ...data }
}

async function updateDocument(collectionName, docId, data) {
  const docRef = db.collection(collectionName).doc(String(docId))
  await docRef.update(data)
  const snapshot = await docRef.get()
  return { id: docId, ...snapshot.data() }
}

async function deleteDocument(collectionName, docId) {
  const docRef = db.collection(collectionName).doc(String(docId))
  await docRef.delete()
}

async function seedData() {
  const usersSnapshot = await db.collection('users').limit(1).get()
  if (!usersSnapshot.empty) return

  const users = [
    { id: '1', full_name: 'System Administrator', username: 'admin', email: 'admin@tapandpass.local', password_hash: '$2a$10$rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8O', role_id: 1, department_id: 6, checkpoint_id: null, status: 'active', last_login: null },
    { id: '2', full_name: 'Maya Kalu', username: 'officer', email: 'officer@tapandpass.local', password_hash: '$2a$10$rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8O', role_id: 3, department_id: 1, checkpoint_id: 3, status: 'active', last_login: null },
    { id: '3', full_name: 'Samuel Obi', username: 'supervisor', email: 'supervisor@tapandpass.local', password_hash: '$2a$10$rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8O', role_id: 2, department_id: 1, checkpoint_id: null, status: 'active', last_login: null },
    { id: '4', full_name: 'Fatima Bello', username: 'customs', email: 'customs@tapandpass.local', password_hash: '$2a$10$rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8O', role_id: 4, department_id: 2, checkpoint_id: 3, status: 'active', last_login: null }
  ]

  const travelers = [
    { id: 'TP-2026-00012345', full_name: 'Amara Okafor', date_of_birth: '1993-08-14', nationality: 'Nigeria', passport_number: 'NGA-8842106', passport_expiry: '2028-11-09', photo: 'https://i.pravatar.cc/300?img=1', status: 'active' },
    { id: 'TP-2026-00012346', full_name: 'Jonas Mbeki', date_of_birth: '1988-03-06', nationality: 'Kenya', passport_number: 'KEN-4419082', passport_expiry: '2027-01-21', photo: 'https://i.pravatar.cc/300?img=3', status: 'active' },
    { id: 'TP-2026-00012347', full_name: 'Lina Haddad', date_of_birth: '1997-11-29', nationality: 'Morocco', passport_number: 'MAR-7720164', passport_expiry: '2026-02-02', photo: 'https://i.pravatar.cc/300?img=5', status: 'active' },
    { id: 'TP-2026-00012298', full_name: 'Chinonso Eze', date_of_birth: '1990-05-22', nationality: 'Nigeria', passport_number: 'NGA-9912345', passport_expiry: '2029-06-15', photo: 'https://i.pravatar.cc/300?img=8', status: 'active' },
    { id: 'TP-2026-00012291', full_name: 'Nadia Mensah', date_of_birth: '1995-12-03', nationality: 'Ghana', passport_number: 'GHA-3344556', passport_expiry: '2028-03-20', photo: 'https://i.pravatar.cc/300?img=9', status: 'active' },
    { id: 'TP-2026-00012287', full_name: 'Musa Diallo', date_of_birth: '1985-09-18', nationality: 'Senegal', passport_number: 'SEN-7788990', passport_expiry: '2027-09-18', photo: 'https://i.pravatar.cc/300?img=12', status: 'active' }
  ]

  const checkpoints = [
    { id: '1', name: 'Gatuna', border_name: 'Rwanda-Uganda Border', country: 'Rwanda', location: 'Gatuna, Northern Province', device_id: 'DEV-001', status: 'OPEN' },
    { id: '2', name: 'Cyanika', border_name: 'Rwanda-Uganda Border', country: 'Rwanda', location: 'Cyanika, Northern Province', device_id: 'DEV-002', status: 'OPEN' },
    { id: '3', name: 'Kagitumba', border_name: 'Rwanda-Uganda Border', country: 'Rwanda', location: 'Kagitumba, Northern Province', device_id: 'DEV-003', status: 'OPEN' },
    { id: '4', name: 'Mirama Hills', border_name: 'Rwanda-Uganda Border', country: 'Rwanda', location: 'Mirama Hills, Northern Province', device_id: 'DEV-004', status: 'OPEN' },
    { id: '5', name: 'Nyungwe', border_name: 'Rwanda-Burundi Border', country: 'Rwanda', location: 'Nyungwe, Southern Province', device_id: 'DEV-005', status: 'OPEN' },
    { id: '6', name: 'Ruzizi', border_name: 'Rwanda-DRC Border', country: 'Rwanda', location: 'Ruzizi, Western Province', device_id: 'DEV-006', status: 'OPEN' },
    { id: '7', name: 'Bukavu', border_name: 'Rwanda-DRC Border', country: 'Rwanda', location: 'Bukavu, Western Province', device_id: 'DEV-007', status: 'OPEN' },
    { id: '8', name: 'Goma', border_name: 'Rwanda-DRC Border', country: 'Rwanda', location: 'Goma, Northern Province', device_id: 'DEV-008', status: 'OPEN' },
    { id: '9', name: 'Ishasha', border_name: 'Rwanda-DRC Border', country: 'Rwanda', location: 'Ishasha, Western Province', device_id: 'DEV-009', status: 'OPEN' },
    { id: '10', name: 'Buta', border_name: 'Rwanda-Burundi Border', country: 'Rwanda', location: 'Buta, Southern Province', device_id: 'DEV-010', status: 'OPEN' },
    { id: '11', name: 'Mukumba', border_name: 'Rwanda-Burundi Border', country: 'Rwanda', location: 'Mukumba, Southern Province', device_id: 'DEV-011', status: 'OPEN' },
    { id: '12', name: 'Mahagi', border_name: 'Rwanda-Uganda Border', country: 'Rwanda', location: 'Mahagi, Northern Province', device_id: 'DEV-012', status: 'OPEN' }
  ]

  const devices = [
    { id: 'DEV-001', device_name: 'Reader GT-01', device_type: 'NFC', serial_number: 'SN-001', checkpoint_id: '1', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-002', device_name: 'Reader CY-02', device_type: 'NFC', serial_number: 'SN-002', checkpoint_id: '2', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-003', device_name: 'Reader KG-03', device_type: 'NFC', serial_number: 'SN-003', checkpoint_id: '3', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-004', device_name: 'Reader MH-04', device_type: 'NFC', serial_number: 'SN-004', checkpoint_id: '4', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-005', device_name: 'Reader NW-05', device_type: 'NFC', serial_number: 'SN-005', checkpoint_id: '5', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-006', device_name: 'Reader RZ-06', device_type: 'NFC', serial_number: 'SN-006', checkpoint_id: '6', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-007', device_name: 'Reader BK-07', device_type: 'NFC', serial_number: 'SN-007', checkpoint_id: '7', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-008', device_name: 'Reader GM-08', device_type: 'NFC', serial_number: 'SN-008', checkpoint_id: '8', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-009', device_name: 'Reader IH-09', device_type: 'NFC', serial_number: 'SN-009', checkpoint_id: '9', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-010', device_name: 'Reader BT-10', device_type: 'NFC', serial_number: 'SN-010', checkpoint_id: '10', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-011', device_name: 'Reader MK-11', device_type: 'NFC', serial_number: 'SN-011', checkpoint_id: '11', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
    { id: 'DEV-012', device_name: 'Reader MH-12', device_type: 'NFC', serial_number: 'SN-012', checkpoint_id: '12', status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' }
  ]

  const roles = [
    { id: '1', name: 'administrator', description: 'Full system access' },
    { id: '2', name: 'supervisor', description: 'Monitor and manage operations' },
    { id: '3', name: 'officer', description: 'Process border crossings' },
    { id: '4', name: 'department_officer', description: 'Department-specific access' },
    { id: '5', name: 'traveler', description: 'Traveler portal access' }
  ]

  const departments = [
    { id: '1', name: 'Immigration', description: 'Immigration control' },
    { id: '2', name: 'Customs', description: 'Customs and excise' },
    { id: '3', name: 'Border Security', description: 'Border security' },
    { id: '4', name: 'Police', description: 'Border police' },
    { id: '5', name: 'Health', description: 'Health and quarantine' },
    { id: '6', name: 'Administration', description: 'Administrative support' }
  ]

  const crossings = [
    { id: 'TP-20260918-00421', traveler_id: 'TP-2026-00012298', card_id: 'TP-2026-00012298', officer_id: 2, department_id: 1, checkpoint_id: 3, direction: 'entry', status: 'approved', decision_reason: 'Verified identity', created_at: '2026-09-18T09:14:32Z', decision_at: '2026-09-18T09:14:32Z' },
    { id: 'TP-20260918-00420', traveler_id: 'TP-2026-00012346', card_id: 'TP-2026-00012346', officer_id: 2, department_id: 1, checkpoint_id: 3, direction: 'entry', status: 'denied', decision_reason: 'Secondary inspection required', created_at: '2026-09-18T09:08:17Z', decision_at: '2026-09-18T09:08:17Z' }
  ]

  const auditLogs = [
    { id: '1', user_id: '2', action: 'LOGIN', resource: 'session', resource_id: null, ip_address: '127.0.0.1', timestamp: new Date().toISOString(), details: { message: 'Officer login successful' } }
  ]

  const alerts = [
    { id: '1', traveler_id: 'TP-2026-00012346', type: 'secondary_inspection', severity: 'warning', message: 'Secondary inspection required for Jonas Mbeki', status: 'open', created_at: '2026-09-18T09:08:17Z' }
  ]

  const batch = db.batch()
  const collections = {
    users, travelers, checkpoints, devices, roles, departments, crossings, audit_logs: auditLogs, alerts
  }

  for (const [collectionName, items] of Object.entries(collections)) {
    for (const item of items) {
      const docRef = db.collection(collectionName).doc(String(item.id))
      batch.set(docRef, item)
    }
  }

  await batch.commit()
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'tap-and-pass-api' })
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const usersSnapshot = await db.collection('users').where('username', '==', username).where('status', '==', 'active').limit(1).get()
    if (usersSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const userDoc = usersSnapshot.docs[0]
    const user = { id: userDoc.id, ...userDoc.data() }
    if (password !== 'password') {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    user.last_login = new Date().toISOString()
    await userDoc.ref.update({ last_login: user.last_login })
    const token = Buffer.from(JSON.stringify({ id: user.id, username: user.username, role: user.role_id, department_id: user.department_id })).toString('base64')
    return res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role_id,
        department_id: user.department_id,
        checkpoint_id: user.checkpoint_id
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Login failed' })
  }
})

app.post('/api/auth/checker-login', async (req, res) => {
  try {
    const { access_key } = req.body
    if (!access_key || access_key !== CHECKER_ACCESS_KEY) {
      return res.status(401).json({ error: 'Invalid access key' })
    }
    const userDoc = await getDocument('users', '2')
    if (!userDoc) return res.status(500).json({ error: 'Checker account not configured' })
    const user = { ...userDoc, id: userDoc.id }
    user.last_login = new Date().toISOString()
    await updateDocument('users', user.id, { last_login: user.last_login })
    const token = Buffer.from(JSON.stringify({ id: user.id, username: user.username, role: user.role_id, department_id: user.department_id })).toString('base64')
    return res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role_id,
        department_id: user.department_id,
        checkpoint_id: user.checkpoint_id
      }
    })
  } catch (error) {
    console.error('Checker login error:', error)
    return res.status(500).json({ error: 'Checker login failed' })
  }
})

app.post('/api/auth/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' })
})

app.get('/api/travelers', async (req, res) => {
  try {
    const { search, query, nationality, status } = req.query
    const term = (search ?? query ?? '').toString().trim()
    let results = await getCollection('travelers')
    if (term) {
      const q = term.toLowerCase()
      results = results.filter(t =>
        (t.full_name || '').toLowerCase().includes(q) ||
        (t.id || '').toLowerCase().includes(q) ||
        (t.passport_number || '').toLowerCase().includes(q)
      )
    }
    if (nationality) {
      results = results.filter(t => (t.nationality || '').toLowerCase() === nationality.toLowerCase())
    }
    if (status) {
      results = results.filter(t => t.status === status)
    }
    res.json({ data: results, total: results.length })
  } catch (error) {
    console.error('Get travelers error:', error)
    res.status(500).json({ error: 'Failed to get travelers' })
  }
})

app.get('/api/travelers/search', async (req, res) => {
  try {
    const { query } = req.query
    if (!query) return res.json({ data: [], total: 0 })
    const q = query.toLowerCase()
    const results = await getCollection('travelers')
    const filtered = results.filter(t =>
      (t.full_name || '').toLowerCase().includes(q) ||
      (t.id || '').toLowerCase().includes(q) ||
      (t.passport_number || '').toLowerCase().includes(q)
    )
    res.json({ data: filtered, total: filtered.length })
  } catch (error) {
    console.error('Search travelers error:', error)
    res.status(500).json({ error: 'Search failed' })
  }
})

app.get('/api/travelers/:id', async (req, res) => {
  try {
    const traveler = await getDocument('travelers', req.params.id)
    if (!traveler) return res.status(404).json({ error: 'Traveler not found' })
    const docExpired = isExpired(traveler.passport_expiry)
    res.json({ data: { ...traveler, document_expired: docExpired } })
  } catch (error) {
    console.error('Get traveler error:', error)
    res.status(500).json({ error: 'Failed to get traveler' })
  }
})

app.get('/api/travelers/card/:cardId', async (req, res) => {
  try {
    const traveler = await getDocument('travelers', req.params.cardId)
    if (!traveler) return res.status(404).json({ error: 'Card not recognized' })
    const docExpired = isExpired(traveler.passport_expiry)
    res.json({ data: { ...traveler, document_expired: docExpired } })
  } catch (error) {
    console.error('Get traveler by card error:', error)
    res.status(500).json({ error: 'Failed to get traveler' })
  }
})

app.post('/api/travelers', async (req, res) => {
  try {
    const { card_id, full_name, date_of_birth, nationality, passport_number, passport_expiry } = req.body
    if (!card_id || !full_name || !passport_number) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const existing = await getDocument('travelers', card_id)
    if (existing) return res.status(409).json({ error: 'Card already registered' })
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
    await setDocument('travelers', card_id, newTraveler)
    res.status(201).json({ data: newTraveler })
  } catch (error) {
    console.error('Create traveler error:', error)
    res.status(500).json({ error: 'Failed to create traveler' })
  }
})

app.post('/api/travelers/:id/photo', async (req, res) => {
  try {
    const travelerId = req.params.id
    const { photo } = req.body
    const traveler = await getDocument('travelers', travelerId)
    if (!traveler) return res.status(404).json({ error: 'Traveler not found' })
    await updateDocument('travelers', travelerId, { photo, updated_at: new Date().toISOString() })
    const updated = await getDocument('travelers', travelerId)
    res.json({ data: updated })
  } catch (error) {
    console.error('Update traveler photo error:', error)
    res.status(500).json({ error: 'Failed to update photo' })
  }
})

app.post('/api/travelers/:id/photo-match', async (req, res) => {
  res.json({ data: { matched: false, confidence: 0 } })
})

app.get('/api/crossings', async (req, res) => {
  try {
    const { status, checkpoint_id, officer_id, date_from, date_to } = req.query
    let results = await getCollection('crossings')
    if (status) results = results.filter(c => c.status === status)
    if (checkpoint_id) results = results.filter(c => c.checkpoint_id === Number(checkpoint_id))
    if (officer_id) results = results.filter(c => c.officer_id === Number(officer_id))
    if (date_from) results = results.filter(c => c.created_at >= date_from)
    if (date_to) results = results.filter(c => c.created_at <= date_to)
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    res.json({ data: results, total: results.length })
  } catch (error) {
    console.error('Get crossings error:', error)
    res.status(500).json({ error: 'Failed to get crossings' })
  }
})

app.get('/api/crossings/:id', async (req, res) => {
  try {
    const crossing = await getDocument('crossings', req.params.id)
    if (!crossing) return res.status(404).json({ error: 'Crossing not found' })
    res.json({ data: crossing })
  } catch (error) {
    console.error('Get crossing error:', error)
    res.status(500).json({ error: 'Failed to get crossing' })
  }
})

app.post('/api/crossings', async (req, res) => {
  try {
    const { traveler_id, card_id, checkpoint_id, direction } = req.body
    if (!traveler_id || !card_id || !checkpoint_id) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const newCrossing = {
      id: generateId('TP'),
      traveler_id,
      card_id,
      officer_id: null,
      department_id: null,
      checkpoint_id: Number(checkpoint_id),
      direction: direction || 'entry',
      status: 'pending',
      decision_reason: null,
      created_at: new Date().toISOString(),
      decision_at: null
    }
    await createDocument('crossings', newCrossing)
    res.status(201).json({ data: newCrossing })
  } catch (error) {
    console.error('Create crossing error:', error)
    res.status(500).json({ error: 'Failed to create crossing' })
  }
})

app.post('/api/crossings/:id/approve', async (req, res) => {
  try {
    const { reason } = req.body
    const crossing = await getDocument('crossings', req.params.id)
    if (!crossing) return res.status(404).json({ error: 'Crossing not found' })
    if (crossing.status !== 'pending') return res.status(400).json({ error: 'Crossing already decided' })
    const updated = await updateDocument('crossings', req.params.id, {
      status: 'approved',
      decision_reason: reason || 'Verified identity',
      decision_at: new Date().toISOString(),
      decided_by: null
    })
    res.json({ data: updated })
  } catch (error) {
    console.error('Approve crossing error:', error)
    res.status(500).json({ error: 'Failed to approve crossing' })
  }
})

app.post('/api/crossings/:id/deny', async (req, res) => {
  try {
    const { reason } = req.body
    if (!reason) return res.status(400).json({ error: 'Reason is required for denial' })
    const crossing = await getDocument('crossings', req.params.id)
    if (!crossing) return res.status(404).json({ error: 'Crossing not found' })
    if (crossing.status !== 'pending') return res.status(400).json({ error: 'Crossing already decided' })
    const updated = await updateDocument('crossings', req.params.id, {
      status: 'denied',
      decision_reason: reason,
      decision_at: new Date().toISOString(),
      decided_by: null
    })
    res.json({ data: updated })
  } catch (error) {
    console.error('Deny crossing error:', error)
    res.status(500).json({ error: 'Failed to deny crossing' })
  }
})

app.post('/api/crossings/:id/override', async (req, res) => {
  try {
    const { reason, newStatus } = req.body
    if (!newStatus || !['approved', 'denied'].includes(newStatus)) {
      return res.status(400).json({ error: 'Valid newStatus is required: approved or denied' })
    }
    if (!reason) return res.status(400).json({ error: 'Reason is required for override' })
    const crossing = await getDocument('crossings', req.params.id)
    if (!crossing) return res.status(404).json({ error: 'Crossing not found' })
    if (crossing.status === newStatus) return res.status(400).json({ error: `Crossing is already ${newStatus}` })
    const updated = await updateDocument('crossings', req.params.id, {
      status: newStatus,
      decision_reason: reason,
      decision_at: new Date().toISOString(),
      overridden_by: null,
      overridden_at: new Date().toISOString()
    })
    res.json({ data: updated })
  } catch (error) {
    console.error('Override crossing error:', error)
    res.status(500).json({ error: 'Failed to override crossing' })
  }
})

app.get('/api/checkpoints', async (req, res) => {
  try {
    const data = await getCollection('checkpoints')
    res.json({ data: data.map(normalizeCheckpoint) })
  } catch (error) {
    console.error('Get checkpoints error:', error)
    res.status(500).json({ error: 'Failed to get checkpoints' })
  }
})

app.get('/api/checkpoints/:id', async (req, res) => {
  try {
    const checkpoint = await getDocument('checkpoints', req.params.id)
    if (!checkpoint) return res.status(404).json({ error: 'Checkpoint not found' })
    res.json({ data: normalizeCheckpoint(checkpoint) })
  } catch (error) {
    console.error('Get checkpoint error:', error)
    res.status(500).json({ error: 'Failed to get checkpoint' })
  }
})

app.get('/api/devices', async (req, res) => {
  try {
    const data = await getCollection('devices')
    res.json({ data })
  } catch (error) {
    console.error('Get devices error:', error)
    res.status(500).json({ error: 'Failed to get devices' })
  }
})

app.get('/api/devices/:id', async (req, res) => {
  try {
    const device = await getDocument('devices', req.params.id)
    if (!device) return res.status(404).json({ error: 'Device not found' })
    res.json({ data: device })
  } catch (error) {
    console.error('Get device error:', error)
    res.status(500).json({ error: 'Failed to get device' })
  }
})

app.patch('/api/devices/:id', async (req, res) => {
  try {
    const device = await getDocument('devices', req.params.id)
    if (!device) return res.status(404).json({ error: 'Device not found' })
    const updated = await updateDocument('devices', req.params.id, {
      ...req.body,
      last_seen: new Date().toISOString()
    })
    res.json({ data: updated })
  } catch (error) {
    console.error('Update device error:', error)
    res.status(500).json({ error: 'Failed to update device' })
  }
})

app.get('/api/reports/daily', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const crossings = await getCollection('crossings')
    const todayCrossings = crossings.filter(c => c.created_at?.startsWith(today))
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
  } catch (error) {
    console.error('Get daily report error:', error)
    res.status(500).json({ error: 'Failed to get daily report' })
  }
})

app.get('/api/reports/monthly', async (req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7)
    const crossings = await getCollection('crossings')
    const monthCrossings = crossings.filter(c => c.created_at?.startsWith(month))
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
  } catch (error) {
    console.error('Get monthly report error:', error)
    res.status(500).json({ error: 'Failed to get monthly report' })
  }
})

app.get('/api/reports/checkpoint/:id', async (req, res) => {
  try {
    const checkpointId = Number(req.params.id)
    const crossings = await getCollection('crossings')
    const filtered = crossings.filter(c => c.checkpoint_id === checkpointId)
    const approved = filtered.filter(c => c.status === 'approved').length
    const denied = filtered.filter(c => c.status === 'denied').length
    const pending = filtered.filter(c => c.status === 'pending').length
    res.json({
      checkpoint_id: checkpointId,
      total: filtered.length,
      approved,
      denied,
      pending,
      approval_rate: filtered.length ? Math.round((approved / filtered.length) * 100) : 0
    })
  } catch (error) {
    console.error('Get checkpoint report error:', error)
    res.status(500).json({ error: 'Failed to get checkpoint report' })
  }
})

app.get('/api/audit', async (req, res) => {
  try {
    const { user_id, action, resource, date_from, date_to } = req.query
    let results = await getCollection('audit_logs')
    if (user_id) results = results.filter(l => l.user_id === Number(user_id))
    if (action) results = results.filter(l => l.action === action)
    if (resource) results = results.filter(l => l.resource === resource)
    if (date_from) results = results.filter(l => l.timestamp >= date_from)
    if (date_to) results = results.filter(l => l.timestamp <= date_to)
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    res.json({ data: results, total: results.length })
  } catch (error) {
    console.error('Get audit logs error:', error)
    res.status(500).json({ error: 'Failed to get audit logs' })
  }
})

app.post('/api/audit', async (req, res) => {
  try {
    const log = {
      id: uuidv4(),
      ...req.body,
      timestamp: new Date().toISOString()
    }
    await createDocument('audit_logs', log)
    res.status(201).json({ data: log })
  } catch (error) {
    console.error('Create audit log error:', error)
    res.status(500).json({ error: 'Failed to create audit log' })
  }
})

app.get('/api/alerts', async (req, res) => {
  try {
    const data = await getCollection('alerts')
    res.json({ data })
  } catch (error) {
    console.error('Get alerts error:', error)
    res.status(500).json({ error: 'Failed to get alerts' })
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const data = await getCollection('users')
    const safe = data.map(({ password_hash, ...user }) => user)
    res.json({ data: safe })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: 'Failed to get users' })
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const { username, password, full_name, email, role_id, department_id, checkpoint_id, status } = req.body
    if (!username || !password || !full_name) {
      return res.status(400).json({ error: 'Username, password, and full name are required' })
    }
    const existing = await getDocument('users', username)
    if (existing) return res.status(409).json({ error: 'Username already exists' })
    const password_hash = bcrypt.hashSync(password, 10)
    const users = await getCollection('users')
    const newId = users.length > 0 ? Math.max(...users.map(u => Number(u.id))) + 1 : 1
    const newUser = {
      id: String(newId),
      username,
      password_hash,
      full_name,
      email: email || '',
      role_id: Number(role_id) || 3,
      department_id: Number(department_id) || 1,
      checkpoint_id: checkpoint_id ? Number(checkpoint_id) : null,
      status: status || 'active',
      last_login: null
    }
    await createDocument('users', newUser)
    const { password_hash: _, ...safeUser } = newUser
    res.status(201).json({ data: safeUser })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = String(req.params.id)
    const updates = req.body
    const user = await getDocument('users', userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (updates.password) {
      updates.password_hash = bcrypt.hashSync(updates.password, 10)
      delete updates.password
    }
    await updateDocument('users', userId, updates)
    const updated = await getDocument('users', userId)
    const { password_hash, ...safeUser } = updated
    res.json({ data: safeUser })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = String(req.params.id)
    const user = await getDocument('users', userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    await deleteDocument('users', userId)
    res.json({ data: { id: userId } })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getDocument('settings', 'app')
    res.json({ data: settings || {
      systemName: 'TAP & PASS',
      checkerAccessKey: '1234',
      offlineMode: true,
      defaultLanguage: 'en',
      dataRetentionDays: 90,
      autoSync: true
    } })
  } catch (error) {
    console.error('Get settings error:', error)
    res.status(500).json({ error: 'Failed to get settings' })
  }
})

app.post('/api/settings', async (req, res) => {
  try {
    const updated = await setDocument('settings', 'app', req.body)
    res.json({ data: updated })
  } catch (error) {
    console.error('Update settings error:', error)
    res.status(500).json({ error: 'Failed to update settings' })
  }
})

app.get('/api/settings/backup', async (req, res) => {
  try {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: await getDocument('settings', 'app'),
      users: await getCollection('users'),
      travelers: await getCollection('travelers'),
      crossings: await getCollection('crossings'),
      checkpoints: await getCollection('checkpoints'),
      devices: await getCollection('devices'),
      alerts: await getCollection('alerts'),
      auditLogs: await getCollection('audit_logs'),
      roles: await getCollection('roles'),
      departments: await getCollection('departments')
    }
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="tap-and-pass-backup-${new Date().toISOString().slice(0, 10)}.json"`)
    res.send(JSON.stringify(backup, null, 2))
  } catch (error) {
    console.error('Export backup error:', error)
    res.status(500).json({ error: 'Failed to export backup' })
  }
})

app.post('/api/settings/restore', async (req, res) => {
  try {
    const payload = req.body
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid backup file' })
    }
    if (payload.users) {
      for (const user of payload.users) {
        await setDocument('users', String(user.id), user)
      }
    }
    if (payload.travelers) {
      for (const traveler of payload.travelers) {
        await setDocument('travelers', String(traveler.id), traveler)
      }
    }
    if (payload.crossings) {
      for (const crossing of payload.crossings) {
        await setDocument('crossings', String(crossing.id), crossing)
      }
    }
    if (payload.checkpoints) {
      for (const checkpoint of payload.checkpoints) {
        await setDocument('checkpoints', String(checkpoint.id), checkpoint)
      }
    }
    if (payload.devices) {
      for (const device of payload.devices) {
        await setDocument('devices', String(device.id), device)
      }
    }
    if (payload.alerts) {
      for (const alert of payload.alerts) {
        await setDocument('alerts', String(alert.id), alert)
      }
    }
    if (payload.auditLogs) {
      for (const log of payload.auditLogs) {
        await setDocument('audit_logs', String(log.id), log)
      }
    }
    if (payload.roles) {
      for (const role of payload.roles) {
        await setDocument('roles', String(role.id), role)
      }
    }
    if (payload.departments) {
      for (const dept of payload.departments) {
        await setDocument('departments', String(dept.id), dept)
      }
    }
    if (payload.settings) {
      await setDocument('settings', 'app', payload.settings)
    }
    res.json({ data: { message: 'Backup imported successfully' } })
  } catch (error) {
    console.error('Import backup error:', error)
    res.status(500).json({ error: 'Failed to import backup' })
  }
})

app.post('/api/device/card-detected', async (req, res) => {
  try {
    const { card_id, device_id } = req.body
    const device = await getDocument('devices', device_id)
    if (!device) return res.status(404).json({ error: 'Device not found' })
    await updateDocument('devices', device_id, { last_seen: new Date().toISOString() })
    return res.json({ status: 'ok', message: 'Card detected', device_id })
  } catch (error) {
    console.error('Card detected error:', error)
    res.status(500).json({ error: 'Failed to process card detection' })
  }
})

app.get('/api/device/status/:id', async (req, res) => {
  try {
    const device = await getDocument('devices', req.params.id)
    if (!device) return res.status(404).json({ error: 'Device not found' })
    return res.json({ data: device })
  } catch (error) {
    console.error('Get device status error:', error)
    res.status(500).json({ error: 'Failed to get device status' })
  }
})

app.post('/api/device/allow', async (req, res) => {
  try {
    const { device_id } = req.body
    const device = await getDocument('devices', device_id)
    if (!device) return res.status(404).json({ error: 'Device not found' })
    await updateDocument('devices', device_id, { last_seen: new Date().toISOString() })
    res.json({ status: 'ok', command: 'ALLOW', device_id })
  } catch (error) {
    console.error('Send allow error:', error)
    res.status(500).json({ error: 'Failed to send allow command' })
  }
})

app.post('/api/device/deny', async (req, res) => {
  try {
    const { device_id, reason } = req.body
    const device = await getDocument('devices', device_id)
    if (!device) return res.status(404).json({ error: 'Device not found' })
    await updateDocument('devices', device_id, { last_seen: new Date().toISOString() })
    res.json({ status: 'ok', command: 'DENY', device_id, reason })
  } catch (error) {
    console.error('Send deny error:', error)
    res.status(500).json({ error: 'Failed to send deny command' })
  }
})

app.post('/api/device/reset', async (req, res) => {
  try {
    const { device_id } = req.body
    const device = await getDocument('devices', device_id)
    if (!device) return res.status(404).json({ error: 'Device not found' })
    await updateDocument('devices', device_id, { last_seen: new Date().toISOString() })
    res.json({ status: 'ok', command: 'RESET', device_id })
  } catch (error) {
    console.error('Reset device error:', error)
    res.status(500).json({ error: 'Failed to reset device' })
  }
})

app.post('/api/password-reset/forgot-password', async (req, res) => {
  res.json({ data: { message: 'Password reset link sent' } })
})

app.post('/api/password-reset/reset-password', async (req, res) => {
  res.json({ data: { message: 'Password reset successfully' } })
})

app.get('/api/device/ws-status', (req, res) => {
  res.json({ status: 'ok', wsPort: 4002, websocket: { status: 'disabled', port: 4002 }, connectedClients: 0 })
})

app.get('/api/device/mqtt-status', (req, res) => {
  res.json({ status: 'ok', mqtt: { connected: false, broker: null } })
})

seedData().then(() => {
  console.log('Demo data seeded successfully')
}).catch(err => {
  console.error('Seed data error:', err)
})

export const api = onRequest(app)
