import { createContext, useContext, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('tap_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (username, password) => {
    setLoading(true)
    try {
      const data = await api.login({ username, password })
      const loggedUser = data.user
      setUser(loggedUser)
      localStorage.setItem('tap_token', data.token)
      localStorage.setItem('tap_user', JSON.stringify(loggedUser))
      return loggedUser
    } finally {
      setLoading(false)
    }
  }

  const loginDemo = () => {
    const demoUser = {
      id: 'demo',
      full_name: 'Demo User',
      username: 'demo',
      email: 'demo@tapandpass.local',
      role: 1,
      department_id: 6,
      checkpoint_id: null
    }
    setUser(demoUser)
    localStorage.setItem('tap_user', JSON.stringify(demoUser))
    return demoUser
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch {}
    setUser(null)
    localStorage.removeItem('tap_token')
    localStorage.removeItem('tap_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, loginDemo, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
