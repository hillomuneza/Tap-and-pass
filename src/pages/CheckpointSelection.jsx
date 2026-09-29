import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { MapPin, ChevronDown } from 'lucide-react'

export default function CheckpointSelection({ onSelect, defaultCheckpointId }) {
  const [checkpoints, setCheckpoints] = useState([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const { user } = useAuth()

  useEffect(() => {
    const loadCheckpoints = async () => {
      try {
        const res = await api.getCheckpoints()
        const data = res.data || []
        setCheckpoints(data)
        const preselected = defaultCheckpointId || user?.checkpoint_id
        const match = preselected ? data.find(cp => cp.id === preselected) : null
        if (match) {
          setSelected(String(match.id))
        } else if (data.length > 0) {
          setSelected(String(data[0].id))
        }
      } catch (err) {
        console.error('Failed to load checkpoints:', err)
        setError('Unable to load checkpoints. Please try again or contact support.')
      } finally {
        setLoading(false)
      }
    }

    loadCheckpoints()
  }, [navigate, setUser, defaultCheckpointId, user?.checkpoint_id])

  const handleContinue = (e) => {
    e.preventDefault()
    if (!selected) return
    const checkpoint = checkpoints.find(cp => String(cp.id) === selected)
    if (!checkpoint) {
      setError('Please select a valid checkpoint')
      return
    }
    onSelect(checkpoint)
  }

  return (
    <div className="login-shell">
      <div className="login-card" style={{ maxWidth: 520 }}>
        <div className="login-brand">
          <div className="login-emblem"><MapPin size={22} strokeWidth={2.8} /></div>
          <div>
            <strong>TAP <span>&</span> PASS</strong>
            <small>Select your checkpoint</small>
          </div>
        </div>
        <h1>Where are you working from?</h1>
        <p>Select the border checkpoint where you are currently stationed.</p>
        {error && <div className="login-error">{error}</div>}
        {loading && <div className="login-error" style={{ background: '#222b33', borderColor: '#31545a', color: '#9fb8bc' }}>Loading checkpoints...</div>}
        <form onSubmit={handleContinue} className="login-form">
          <label>
            <span>Checkpoint</span>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              required
              style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12, outline: 'none' }}
            >
              {checkpoints.map((cp) => (
                <option key={cp.id} value={String(cp.id)}>
                  {cp.name} — {cp.border}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="login-button" disabled={loading || !selected}>
            Continue to dashboard
          </button>
        </form>
      </div>
    </div>
  )
}
