import { db } from '../database/fileDb.js'
import bcrypt from 'bcryptjs'

export function getUsers(req, res) {
  const users = db.getUsers() || []
  res.json({ data: users })
}

export function createUser(req, res) {
  const { username, password, full_name, email, role_id, department_id, checkpoint_id, status } = req.body
  if (!username || !password || !full_name) {
    return res.status(400).json({ error: 'Username, password, and full name are required' })
  }
  const users = db.getUsers()
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists' })
  }
  const password_hash = bcrypt.hashSync(password, 10)
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
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
  users.push(newUser)
  db.setUsers(users)
  const { password_hash: _, ...safeUser } = newUser
  res.status(201).json({ data: safeUser })
}

export function updateUser(req, res) {
  const userId = Number(req.params.id)
  const updates = req.body
  const users = db.getUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' })
  const updated = { ...users[userIndex], ...updates }
  if (updates.password) {
    updated.password_hash = bcrypt.hashSync(updates.password, 10)
  }
  db.setUsers(users)
  const { password_hash: _, ...safeUser } = updated
  res.json({ data: safeUser })
}

export function deleteUser(req, res) {
  const userId = Number(req.params.id)
  const users = db.getUsers()
  const filtered = users.filter(u => u.id !== userId)
  if (filtered.length === users.length) return res.status(404).json({ error: 'User not found' })
  db.setUsers(filtered)
  res.json({ data: { id: userId } })
}
