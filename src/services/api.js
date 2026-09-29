const API_BASE = '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('tap_token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new Error('Unable to connect to the Tap & Pass server. Start the backend and try again.')
  }
  if (res.status === 401) {
    localStorage.removeItem('tap_token')
    localStorage.removeItem('tap_user')
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  const responseText = await res.text()
  let data = {}
  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      throw new Error(`Server returned an invalid response (${res.status})`)
    }
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const api = {
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getTravelers: (params) => request(`/travelers${params ? `?${new URLSearchParams(params)}` : ''}`),
  searchTravelers: (query) => request(`/travelers/search?query=${encodeURIComponent(query)}`),
  getTraveler: (id) => request(`/travelers/${id}`),
  getTravelerByCard: (cardId) => request(`/travelers/card/${cardId}`),
  registerTraveler: (body) => request('/travelers', { method: 'POST', body: JSON.stringify(body) }),
  updateTravelerPhoto: (id, body) => request(`/travelers/${encodeURIComponent(id)}/photo`, { method: 'POST', body: JSON.stringify(body) }),
  getCrossings: (params) => request(`/crossings${params ? `?${new URLSearchParams(params)}` : ''}`),
  getCrossing: (id) => request(`/crossings/${id}`),
  createCrossing: (body) => request('/crossings', { method: 'POST', body: JSON.stringify(body) }),
  approveCrossing: (id, reason) => request(`/crossings/${id}/approve`, { method: 'POST', body: JSON.stringify({ reason }) }),
  denyCrossing: (id, reason) => request(`/crossings/${id}/deny`, { method: 'POST', body: JSON.stringify({ reason }) }),
  overrideCrossing: (id, body) => request(`/crossings/${id}/override`, { method: 'POST', body: JSON.stringify(body) }),
  getCheckpoints: () => request('/checkpoints'),
  getCheckpoint: (id) => request(`/checkpoints/${id}`),
  getDevices: () => request('/devices'),
  getDevice: (id) => request(`/devices/${id}`),
  getDailyReport: () => request('/reports/daily'),
  getMonthlyReport: () => request('/reports/monthly'),
  getAuditLogs: (params) => request(`/audit${params ? `?${new URLSearchParams(params)}` : ''}`),
  cardDetected: (body) => request('/device/card-detected', { method: 'POST', body: JSON.stringify(body) }),
  sendAllow: (body) => request('/device/allow', { method: 'POST', body: JSON.stringify(body) }),
  sendDeny: (body) => request('/device/deny', { method: 'POST', body: JSON.stringify(body) }),
  resetDevice: (body) => request('/device/reset', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) => request('/password-reset/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) => request('/password-reset/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  checkerLogin: (body) => request('/auth/checker-login', { method: 'POST', body: JSON.stringify(body) }),
  getSettings: () => request('/settings'),
  updateSettings: (body) => request('/settings', { method: 'POST', body: JSON.stringify(body) }),
  getAlerts: () => request('/alerts'),
  getUsers: () => request('/users'),
  createUser: (body) => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id, body) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  exportBackup: () => request('/settings/backup'),
  importBackup: (body) => request('/settings/restore', { method: 'POST', body: JSON.stringify(body) })
}
