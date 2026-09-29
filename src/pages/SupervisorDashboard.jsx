import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { exportToCSV } from '../utils/export'
import { LayoutDashboard, History, Settings, LogOut, MapPin, ChevronDown, Activity, ShieldCheck, X, ArrowRight, Radio, AlertTriangle as AlertIcon, Menu, Bell, Check, Search, CreditCard, User } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Checkpoints', icon: Radio },
  { label: 'Officers', icon: User },
  { label: 'Overrides', icon: ShieldCheck },
  { label: 'Reports', icon: Activity },
  { label: 'Audit logs', icon: ShieldCheck },
]

export default function SupervisorDashboard({ onSwitchToLogin, selectedCheckpoint }) {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState('Overview')
  const [notice, setNotice] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [stats, setStats] = useState({ checkpoints: 0, devices: 0, offlineDevices: 0, todayTravelers: 0, approved: 0, denied: 0, avgTime: '0s' })
  const [recentCrossings, setRecentCrossings] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [dailyReport, setDailyReport] = useState(null)
  const [overrides, setOverrides] = useState([])
  const [overrideReason, setOverrideReason] = useState('')
  const [overrideTarget, setOverrideTarget] = useState(null)

  const checkpointLabel = selectedCheckpoint ? `${selectedCheckpoint.name} — ${selectedCheckpoint.border}` : 'Border Region'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [dailyRes, crossingsRes, auditRes, deniedRes] = await Promise.all([
        api.getDailyReport(),
        api.getCrossings({ limit: 10 }),
        api.getAuditLogs({ limit: 20 }),
        api.getCrossings({ status: 'denied', limit: 50 })
      ])
      if (dailyRes) {
        setDailyReport(dailyRes)
        setStats((s) => ({ ...s, todayTravelers: dailyRes.total || s.todayTravelers, approved: dailyRes.approved || s.approved, denied: dailyRes.denied || s.denied }))
      }
      setRecentCrossings(crossingsRes.data || [])
      setAuditLogs(auditRes.data || [])
      setOverrides(deniedRes.data || [])
    } catch (err) {
      console.error('Failed to load supervisor data:', err)
    }
  }

  const startOverride = (crossing) => {
    setOverrideTarget(crossing)
    setOverrideReason('')
  }

  const submitOverride = async () => {
    if (!overrideTarget || !overrideReason) return
    try {
      await api.overrideCrossing(overrideTarget.id, {
        reason: overrideReason,
        newStatus: 'approved'
      })
      setNotice(`Override approved for ${overrideTarget.id}`)
      setOverrides((prev) => prev.filter((item) => item.id !== overrideTarget.id))
      setOverrideTarget(null)
      setOverrideReason('')
      loadData()
    } catch (err) {
      setNotice(err.message || 'Override failed')
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'is-open' : ''}`}>
        <div className="brand-mark">
          <div className="brand-emblem"><ShieldCheck size={18} strokeWidth={2.8} /></div>
          <div><strong>TAP <span>&</span> PASS</strong><small>Supervisor panel</small></div>
        </div>
        <div className="site-selector">
          <span className="eyebrow">BORDER REGION</span>
          <button className="site-button"><span><MapPin size={15} /> {checkpointLabel}</span><ChevronDown size={15} /></button>
          <div className="connection"><span className="pulse-dot" /> All systems operational</div>
        </div>
        <nav>
          <span className="eyebrow nav-label">WORKSPACE</span>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activeView === label ? 'active' : ''}`} onClick={() => { setActiveView(label); setMobileNav(false) }}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
          <span className="eyebrow nav-label utility-label">SYSTEM</span>
          <button className="nav-item" onClick={() => setNotice('Settings are restricted to administrators')}><Settings size={18} /><span>Settings</span></button>
          <button className="nav-item" onClick={() => { logout(); onSwitchToLogin() }}><LogOut size={18} /><span>Sign out</span></button>
        </nav>
        <div className="sidebar-footer">
          <div className="secure-badge"><ShieldCheck size={17} /><span><strong>Supervisor access</strong><small>Read & manage</small></span></div>
          <div className="profile-chip"><span className="avatar avatar-small">{user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'SO'}</span><span><strong>{user?.full_name || 'Samuel Obi'}</strong><small>Border supervisor</small></span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav((current) => !current)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumb"><span>North Border</span><ArrowRight size={14} /><strong>{activeView}</strong></div>
          <div className="topbar-actions">
            <div className="live-clock"><span className="pulse-dot" /> LIVE <time>{new Date().toLocaleTimeString('en-GB')}</time></div>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice('Notifications cleared')}><Bell size={19} /><i>3</i></button>
            <div className="top-avatar">{user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'SO'}</div>
          </div>
        </header>

        {activeView === 'Overview' && <SupervisorOverview stats={stats} recentCrossings={recentCrossings} setNotice={setNotice} dailyReport={dailyReport} />}
        {activeView === 'Checkpoints' && <SupervisorCheckpoints setNotice={setNotice} />}
        {activeView === 'Officers' && <SupervisorOfficers setNotice={setNotice} />}
        {activeView === 'Overrides' && <SupervisorOverrides overrides={overrides} overrideTarget={overrideTarget} overrideReason={overrideReason} setOverrideReason={setOverrideReason} startOverride={startOverride} submitOverride={submitOverride} setNotice={setNotice} />}
        {activeView === 'Reports' && <SupervisorReports setNotice={setNotice} dailyReport={dailyReport} />}
        {activeView === 'Audit logs' && <AuditLogsView logs={auditLogs} setNotice={setNotice} />}
      </main>

      {notice && <div className="toast"><Check size={17} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
    </div>
  )
}

