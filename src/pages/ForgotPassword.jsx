import { useState } from 'react'
import { api } from '../services/api'
import { Zap, ArrowLeft } from 'lucide-react'

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await api.forgotPassword({ email })
      setMessage(res.message || 'Password reset link sent to your email')
    } catch (err) {
      setError(err.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-emblem"><Zap size={22} strokeWidth={2.8} /></div>
          <div>
            <strong>TAP <span>&</span> PASS</strong>
            <small>Border operations system</small>
          </div>
        </div>
        <button className="secondary-button" onClick={onBack} style={{ marginBottom: 20, width: '100%' }}><ArrowLeft size={16} /> Back to login</button>
        <h1>Reset password</h1>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
        {error && <div className="login-error">{error}</div>}
        {message && <div style={{ padding: 10, background: '#1b3d34', border: '1px solid #31715e', color: '#b9eee0', borderRadius: 6, fontSize: 11, marginBottom: 14 }}>{message}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  )
}
