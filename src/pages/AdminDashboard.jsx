import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { Users, Settings, LogOut, MapPin, ChevronDown, LayoutDashboard, Activity, ShieldCheck, X, ArrowRight, Radio, AlertTriangle as AlertIcon, Menu, Bell, Check, Search, CreditCard, UserPlus, UserCog, Globe, Wifi, WifiOff, Key, Monitor, AlertCircle, Clock, Users as StaffIcon, Download, FileText, Printer, CalendarClock } from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Alerts', icon: AlertIcon },
  { label: 'Queue', icon: Clock },
  { label: 'Staff', icon: StaffIcon },
  { label: 'Statistics', icon: Activity },
  { label: 'Users', icon: Users },
  { label: 'Roles', icon: UserCog },
  { label: 'Departments', icon: UserPlus },
  { label: 'Travelers', icon: Search },
  { label: 'Checkpoints', icon: MapPin },
  { label: 'Devices', icon: Radio },
  { label: 'Reports', icon: FileText },
  { label: 'Settings', icon: Settings },
  { label: 'Audit', icon: ShieldCheck },
]

export default function AdminDashboard({ onSwitchToLogin, selectedCheckpoint }) {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState('Overview')
  const [notice, setNotice] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [stats, setStats] = useState({ travelers: 0, officers: 0, departments: 0, checkpoints: 0, devices: 0, offlineDevices: 0, todayCrossings: 0, approved: 0, denied: 0 })
  const [devices, setDevices] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [dailyReport, setDailyReport] = useState(null)
  const [settings, setSettings] = useState({
    systemName: 'TAP & PASS',
    checkerAccessKey: '1234',
    offlineMode: true,
    defaultLanguage: 'en',
    dataRetentionDays: 90,
    autoSync: true
  })
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [queue, setQueue] = useState([])
  const [staff, setStaff] = useState([])
  const [statistics, setStatistics] = useState(null)

  const checkpointLabel = selectedCheckpoint ? `${selectedCheckpoint.name} — ${selectedCheckpoint.border}` : 'National Border'

  useEffect(() => {
    loadData()
    loadSettings()
  }, [])

  const loadData = async () => {
    try {
      const [dailyRes, travelersRes, devicesRes, auditRes, alertsRes, queueRes, staffRes, statsRes] = await Promise.all([
        api.getDailyReport(),
        api.getTravelers({ limit: 1 }),
        api.getDevices(),
        api.getAuditLogs({ limit: 20 }),
        api.getAlerts ? api.getAlerts() : Promise.resolve({ data: [] }),
        api.getCrossings({ status: 'pending' }),
        api.getUsers ? api.getUsers() : Promise.resolve({ data: [] }),
        api.getMonthlyReport ? api.getMonthlyReport() : Promise.resolve(null)
      ])
      if (dailyRes) {
        setDailyReport(dailyRes)
        setStats((s) => ({ ...s, todayCrossings: dailyRes.total || s.todayCrossings, approved: dailyRes.approved || s.approved, denied: dailyRes.denied || s.denied }))
      }
      if (travelersRes) setStats((s) => ({ ...s, travelers: travelersRes.total || s.travelers }))
      if (devicesRes) {
        const offline = (devicesRes.data || []).filter(d => d.status !== 'online').length
        setStats((s) => ({ ...s, devices: (devicesRes.data || []).length, offlineDevices: offline }))
        setDevices(devicesRes.data || [])
      }
      setAuditLogs(auditRes.data || [])
      setAlerts(alertsRes?.data || [])
      setQueue(queueRes?.data || [])
      setStaff(staffRes?.data || [])
      setStatistics(statsRes)
    } catch (err) {
      console.error('Failed to load admin data:', err)
    }
  }

  const loadSettings = async () => {
    try {
      const res = await api.getSettings()
      if (res?.data) {
        setSettings(res.data)
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const saveSettings = async () => {
    setSettingsLoading(true)
    setSettingsSaved(false)
    try {
      await api.updateSettings(settings)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setSettingsLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'is-open' : ''}`}>
        <div className="brand-mark">
          <div className="brand-emblem"><ShieldCheck size={18} strokeWidth={2.8} /></div>
          <div><strong>TAP <span>&</span> PASS</strong><small>Administration</small></div>
        </div>
        <div className="site-selector">
          <span className="eyebrow">SYSTEM</span>
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
          <div className="secure-badge"><ShieldCheck size={17} /><span><strong>Admin access</strong><small>Full control</small></span></div>
          <div className="profile-chip"><span className="avatar avatar-small">{user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}</span><span><strong>{user?.full_name || 'Administrator'}</strong><small>System administrator</small></span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav((current) => !current)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumb"><span>{checkpointLabel || 'National Border'}</span><ArrowRight size={14} /><strong>{activeView}</strong></div>
          <div className="topbar-actions">
            <div className="live-clock"><span className="pulse-dot" /> LIVE <time>{new Date().toLocaleTimeString('en-GB')}</time></div>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setActiveView('Audit')}><Bell size={19} /></button>
            <div className="top-avatar">{user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}</div>
          </div>
        </header>

        {activeView === 'Overview' && (
          <AdminOverview stats={stats} dailyReport={dailyReport} devices={devices} />
        )}

        {activeView === 'Settings' && (
          <div style={{ maxWidth: 780 }}>
            <div className="page-heading">
              <div>
                <span className="eyebrow">SYSTEM CONFIGURATION</span>
                <h1>Settings</h1>
                <p>Manage system-wide settings for border operations.</p>
              </div>
              <div className="heading-actions">
                <button className="primary-button" onClick={saveSettings} disabled={settingsLoading}>
                  {settingsLoading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>

            {settingsSaved && (
              <div style={{ padding: 12, marginBottom: 16, background: '#16382f', border: '1px solid #31715e', borderRadius: 8, color: '#83dfac' }}>
                Settings saved successfully.
              </div>
            )}

            <div className="info-card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginTop: 0 }}><Globe size={16} style={{ marginRight: 8 }} /> General</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 10, color: '#6d898a', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>System name</span>
                  <input value={settings.systemName} onChange={(e) => setSettings((s) => ({ ...s, systemName: e.target.value }))} style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12 }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 10, color: '#6d898a', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Default language</span>
                  <select value={settings.defaultLanguage} onChange={(e) => setSettings((s) => ({ ...s, defaultLanguage: e.target.value }))} style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12 }}>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="rw">Kinyarwanda</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="info-card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginTop: 0 }}><Key size={16} style={{ marginRight: 8 }} /> Checker access</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 10, color: '#6d898a', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Shared access key</span>
                  <input value={settings.checkerAccessKey} onChange={(e) => setSettings((s) => ({ ...s, checkerAccessKey: e.target.value }))} style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12 }} />
                  <span style={{ fontSize: 10, color: '#89a0a1' }}>Used by checkers at the access screen.</span>
                </label>
              </div>
            </div>

            <div className="info-card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginTop: 0 }}><AlertCircle size={16} style={{ marginRight: 8 }} /> Camera / face matching</h3>
              <div style={{ display: 'grid', gap: 10, fontSize: 11, color: '#89a0a1' }}>
                <div>This system supports manual photo review. For automated face matching, integrate an external camera/face recognition service and pass the match result into the traveler verification flow.</div>
                <div style={{ color: '#6d898a' }}>Integration point: POST to /api/travelers/:id/photo-match with camera image data.</div>
              </div>
            </div>

            <div className="info-card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginTop: 0 }}><Monitor size={16} style={{ marginRight: 8 }} /> Operations</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span>
                    <strong>Offline mode</strong>
                    <div style={{ fontSize: 10, color: '#89a0a1' }}>Allow checkers to continue working when connectivity drops.</div>
                  </span>
                  <input type="checkbox" checked={settings.offlineMode} onChange={(e) => setSettings((s) => ({ ...s, offlineMode: e.target.checked }))} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span>
                    <strong>Auto sync</strong>
                    <div style={{ fontSize: 10, color: '#89a0a1' }}>Sync pending actions automatically when back online.</div>
                  </span>
                  <input type="checkbox" checked={settings.autoSync} onChange={(e) => setSettings((s) => ({ ...s, autoSync: e.target.checked }))} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 10, color: '#6d898a', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Data retention (days)</span>
                  <input type="number" value={settings.dataRetentionDays} onChange={(e) => setSettings((s) => ({ ...s, dataRetentionDays: Number(e.target.value) }))} style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12 }} />
                </label>
              </div>
            </div>

            <div className="info-card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginTop: 0 }}><Download size={16} style={{ marginRight: 8 }} /> Backup & restore</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="secondary-button" onClick={async () => {
                  try {
                    const blob = await api.exportBackup()
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `tap-and-pass-backup-${new Date().toISOString().slice(0, 10)}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                    setNotice('Backup exported')
                  } catch (err) {
                    setNotice(err.message || 'Backup export failed')
                  }
                }}><Download size={16} /> Export JSON backup</button>
                <label className="primary-button" style={{ padding: 10, cursor: 'pointer' }}>
                  <input type="file" accept="application/json" style={{ display: 'none' }} onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      const text = await file.text()
                      await api.importBackup(JSON.parse(text))
                      setNotice('Backup imported')
                      loadData()
                      loadSettings()
                    } catch (err) {
                      setNotice(err.message || 'Restore failed')
                    }
                  }} />
                  Import JSON backup
                </label>
              </div>
            </div>
          </div>
        )}

        {activeView === 'Users' && <UsersPage setNotice={setNotice} />}
        {activeView === 'Roles' && <RolesPage setNotice={setNotice} />}
        {activeView === 'Departments' && <DepartmentsPage setNotice={setNotice} />}
        {activeView === 'Travelers' && <TravelersPage setNotice={setNotice} />}
        {activeView === 'Checkpoints' && <CheckpointsPage setNotice={setNotice} />}
        {activeView === 'Devices' && <DevicesPage setNotice={setNotice} />}
        {activeView === 'Reports' && <ReportsPage setNotice={setNotice} />}
        {activeView === 'Audit' && <AuditLogsPage setNotice={setNotice} />}
        {activeView === 'Alerts' && <AlertsPage alerts={alerts} setNotice={setNotice} />}
        {activeView === 'Queue' && <QueuePage queue={queue} setNotice={setNotice} />}
        {activeView === 'Staff' && <StaffPage staff={staff} setNotice={setNotice} />}
        {activeView === 'Statistics' && <StatisticsPage statistics={statistics} stats={stats} />}
      </main>

      {notice && <div className="toast"><Check size={17} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
    </div>
  )
}

