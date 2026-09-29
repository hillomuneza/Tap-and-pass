import { createContext, useContext, useState, useEffect } from 'react'

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
      let res
      try {
        res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
      } catch {
        throw new Error('Unable to connect to the Tap & Pass server. Start the backend and try again.')
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
      if (!res.ok) throw new Error(data.error || 'Login failed')
      setUser(data.user)
      localStorage.setItem('tap_token', data.token)
      localStorage.setItem('tap_user', JSON.stringify(data.user))
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('tap_token')}` } })
    } catch {}
    setUser(null)
    localStorage.removeItem('tap_token')
    localStorage.removeItem('tap_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
