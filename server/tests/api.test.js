import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'

const API_BASE = 'http://localhost:4000/api'
let authToken = ''

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

describe('Tap & Pass API', () => {
  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'officer', password: 'password' })
      })
      const data = await res.json()
      assert.strictEqual(res.status, 200)
      assert.ok(data.token)
      assert.ok(data.user)
      authToken = data.token
    })

    it('should reject invalid credentials', async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'officer', password: 'wrong' })
      })
      assert.strictEqual(res.status, 401)
    })
  })

  describe('Travelers', () => {
    it('should list travelers', async () => {
      const data = await request('/travelers')
      assert.ok(Array.isArray(data.data))
      assert.ok(data.data.length > 0)
    })

    it('should search travelers by card ID or passport', async () => {
      const byCard = await request('/travelers/search?query=TP-2026-00012345')
      const byPassport = await request('/travelers/search?query=NGA-8842106')
      assert.ok(Array.isArray(byCard.data))
      assert.ok(Array.isArray(byPassport.data))
      assert.strictEqual(byCard.data[0].id, 'TP-2026-00012345')
      assert.strictEqual(byPassport.data[0].passport_number, 'NGA-8842106')
    })

    it('should get traveler by card ID', async () => {
      const data = await request('/travelers/card/TP-2026-00012345')
      assert.ok(data.data)
      assert.strictEqual(data.data.id, 'TP-2026-00012345')
    })

    it('should return 404 for unknown card', async () => {
      try {
        await request('/travelers/card/TP-2026-00000000')
        assert.fail('Should have thrown')
      } catch (err) {
        assert.ok(err.message.includes('not found') || err.message.includes('Card'))
      }
    })
  })

  describe('Crossings', () => {
    it('should list crossings', async () => {
      const data = await request('/crossings')
      assert.ok(Array.isArray(data.data))
    })

    it('should create a crossing', async () => {
      const data = await request('/crossings', {
        method: 'POST',
        body: JSON.stringify({ traveler_id: 'TP-2026-00012345', card_id: 'TP-2026-00012345', checkpoint_id: 3, direction: 'entry' })
      })
      assert.ok(data.data)
      assert.ok(data.data.id)
    })
  })

  describe('Reports', () => {
    it('should get daily report', async () => {
      const data = await request('/reports/daily')
      assert.ok(data.total !== undefined || data.date)
    })
  })

  describe('Devices', () => {
    it('should list devices', async () => {
      const data = await request('/devices')
      assert.ok(Array.isArray(data.data))
    })

    it('should expose the active WebSocket port', async () => {
      const data = await request('/device/ws-status')
      assert.strictEqual(data.status, 'ok')
      assert.ok(typeof data.wsPort === 'number')
      assert.ok(data.wsPort > 0)
    })
  })
})