function SupervisorOverview({ stats, recentCrossings, setNotice, dailyReport }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">SUPERVISOR WORKSPACE / {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
          <h1>Good morning, Supervisor.</h1>
          <p>Monitor border operations across all checkpoints.</p>
        </div>
        <div className="heading-actions">
          <button className="secondary-button" onClick={() => setNotice('Report export queued')}><Activity size={16} /> Generate report</button>
        </div>
      </div>
      <section className="metric-row">
        <Metric icon={Radio} label="Active checkpoints" value={String(stats.checkpoints)} change="All operational" tone="teal" />
        <Metric icon={Check} label="Online devices" value={String(stats.devices)} change={`${stats.offlineDevices} offline`} tone="green" />
        <Metric icon={Users} label="Today's travelers" value={String(stats.todayTravelers)} change="+4.2%" tone="blue" />
        <Metric icon={Activity} label="Avg. processing" value={stats.avgTime} change="-3s vs avg" tone="amber" />
      </section>
      <div className="workspace-grid">
        <section className="verification-panel">
          <div className="empty-scanner" style={{ minHeight: 200, flexDirection: 'row', gap: 40, textAlign: 'left', justifyContent: 'flex-start' }}>
            <div>
              <span className="eyebrow">TODAY'S CROSSINGS</span>
              <h2 style={{ marginTop: 8 }}>{stats.todayTravelers.toLocaleString()}</h2>
              <p className="muted" style={{ maxWidth: 300, marginTop: 8 }}>Total travelers processed today across all checkpoints.</p>
            </div>
            <div>
              <span className="eyebrow">APPROVED / DENIED</span>
              <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                <div><strong style={{ color: 'var(--green)', fontSize: 24 }}>{stats.approved.toLocaleString()}</strong><div className="muted" style={{ fontSize: 10 }}>Approved</div></div>
                <div><strong style={{ color: 'var(--red)', fontSize: 24 }}>{stats.denied.toLocaleString()}</strong><div className="muted" style={{ fontSize: 10 }}>Denied</div></div>
              </div>
            </div>
          </div>
        </section>
        <aside className="side-stack">
          <div className="info-card">
            <span className="eyebrow">APPROVAL RATE</span>
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <strong style={{ fontSize: 32, color: 'var(--teal)' }}>{dailyReport ? Math.round((dailyReport.approved / dailyReport.total) * 100) : 94}%</strong>
              <span className="muted">approval rate today</span>
            </div>
          </div>
          <div className="info-card">
            <span className="eyebrow">SYSTEM HEALTH</span>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}><span className="muted">Database</span><strong style={{ color: 'var(--green)' }}>Healthy</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}><span className="muted">API</span><strong style={{ color: 'var(--green)' }}>Healthy</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}><span className="muted">Hardware</span><strong style={{ color: stats.offlineDevices > 0 ? 'var(--amber)' : 'var(--green)' }}>{stats.offlineDevices > 0 ? '1 offline' : 'All online'}</strong></div>
            </div>
          </div>
        </aside>
      </div>
      <section className="activity-section">
        <div className="section-heading">
          <div><span className="eyebrow">LIVE FEED</span><h2>Recent crossings</h2></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>TRAVELER</th><th>CARD ID</th><th>TIME</th><th>RESULT</th><th>REASON</th></tr></thead>
            <tbody>
              {recentCrossings.slice(0, 5).map((c) => (
                <tr key={c.id}>
                  <td><div className="person-cell"><span className="avatar">{c.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || '??'}</span><strong>{c.name}</strong></div></td>
                  <td className="mono">{c.card}</td>
                  <td className="muted">{c.time}</td>
                  <td><span className={`status-pill ${(c.outcome || '').toLowerCase()}`}><span />{c.outcome}</span></td>
                  <td className="muted">{c.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function SupervisorReports({ setNotice, dailyReport }) {
  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Approved',
        data: [210, 230, 245, 220, 260, 180, 190],
        backgroundColor: '#75d69b'
      },
      {
        label: 'Denied',
        data: [12, 8, 15, 10, 14, 6, 9],
        backgroundColor: '#f07979'
      }
    ]
  }

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Processing time (s)',
        data: [48, 45, 42, 44, 40, 38, 42],
        borderColor: '#79b8e5',
        backgroundColor: 'rgba(121,184,229,0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#89a0a1', font: { size: 10 } } }
    },
    scales: {
      x: { ticks: { color: '#6d898b', font: { size: 10 } }, grid: { color: '#20383d' } },
      y: { ticks: { color: '#6d898b', font: { size: 10 } }, grid: { color: '#20383d' } }
    }
  }

  const handleExport = () => {
    const reportData = [
      { Metric: 'Total today', Value: dailyReport?.total || 0 },
      { Metric: 'Approved', Value: dailyReport?.approved || 0 },
      { Metric: 'Denied', Value: dailyReport?.denied || 0 },
      { Metric: 'Pending', Value: dailyReport?.pending || 0 },
      { Metric: 'Approval rate', Value: dailyReport ? `${Math.round((dailyReport.approved / dailyReport.total) * 100)}%` : '0%' }
    ]
    exportToCSV(reportData, `daily-report-${new Date().toISOString().slice(0, 10)}.csv`)
    setNotice('Report exported to CSV')
  }

  return (
    <div className="generic-page">
      <div className="page-heading">
        <div><span className="eyebrow">ANALYTICS</span><h1>Reports</h1><p>View crossing statistics and generate reports.</p></div>
        <div className="heading-actions">
          <button className="secondary-button" onClick={handleExport}><Activity size={16} /> Export CSV</button>
        </div>
      </div>
      <section className="metric-row">
        <Metric icon={Activity} label="Total today" value={String(dailyReport?.total || 0)} tone="teal" />
        <Metric icon={Check} label="Approved" value={String(dailyReport?.approved || 0)} tone="green" />
        <Metric icon={AlertIcon} label="Denied" value={String(dailyReport?.denied || 0)} tone="red" />
        <Metric icon={Clock3} label="Pending" value={String(dailyReport?.pending || 0)} tone="amber" />
      </section>
      <div className="workspace-grid" style={{ marginTop: 20, gap: 12 }}>
        <section className="info-card" style={{ padding: 18, height: 300 }}>
          <span className="eyebrow">WEEKLY CROSSINGS</span>
          <div style={{ height: 240, marginTop: 10 }}><Chart type="bar" data={barData} options={options} /></div>
        </section>
        <section className="info-card" style={{ padding: 18, height: 300 }}>
          <span className="eyebrow">PROCESSING TIME</span>
          <div style={{ height: 240, marginTop: 10 }}><Chart type="line" data={lineData} options={options} /></div>
        </section>
      </div>
    </div>
  )
}