function AdminOverview({ stats, dailyReport, devices }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMIN PANEL / {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
          <h1>Overview</h1>
          <p>System-wide operational status.</p>
        </div>
      </div>
      <section className="metric-row">
        <Metric icon={Users} label="Travelers" value={String(stats.travelers)} tone="teal" />
        <Metric icon={Activity} label="Today crossings" value={String(stats.todayCrossings)} tone="blue" />
        <Metric icon={Check} label="Approved" value={String(stats.approved)} tone="green" />
        <Metric icon={AlertIcon} label="Denied" value={String(stats.denied)} tone="amber" />
      </section>
      <div className="info-card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Devices</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {(devices || []).map((device) => (
            <div key={device.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: '#0c2026', border: '1px solid #20383d', borderRadius: 8 }}>
              <div>
                <strong>{device.device_name}</strong>
                <div style={{ fontSize: 10, color: '#89a0a1' }}>{device.id} • {device.device_type}</div>
              </div>
              <span className={`status-pill ${device.status === 'online' ? 'approved' : 'denied'}`}><span />{device.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function AdminSection({ title, description }) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">ADMIN PANEL</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  )
}

function Metric({ icon: Icon, label, value, tone }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={18} /></div>
      <div><span>{label}</span><strong>{value}</strong></div>
    </div>
  )
}

