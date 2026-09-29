import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { LayoutDashboard, History, Settings, LogOut, MapPin, ChevronDown, Activity, ShieldCheck, X, ArrowRight, Radio, AlertTriangle as AlertIcon, Menu, Bell, Check, Search } from 'lucide-react'

export default function TravelerPortal({ onBack }) {
  const [cardId, setCardId] = useState('')
  const [traveler, setTraveler] = useState(null)
  const [crossings, setCrossings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')

  const lookupTraveler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTraveler(null)
    setCrossings([])
    try {
      const res = await api.getTravelerByCard(cardId.trim())
      setTraveler(res.data)
      const crossingsRes = await api.getCrossings({ traveler_id: res.data.id })
      setCrossings(crossingsRes.data || [])
    } catch (err) {
      setError(err.message || 'Traveler not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <div className="brand-emblem"><ShieldCheck size={18} strokeWidth={2.8} /></div>
          <div><strong>TAP <span>&</span> PASS</strong><small>Traveler portal</small></div>
        </div>
        <div className="site-selector">
          <span className="eyebrow">PORTAL</span>
          <div className="connection"><span className="pulse-dot" /> Public access</div>
        </div>
        <nav>
          <span className="eyebrow nav-label">MENU</span>
          <button className="nav-item active"><Search size={18} /><span>Lookup</span></button>
          <button className="nav-item" onClick={onBack}><ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /><span>Back to login</span></button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Traveler</span><ArrowRight size={14} /><strong>Lookup</strong></div>
        </header>

        <div className="generic-page">
          <div className="page-heading">
            <div><span className="eyebrow">TRAVELER PORTAL</span><h1>Crossing lookup</h1><p>Enter your card ID to view your crossing history.</p></div>
          </div>

          <form onSubmit={lookupTraveler} className="login-form" style={{ maxWidth: 480, marginBottom: 30 }}>
            <label>
              <span>Card ID</span>
              <input
                type="text"
                placeholder="e.g. TP-2026-00012345"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Looking up...' : 'Lookup crossing history'}
            </button>
          </form>

          {error && <div className="login-error" style={{ maxWidth: 480 }}>{error}</div>}

          {traveler && (
            <>
              <section className="verification-panel" style={{ marginBottom: 20 }}>
                <div className="traveler-view">
                  <div className="verification-header">
                    <div>
                      <span className="eyebrow">TRAVELER RECORD</span>
                      <h2>{traveler.full_name}</h2>
                    </div>
                  </div>
                  <div className="detail-grid" style={{ marginTop: 20 }}>
                    <Detail label="Card ID" value={traveler.id} />
                    <Detail label="Nationality" value={traveler.nationality} />
                    <Detail label="Date of birth" value={traveler.date_of_birth} />
                    <Detail label="Passport" value={traveler.passport_number} />
                    <Detail label="Passport expiry" value={traveler.passport_expiry} />
                    <Detail label="Status" value={traveler.status} valueTone={traveler.document_expired ? 'danger' : 'success'} />
                  </div>
                </div>
              </section>

              <section className="activity-section">
                <div className="section-heading">
                  <div><span className="eyebrow">HISTORY</span><h2>Crossing history</h2></div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>DATE</th><th>CHECKPOINT</th><th>DIRECTION</th><th>STATUS</th></tr>
                    </thead>
                    <tbody>
                      {crossings.length === 0 ? (
                        <tr><td colSpan={4} className="muted" style={{ textAlign: 'center', padding: 30 }}>No crossing history found.</td></tr>
                      ) : (
                        crossings.map((c) => (
                          <tr key={c.id}>
                            <td className="muted">{new Date(c.created_at).toLocaleDateString('en-GB')}</td>
                            <td><strong>Gate {c.checkpoint_id}</strong></td>
                            <td className="muted">{c.direction}</td>
                            <td><span className={`status-pill ${c.status}`}><span />{c.status}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {notice && <div className="toast"><Check size={17} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
    </div>
  )
}

function Detail({ label, value, valueTone }) {
  return (
    <div className="detail">
      <span>{label}</span>
      <strong className={valueTone || ''}>{value || 'N/A'}</strong>
    </div>
  )
}
