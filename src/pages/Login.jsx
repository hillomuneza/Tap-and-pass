import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Zap } from 'lucide-react'

export default function Login({ onLoginSuccess }) {
  const { login, loading } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login(username, password)
      if (onLoginSuccess && user) {
        onLoginSuccess(user)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-emblem"><Zap size={22} strokeWidth={2.8} /></div>
          <div>
            <strong>TAP <span>&</span> PASS</strong>
            <small>Border operations</small>
          </div>
        </div>
        <h1>Sign in</h1>
        <p>Enter your credentials to access the system.</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span>Username</span>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