function AuditLogsView({ logs, setNotice }) {
  const handleExport = () => {
    exportToCSV(logs, `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`)
    setNotice('Audit logs exported to CSV')
  }

  return (
    <div className="generic-page">
      <div className="page-heading">
        <div><span className="eyebrow">SECURITY</span><h1>Audit logs</h1><p>Review system activity and decisions.</p></div>
        <div className="heading-actions">
          <button className="secondary-button" onClick={handleExport}><Activity size={16} /> Export</button>
        </div>
      </div>
      <div className="history-table">
        <table>
          <thead>
            <tr><th>TIMESTAMP</th><th>USER</th><th>ACTION</th><th>RESOURCE</th><th>DETAILS</th></tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="muted">{new Date(log.timestamp).toLocaleString('en-GB')}</td>
                <td><strong>User {log.user_id}</strong></td>
                <td><span className="status-pill approved"><span />{log.action}</span></td>
                <td className="muted">{log.resource}</td>
                <td className="muted">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SupervisorCheckpoints({ setNotice }) {
  const checkpoints = [
    { id: 1, name: 'North Gate 01', border: 'North Border', status: 'OPEN', device: 'Reader NG01', queue: 14 },
    { id: 2, name: 'North Gate 02', border: 'North Border', status: 'OPEN', device: 'Reader NG02', queue: 3 },
    { id: 3, name: 'North Gate 03', border: 'North Border', status: 'OPEN', device: 'Reader NG03', queue: 6 },
    { id: 4, name: 'South Gate 01', border: 'South Border', status: 'OPEN', device: 'Reader SG01', queue: 9 }
  ]

  return (
    <div className="generic-page">
      <div className="page-heading">
        <div><span className="eyebrow">OPERATIONS</span><h1>Checkpoints</h1><p>Monitor all active border checkpoints.</p></div>
      </div>
      <div className="metric-row">
        {checkpoints.map((cp) => (
          <div key={cp.id} className="info-card">
            <div className="card-top">
              <span className="eyebrow">GATE {String(cp.id).padStart(2, '0')}</span>
              <span className="status-dot green" />
            </div>
            <div style={{ margin: '18px 0 14px' }}>
              <strong style={{ fontSize: 13 }}>{cp.name}</strong>
              <div className="muted" style={{ fontSize: 10, marginTop: 4 }}>{cp.border}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}><span className="muted">Status</span><strong style={{ color: 'var(--green)' }}>{cp.status}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}><span className="muted">Device</span><strong>{cp.device}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}><span className="muted">Queue</span><strong>{cp.queue} waiting</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SupervisorOfficers({ setNotice }) {
  const officers = [
    { id: 2, name: 'Maya Kalu', username: 'officer', department: 'Immigration', checkpoint: 'North Gate 03', status: 'Active' },
    { id: 4, name: 'Fatima Bello', username: 'customs', department: 'Customs', checkpoint: 'North Gate 03', status: 'Active' },
    { id: 5, name: 'James Oduya', username: 'officer2', department: 'Immigration', checkpoint: 'North Gate 01', status: 'Active' },
    { id: 6, name: 'Grace Wanjiku', username: 'officer3', department: 'Border Security', checkpoint: 'South Gate 01', status: 'On duty' }
  ]

  return (
    <div className="generic-page">
      <div className="page-heading">
        <div><span className="eyebrow">PERSONNEL</span><h1>Officers</h1><p>Monitor active officers across checkpoints.</p></div>
      </div>
      <div className="history-table">
        <table>
          <thead><tr><th>NAME</th><th>USERNAME</th><th>DEPARTMENT</th><th>CHECKPOINT</th><th>STATUS</th></tr></thead>
          <tbody>
            {officers.map((o) => (
              <tr key={o.id}>
                <td><strong>{o.name}</strong></td>
                <td className="mono">{o.username}</td>
                <td className="muted">{o.department}</td>
                <td className="muted">{o.checkpoint}</td>
                <td><span className="status-pill approved"><span />{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Metric({ icon: Icon, label, value, change, tone }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={18} /></div>
      <div><span>{label}</span><strong>{value}</strong></div>
      <em className={tone}>{change}</em>
    </div>
  )
}

function SupervisorOverrides({ overrides, overrideTarget, overrideReason, setOverrideReason, startOverride, submitOverride, setNotice }) {
  return (
    <div className="generic-page">
      <div className="page-heading">
        <div><span className="eyebrow">SUPERVISOR CONTROLS</span><h1>Override denials</h1><p>Review denied crossings and override decisions when justified.</p></div>
      </div>
      <div className="history-table">
        <table>
          <thead><tr><th>TRAVELER</th><th>CARD ID</th><th>TIME</th><th>REASON</th><th>ACTION</th></tr></thead>
          <tbody>
            {(overrides || []).length === 0 ? (
              <tr><td colSpan={5} className="muted">No denied crossings available for override.</td></tr>
            ) : (
              overrides.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name || c.traveler_id}</strong></td>
                  <td className="mono">{c.card || c.traveler_id}</td>
                  <td className="muted">{c.time || c.created_at ? new Date(c.created_at).toLocaleString('en-GB') : ''}</td>
                  <td className="muted">{c.reason || c.decision_reason}</td>
                  <td>
                    {overrideTarget?.id === c.id ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="Override reason" style={{ padding: 8, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 6, color: '#d9e8e4', fontSize: 11 }} />
                        <button className="primary-button" onClick={submitOverride} disabled={!overrideReason}>Confirm</button>
                        <button className="secondary-button" onClick={() => { setOverrideTarget(null); setOverrideReason('') }}>Cancel</button>
                      </div>
                    ) : (
                      <button className="primary-button" onClick={() => startOverride(c)}>Override</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
