import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tap-and-pass-secret-key-change-in-production'
const JWT_EXPIRES = '8h'

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role_id, department_id: user.department_id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' })
    const userRole = req.user.role
    const roleHierarchy = { administrator: 1, supervisor: 2, officer: 3, department_officer: 4, traveler: 5 }
    const userLevel = roleHierarchy[userRole] || 99
    const allowedLevels = allowedRoles.map(r => roleHierarchy[r] || 99).sort((a, b) => a - b)
    if (!allowedLevels.includes(userLevel) && userLevel > allowedLevels[0]) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}
