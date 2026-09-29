import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readJson(file, fallback) {
  try {
    const path = join(DATA_DIR, file)
    if (!existsSync(path)) return fallback
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return fallback
  }
}

function writeJson(file, data) {
  ensureDir()
  writeFileSync(join(DATA_DIR, file), JSON.stringify(data, null, 2))
}

export const db = {
  getUsers: () => readJson('users.json', []),
  setUsers: (users) => writeJson('users.json', users),
  getTravelers: () => readJson('travelers.json', []),
  setTravelers: (travelers) => writeJson('travelers.json', travelers),
  getCrossings: () => readJson('crossings.json', []),
  setCrossings: (crossings) => writeJson('crossings.json', crossings),
  getCheckpoints: () => readJson('checkpoints.json', []),
  setCheckpoints: (checkpoints) => writeJson('checkpoints.json', checkpoints),
  getDevices: () => readJson('devices.json', []),
  setDevices: (devices) => writeJson('devices.json', devices),
  getAlerts: () => readJson('alerts.json', []),
  setAlerts: (alerts) => writeJson('alerts.json', alerts),
  getAuditLogs: () => readJson('audit_logs.json', []),
  setAuditLogs: (logs) => writeJson('audit_logs.json', logs),
  getRoles: () => readJson('roles.json', []),
  setRoles: (roles) => writeJson('roles.json', roles),
  getDepartments: () => readJson('departments.json', []),
  setDepartments: (departments) => writeJson('departments.json', departments),
  getSettings: () => readJson('settings.json', null),
  setSettings: (settings) => writeJson('settings.json', settings)
}