function AlertsPage({ alerts, setNotice }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">SYSTEM ALERTS</span>
          <h1>Alerts</h1>
          <p>Active alerts and watchlist notifications.</p>
        </div>
      </div>
      <div className="info-card" style={{ marginTop: 20 }}>
        {(alerts || []).length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No active alerts.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {(alerts || []).map((alert) => (
              <div key={alert.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#0c2026', border: '1px solid #20383d', borderRadius: 8 }}>
                <div>
                  <strong>{alert.message || alert.type || 'Alert'}</strong>
                  <div style={{ fontSize: 10, color: '#89a0a1' }}>{alert.traveler_id ? `Traveler: ${alert.traveler_id}` : ''} • {alert.created_at ? new Date(alert.created_at).toLocaleString() : ''}</div>
                </div>
                <span className={`status-pill ${alert.severity === 'warning' ? 'denied' : alert.severity === 'critical' ? 'denied' : 'approved'}`}><span />{alert.status || 'open'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function QueuePage({ queue, setNotice }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">CROSSING QUEUE</span>
          <h1>Queue</h1>
          <p>Pending crossings across all checkpoints.</p>
        </div>
      </div>
      <div className="info-card" style={{ marginTop: 20 }}>
        {(queue || []).length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No pending crossings.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {(queue || []).map((crossing) => (
              <div key={crossing.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#0c2026', border: '1px solid #20383d', borderRadius: 8 }}>
                <div>
                  <strong>{crossing.id}</strong>
                  <div style={{ fontSize: 10, color: '#89a0a1' }}>Traveler: {crossing.traveler_id} • Card: {crossing.card_id} • Checkpoint: {crossing.checkpoint_id}</div>
                </div>
                <span className={`status-pill ${crossing.status === 'pending' ? 'denied' : crossing.status}`}><span />{crossing.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function StaffPage({ staff, setNotice }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">PERSONNEL</span>
          <h1>Staff</h1>
          <p>Checkers, officers, and supervisors.</p>
        </div>
      </div>
      <div className="info-card" style={{ marginTop: 20 }}>
        {(staff || []).length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No staff records found.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {(staff || []).map((person) => (
              <div key={person.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#0c2026', border: '1px solid #20383d', borderRadius: 8 }}>
                <div>
                  <strong>{person.full_name || person.username}</strong>
                  <div style={{ fontSize: 10, color: '#89a0a1' }}>{person.email} • Role: {person.role_id} • Dept: {person.department_id}</div>
                </div>
                <span className={`status-pill ${person.status === 'active' ? 'approved' : 'denied'}`}><span />{person.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function StatisticsPage({ statistics, stats }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ANALYTICS</span>
          <h1>Statistics</h1>
          <p>Operational metrics and trends.</p>
        </div>
      </div>
      <section className="metric-row" style={{ marginTop: 20 }}>
        <Metric icon={Activity} label="Today crossings" value={String(stats.todayCrossings || 0)} tone="teal" />
        <Metric icon={Check} label="Approved" value={String(stats.approved || 0)} tone="green" />
        <Metric icon={AlertIcon} label="Denied" value={String(stats.denied || 0)} tone="amber" />
        <Metric icon={Users} label="Travelers" value={String(stats.travelers || 0)} tone="blue" />
      </section>
      <div className="info-card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Monthly summary</h3>
        {statistics ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <div>Month: {statistics.month}</div>
            <div>Total: {statistics.total}</div>
            <div>Approved: {statistics.approved}</div>
            <div>Denied: {statistics.denied}</div>
            <div>Pending: {statistics.pending}</div>
            <div>Approval rate: {statistics.approval_rate}%</div>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)' }}>No monthly statistics available.</p>
        )}
      </div>
    </>
  )
}

function TravelersPage({ setNotice }) {
  const [travelers, setTravelers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTravelers = async () => {
      try {
        const res = await api.getTravelers()
        setTravelers(res.data || [])
      } catch (err) {
        setError(err.message || 'Failed to load travelers')
      } finally {
        setLoading(false)
      }
    }
    loadTravelers()
  }, [])

  const handlePhotoUpload = async (travelerId, file) => {
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result
        await api.updateTravelerPhoto(travelerId, { photo: base64 })
        setNotice('Traveler photo updated')
        setTravelers((prev) => prev.map(t => t.id === travelerId ? { ...t, photo: base64 } : t))
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError(err.message || 'Failed to upload photo')
    }
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <div className="page-heading">
        <div>
          <span className="eyebrow">TRAVELER REGISTRY</span>
          <h1>Travelers</h1>
          <p>Manage traveler identities and document photos.</p>
        </div>
      </div>
      {error && <div style={{ padding: 12, marginBottom: 16, background: '#3b2222', border: '1px solid #664040', borderRadius: 8, color: '#f18d89' }}>{error}</div>}
      <div className="info-card">
        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading travelers...</p>
        ) : travelers.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No travelers found.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {travelers.map((traveler) => (
              <div key={traveler.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#0c2026', border: '1px solid #20383d', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {traveler.photo ? (
                    <img src={traveler.photo} alt={traveler.full_name} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: 6, background: '#285259', color: '#b9e8d8', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12 }}>
                      {traveler.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <strong>{traveler.full_name}</strong>
                    <div style={{ fontSize: 10, color: '#89a0a1' }}>{traveler.id} • {traveler.passport_number} • {traveler.nationality}</div>
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handlePhotoUpload(traveler.id, file)
                    }}
                  />
                  <span className="primary-button" style={{ padding: '6px 10px', fontSize: 10 }}>Upload photo</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function UsersPage({ setNotice }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ username: '', password: '', full_name: '', email: '', role_id: 3, department_id: 1, checkpoint_id: '', status: 'active' })
  const [editingId, setEditingId] = useState(null)

  const loadUsers = async () => {
    try {
      const res = await api.getUsers()
      setUsers(res.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!editingId && users.some(u => u.username === form.username)) {
      setError('Username already exists')
      return
    }
    try {
      if (editingId) {
        await api.updateUser(editingId, form)
        setNotice('User updated')
      } else {
        await api.createUser(form)
        setNotice('User created')
      }
      setForm({ username: '', password: '', full_name: '', email: '', role_id: 3, department_id: 1, checkpoint_id: '', status: 'active' })
      setEditingId(null)
      loadUsers()
    } catch (err) {
      setError(err.message || 'Save failed')
    }
  }

  const handleEdit = (user) => {
    setEditingId(user.id)
    setForm({ username: user.username, password: '', full_name: user.full_name, email: user.email || '', role_id: user.role_id, department_id: user.department_id, checkpoint_id: user.checkpoint_id || '', status: user.status })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.deleteUser(id)
      setNotice('User deleted')
      loadUsers()
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <div className="page-heading">
        <div><span className="eyebrow">PERSONNEL</span><h1>Users</h1><p>Create, edit, and deactivate user accounts.</p></div>
      </div>
      {error && <div style={{ padding: 12, marginBottom: 16, background: '#3b2222', border: '1px solid #664040', borderRadius: 8, color: '#f18d89' }}>{error}</div>}
      <div className="info-card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit user' : 'New user'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="Username" required style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12 }} />
          <input value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} placeholder="Full name" required style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12 }} />
          <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" type="email" style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12 }} />
          <input value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder={editingId ? 'New password (optional)' : 'Password'} type="password" required={!editingId} style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12 }} />
          <select value={form.role_id} onChange={(e) => setForm((f) => ({ ...f, role_id: Number(e.target.value) }))} style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12 }}>
            <option value="1">Administrator</option>
            <option value="2">Supervisor</option>
            <option value="3">Officer</option>
            <option value="4">Department Officer</option>
          </select>
          <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} style={{ padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 7, color: '#d9e8e4', fontSize: 12 }}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="primary-button">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="secondary-button" onClick={() => { setEditingId(null); setForm({ username: '', password: '', full_name: '', email: '', role_id: 3, department_id: 1, checkpoint_id: '', status: 'active' }) }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="info-card">
        {loading ? <p>Loading users...</p> : (
          <div className="history-table">
            <table>
              <thead><tr><th>NAME</th><th>USERNAME</th><th>ROLE</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.full_name}</strong></td>
                    <td className="mono">{u.username}</td>
                    <td className="muted">{u.role_id}</td>
                    <td><span className={`status-pill ${u.status === 'active' ? 'approved' : 'denied'}`}><span />{u.status}</span></td>
                    <td>
                      <button className="secondary-button" onClick={() => handleEdit(u)} style={{ padding: '4px 8px', fontSize: 10 }}>Edit</button>
                      <button className="secondary-button" onClick={() => handleDelete(u.id)} style={{ padding: '4px 8px', fontSize: 10, color: 'var(--red)' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function RolesPage({ setNotice }) {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setRoles([
          { id: 1, name: 'Administrator', description: 'Full system access' },
          { id: 2, name: 'Supervisor', description: 'Monitor and manage operations' },
          { id: 3, name: 'Officer', description: 'Process border crossings' },
          { id: 4, name: 'Department Officer', description: 'Department-specific access' }
        ])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadRoles()
  }, [])

  return (
    <div style={{ maxWidth: 980 }}>
      <div className="page-heading"><div><span className="eyebrow">ACCESS CONTROL</span><h1>Roles</h1><p>Role definitions and hierarchy.</p></div></div>
      <div className="info-card">
        {loading ? <p>Loading roles...</p> : (
          <div className="history-table">
            <table>
              <thead><tr><th>ID</th><th>NAME</th><th>DESCRIPTION</th></tr></thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.id}><td className="mono">{r.id}</td><td><strong>{r.name}</strong></td><td className="muted">{r.description}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function DepartmentsPage({ setNotice }) {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setDepartments([
          { id: 1, name: 'Immigration', description: 'Immigration control' },
          { id: 2, name: 'Customs', description: 'Customs and excise' },
          { id: 3, name: 'Border Security', description: 'Border security' },
          { id: 4, name: 'Police', description: 'Border police' },
          { id: 5, name: 'Health', description: 'Health and quarantine' },
          { id: 6, name: 'Administration', description: 'Administrative support' }
        ])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: 980 }}>
      <div className="page-heading"><div><span className="eyebrow">ORGANIZATION</span><h1>Departments</h1><p>Department configuration and assignments.</p></div></div>
      <div className="info-card">
        {loading ? <p>Loading departments...</p> : (
          <div className="history-table">
            <table>
              <thead><tr><th>ID</th><th>NAME</th><th>DESCRIPTION</th></tr></thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id}><td className="mono">{d.id}</td><td><strong>{d.name}</strong></td><td className="muted">{d.description}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function CheckpointsPage({ setNotice }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getCheckpoints()
        setItems(res.data || [])
      } catch (err) {
        setError(err.message || 'Failed to load checkpoints')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: 980 }}>
      <div className="page-heading"><div><span className="eyebrow">LOCATIONS</span><h1>Checkpoints</h1><p>Border checkpoint configuration.</p></div></div>
      {error && <div style={{ padding: 12, marginBottom: 16, background: '#3b2222', border: '1px solid #664040', borderRadius: 8, color: '#f18d89' }}>{error}</div>}
      <div className="info-card">
        {loading ? <p>Loading checkpoints...</p> : (
          <div className="history-table">
            <table>
              <thead><tr><th>ID</th><th>NAME</th><th>BORDER</th><th>LOCATION</th><th>STATUS</th></tr></thead>
              <tbody>
                {items.map((cp) => (
                  <tr key={cp.id}>
                    <td className="mono">{cp.id}</td>
                    <td><strong>{cp.name}</strong></td>
                    <td className="muted">{cp.border_name}</td>
                    <td className="muted">{cp.location}</td>
                    <td><span className={`status-pill ${cp.status === 'OPEN' ? 'approved' : 'denied'}`}><span />{cp.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function DevicesPage({ setNotice }) {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getDevices()
        setDevices(res.data || [])
      } catch (err) {
        setError(err.message || 'Failed to load devices')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: 980 }}>
      <div className="page-heading"><div><span className="eyebrow">HARDWARE</span><h1>Devices</h1><p>Reader devices and connectivity.</p></div></div>
      {error && <div style={{ padding: 12, marginBottom: 16, background: '#3b2222', border: '1px solid #664040', borderRadius: 8, color: '#f18d89' }}>{error}</div>}
      <div className="info-card">
        {loading ? <p>Loading devices...</p> : (
          <div className="history-table">
            <table>
              <thead><tr><th>ID</th><th>NAME</th><th>TYPE</th><th>SERIAL</th><th>STATUS</th></tr></thead>
              <tbody>
                {devices.map((d) => (
                  <tr key={d.id}>
                    <td className="mono">{d.id}</td>
                    <td><strong>{d.device_name}</strong></td>
                    <td className="muted">{d.device_type}</td>
                    <td className="muted">{d.serial_number}</td>
                    <td><span className={`status-pill ${d.status === 'online' ? 'approved' : 'denied'}`}><span />{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function ReportsPage({ setNotice }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadDaily = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.getDailyReport()
      setReport(res)
    } catch (err) {
      setError(err.message || 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDaily()
  }, [])

  return (
    <div style={{ maxWidth: 980 }}>
      <div className="page-heading"><div><span className="eyebrow">ANALYTICS</span><h1>Reports</h1><p>Operational reports and exports.</p></div></div>
      {error && <div style={{ padding: 12, marginBottom: 16, background: '#3b2222', border: '1px solid #664040', borderRadius: 8, color: '#f18d89' }}>{error}</div>}
      <div className="info-card">
        {loading ? <p>Loading report...</p> : report ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <div>Date: {report.date}</div>
            <div>Total: {report.total}</div>
            <div>Approved: {report.approved}</div>
            <div>Denied: {report.denied}</div>
            <div>Pending: {report.pending}</div>
            <div>Approval rate: {report.approval_rate}%</div>
          </div>
        ) : <p className="muted">No report available.</p>}
      </div>
    </div>
  )
}

function AuditLogsPage({ setNotice }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getAuditLogs()
        setLogs(res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: 980 }}>
      <div className="page-heading"><div><span className="eyebrow">SECURITY</span><h1>Audit logs</h1><p>System audit trail.</p></div></div>
      <div className="info-card">
        {loading ? <p>Loading audit logs...</p> : (
          <div className="history-table">
            <table>
              <thead><tr><th>TIMESTAMP</th><th>USER</th><th>ACTION</th><th>RESOURCE</th></tr></thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="muted">{new Date(log.timestamp).toLocaleString('en-GB')}</td>
                    <td><strong>User {log.user_id}</strong></td>
                    <td><span className="status-pill approved"><span />{log.action}</span></td>
                    <td className="muted">{log.resource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}