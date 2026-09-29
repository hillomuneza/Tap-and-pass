import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { useCardReader } from '../hooks/useCardReader'
import { useQueue } from '../hooks/useQueue'
import { useNotifications } from '../hooks/useNotifications'
import { useOfflineMode } from '../hooks/useOfflineMode'
import { exportCrossingsToCSV, exportTravelersToCSV } from '../utils/export'
import { LayoutDashboard, History, AlertTriangle, Radio, Settings, LogOut, Activity, Users, Check, Clock3, MapPin, ChevronDown, Bell, CreditCard, ShieldCheck, Gauge, X, ArrowRight, Search, Radio as ScanIcon, AlertTriangle as AlertIcon, Menu, Zap, User, Printer, CalendarClock } from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, permission: 'canViewCrossings' },
  { label: 'Search', icon: Search, permission: 'canViewCrossings' },
  { label: 'Travelers', icon: Users, permission: 'canViewCrossings' },
  { label: 'Crossing history', icon: History, permission: 'canViewCrossings' },
  { label: 'Alerts', icon: AlertTriangle, permission: 'canViewCrossings', count: 2 },
  { label: 'Checkpoint', icon: Radio, permission: 'canManageDevices' },
]

const departmentPermissions = {
  Immigration: ['canViewCrossings', 'canApproveDeny', 'canExportReports'],
  Customs: ['canViewCrossings', 'canExportReports'],
  'Border Security': ['canViewCrossings', 'canApproveDeny', 'canViewSecurity', 'canViewPolice', 'canViewAudit', 'canExportReports'],
  Police: ['canViewCrossings', 'canViewSecurity', 'canViewPolice', 'canViewAudit'],
  Health: ['canViewCrossings', 'canViewHealth'],
  Administration: ['canViewCrossings', 'canApproveDeny', 'canViewCustoms', 'canViewSecurity', 'canViewPolice', 'canViewHealth', 'canManageUsers', 'canViewAudit', 'canManageDevices', 'canExportReports']
}

function getFilteredNavItems(departmentName) {
  const allowed = departmentPermissions[departmentName] || departmentPermissions['Administration']
  return navItems.filter(item => !item.permission || allowed.includes(item.permission))
}

const departmentMap = {
  1: 'Immigration',
  2: 'Customs',
  3: 'Border Security',
  4: 'Police',
  5: 'Health',
  6: 'Administration'
}

export default function OfficerDashboard({ onSwitchToLogin, selectedCheckpoint }) {
  const { user, logout } = useAuth()
  const userDepartmentName = user?.department_id ? departmentMap[user.department_id] : 'Administration'
  const [activeView, setActiveView] = useState('Overview')
  const [selectedTraveler, setSelectedTraveler] = useState(null)
  const [crossings, setCrossings] = useState([])
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const [notice, setNotice] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [metrics, setMetrics] = useState({ processed: 0, approved: 0, review: 0, avgTime: '0s' })
  const [travelers, setTravelers] = useState([])
  const [currentCrossingId, setCurrentCrossingId] = useState(null)
  const [manualLookup, setManualLookup] = useState('')
  const [dataError, setDataError] = useState('')
  const [shiftStartedAt, setShiftStartedAt] = useState(() => {
    const stored = localStorage.getItem('tap_shift_started_at')
    return stored || null
  })
  const [receipt, setReceipt] = useState(null)

  const checkpointLabel = selectedCheckpoint ? `${selectedCheckpoint.name} — ${selectedCheckpoint.border}` : 'Border Checkpoint'

  const { connected, lastEvent, sendCardDetected, sendAllow, sendDeny } = useCardReader()
  const { queues } = useQueue()
  const { addNotification, unreadCount } = useNotifications()
  const { isOnline: offlineOnline } = useOfflineMode()

  useEffect(() => {
    if (!offlineOnline) {
      addNotification({ type: 'offline', severity: 'warning', message: 'System is offline. Actions will be queued.', title: 'Offline mode' })
    }
  }, [offlineOnline, addNotification])

  useEffect(() => {
    if (!lastEvent) return
    if (lastEvent.type === 'traveler_found') {
      const { traveler, crossing } = lastEvent.payload
      setSelectedTraveler({
        ...traveler,
        initials: traveler.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2),
        name: traveler.full_name,
        dob: traveler.date_of_birth,
        document: traveler.passport_number,
        expiry: traveler.passport_expiry,
        status: traveler.status === 'active' ? 'Eligible' : traveler.status,
        documentStatus: 'Valid',
        alert: null,
        lastCrossing: 'Real-time scan',
        photo: traveler.photo || null
      })
      setCurrentCrossingId(crossing.id)
      setNotice(`Card detected • ${traveler.id}`)
    } else if (lastEvent.type === 'card_not_found') {
      setNotice(`Card not found • ${lastEvent.card_id}`)
      setSelectedTraveler(null)
    } else if (lastEvent.type === 'decision_confirmed') {
      setNotice(`Decision recorded • ${lastEvent.crossing_id}`)
      setSelectedTraveler(null)
      setModal(null)
      setCurrentCrossingId(null)
    }
  }, [lastEvent])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setDataError('')
      const [travelersRes, crossingsRes] = await Promise.all([
        api.getTravelers(),
        api.getCrossings()
      ])
      setTravelers(travelersRes.data || [])
      const data = crossingsRes.data || []
      setCrossings(data)
      const today = new Date().toISOString().split('T')[0]
      const todayCrossings = data.filter(c => c.created_at?.startsWith(today))
      const approved = todayCrossings.filter(c => c.status === 'approved').length
      const denied = todayCrossings.filter(c => c.status === 'denied').length
      setMetrics({
        processed: todayCrossings.length || 0,
        approved: approved || 0,
        review: denied || 0,
        avgTime: '0s'
      })
    } catch (err) {
      console.error('Failed to load data:', err)
      setDataError(err.message || 'Failed to load dashboard data')
    }
  }

  const matchTraveler = async (entryValue) => {
    const value = (entryValue || '').trim()
    if (!value) {
      setNotice('Enter a card ID or passport number to match a traveler')
      return
    }

    const normalized = value.toLowerCase()
    const matchedTraveler = travelers.find((traveler) => {
      const candidateValues = [
        traveler.id,
        traveler.passport_number,
        traveler.full_name,
        traveler.nationality
      ].map((item) => String(item || '').toLowerCase())
      return candidateValues.some((candidate) => candidate.includes(normalized))
    })

    if (matchedTraveler) {
      setSelectedTraveler({
        ...matchedTraveler,
        initials: matchedTraveler.full_name?.split(' ').map((name) => name[0]).join('').slice(0, 2),
        name: matchedTraveler.full_name,
        dob: matchedTraveler.date_of_birth,
        document: matchedTraveler.passport_number,
        expiry: matchedTraveler.passport_expiry,
        status: matchedTraveler.status === 'active' ? 'Eligible' : matchedTraveler.status,
        documentStatus: 'Valid',
        alert: null,
        lastCrossing: 'Verified using scanned passport',
        photo: matchedTraveler.photo || null,
        faceMatch: 'MATCHED'
      })
      setManualLookup('')
      setNotice(`Traveler matched • ${matchedTraveler.full_name}`)
      return
    }

    try {
      const response = await api.searchTravelers(value)
      const resolvedTraveler = response.data?.[0]
      if (!resolvedTraveler) {
        setNotice('No traveler match found for this ID or passport')
        return
      }

      setSelectedTraveler({
        ...resolvedTraveler,
        initials: resolvedTraveler.full_name?.split(' ').map((name) => name[0]).join('').slice(0, 2),
        name: resolvedTraveler.full_name,
        dob: resolvedTraveler.date_of_birth,
        document: resolvedTraveler.passport_number,
        expiry: resolvedTraveler.passport_expiry,
        status: resolvedTraveler.status === 'active' ? 'Eligible' : resolvedTraveler.status,
        documentStatus: 'Valid',
        alert: null,
        lastCrossing: 'Verified using scanned passport',
        photo: resolvedTraveler.photo || null,
        faceMatch: 'MATCHED'
      })
      setManualLookup('')
      setNotice(`Traveler matched • ${resolvedTraveler.full_name}`)
    } catch (error) {
      setNotice(error.message || 'No traveler match found')
    }
  }

  const scanCard = (traveler = null) => {
    if (traveler) {
      setSelectedTraveler({
        ...traveler,
        initials: traveler.full_name?.split(' ').map((name) => name[0]).join('').slice(0, 2),
        name: traveler.full_name,
        dob: traveler.date_of_birth,
        document: traveler.passport_number,
        expiry: traveler.passport_expiry,
        status: traveler.status === 'active' ? 'Eligible' : traveler.status,
        documentStatus: 'Valid',
        alert: null,
        faceMatch: 'MATCHED',
        lastCrossing: 'Verified using scanned passport'
      })
      setNotice(`Card detected • ${traveler.id}`)
    } else if (travelers.length > 0) {
      const randomTraveler = travelers[Math.floor(Math.random() * travelers.length)]
      setSelectedTraveler({
        ...randomTraveler,
        initials: randomTraveler.full_name?.split(' ').map((name) => name[0]).join('').slice(0, 2),
        name: randomTraveler.full_name,
        dob: randomTraveler.date_of_birth,
        document: randomTraveler.passport_number,
        expiry: randomTraveler.passport_expiry,
        status: randomTraveler.status === 'active' ? 'Eligible' : randomTraveler.status,
        documentStatus: 'Valid',
        alert: null,
        faceMatch: 'MATCHED',
        lastCrossing: 'Verified using scanned passport'
      })
      setNotice(`Card detected • ${randomTraveler.id}`)
    }
  }

  const openDecision = (decision) => {
    if (!selectedTraveler) return
    setModal({ type: decision, traveler: selectedTraveler })
  }

  const completeDecision = async (reason) => {
    const decision = modal.type === 'allow' ? 'approved' : 'denied'
    const transaction = {
      id: `TP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(crossings.length + 422).padStart(5, '0')}`,
      name: modal.traveler.full_name || modal.traveler.name,
      card: modal.traveler.id,
      time: new Date().toLocaleTimeString('en-GB'),
      outcome: decision === 'approved' ? 'Approved' : 'Denied',
      reason: reason || 'Verified identity',
      checkpoint: selectedCheckpoint?.name || 'Border Checkpoint',
      officer: user?.full_name || 'Border Checker',
      document: modal.traveler.document || modal.traveler.passport_number,
      expiry: modal.traveler.expiry || modal.traveler.passport_expiry
    }
    setCrossings((current) => [transaction, ...current])

    try {
      const checkpointId = selectedCheckpoint?.id || modal.traveler.checkpoint_id || 3
      const createRes = await api.createCrossing({
        traveler_id: modal.traveler.id,
        card_id: modal.traveler.id,
        checkpoint_id: checkpointId,
        direction: 'entry'
      })

      if (createRes?.data?.id) {
        if (decision === 'approved') {
          await api.approveCrossing(createRes.data.id, reason)
        } else {
          await api.denyCrossing(createRes.data.id, reason)
        }
      }
    } catch (err) {
      console.error('Failed to persist crossing decision:', err)
    }

    if (currentCrossingId) {
      if (decision === 'approved') {
        sendAllow(currentCrossingId, selectedCheckpoint?.device_id || 'DEV-003')
      } else {
        sendDeny(currentCrossingId, selectedCheckpoint?.device_id || 'DEV-003', reason)
      }
    }

    setReceipt(transaction)
    setModal(null)
    setNotice(`${decision === 'approved' ? 'Approved' : 'Denied'} recorded • ${transaction.id}`)
    setSelectedTraveler(null)
    setCurrentCrossingId(null)
    setMetrics((m) => ({ ...m, processed: m.processed + 1, approved: m.approved + (decision === 'approved' ? 1 : 0), review: m.review + (decision === 'denied' ? 1 : 0) }))
  }

  const startShift = () => {
    const now = new Date().toISOString()
    setShiftStartedAt(now)
    localStorage.setItem('tap_shift_started_at', now)
    setNotice('Shift started')
  }

  const endShift = () => {
    setShiftStartedAt(null)
    localStorage.removeItem('tap_shift_started_at')
    setNotice('Shift ended')
  }

  const filteredCrossings = crossings.filter((c) =>
    [c.name, c.card, c.id, c.outcome].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'is-open' : ''}`}>
        <div className="brand-mark">
          <div className="brand-emblem"><Zap size={18} strokeWidth={2.8} /></div>
          <div><strong>TAP <span>&</span> PASS</strong><small>Border operations</small></div>
        </div>
        <div className="site-selector">
          <span className="eyebrow">CURRENT CHECKPOINT</span>
          <button className="site-button"><span><MapPin size={15} /> {checkpointLabel}</span><ChevronDown size={15} /></button>
          <div className="connection"><span className="pulse-dot" /> {connected ? 'All systems operational' : 'WebSocket disconnected'}</div>
        </div>
        <nav>
          <span className="eyebrow nav-label">WORKSPACE</span>
          {getFilteredNavItems(userDepartmentName).map(({ label, icon: Icon, count }) => (
            <button key={label} className={`nav-item ${activeView === label ? 'active' : ''}`} onClick={() => { setActiveView(label); setMobileNav(false) }}>
              <Icon size={18} /><span>{label}</span>{count && <b>{count}</b>}
            </button>
          ))}
          <span className="eyebrow nav-label utility-label">SYSTEM</span>
          <button className="nav-item" onClick={() => setNotice('Settings are restricted to supervisors')}><Settings size={18} /><span>Settings</span></button>
          <button className="nav-item" onClick={() => { logout(); onSwitchToLogin() }}><LogOut size={18} /><span>Sign out</span></button>
        </nav>
        <div className="sidebar-footer">
          <div className="secure-badge"><ShieldCheck size={17} /><span><strong>Secure session</strong><small>Encrypted & audited</small></span></div>
        </div>
      </aside>

      <main className="main-content">
        {!selectedCheckpoint ? (
          <div style={{ padding: 24, margin: 16, background: '#122b2e', border: '1px solid #31545a', borderRadius: 8, color: '#eef7f4' }}>
            <h3 style={{ marginTop: 0 }}>Select your checkpoint</h3>
            <p style={{ color: '#89a0a1' }}>Choose the border checkpoint where you are working before proceeding.</p>
            <button className="primary-button" onClick={() => { window.location.hash = '#/checkpoint' }}>Select checkpoint</button>
          </div>
        ) : (
          <>
            {dataError && (
              <div style={{ padding: 16, margin: 16, background: '#3b2222', border: '1px solid #664040', borderRadius: 8, color: '#f18d89' }}>
                {dataError}
              </div>
            )}
            <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav((current) => !current)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumb"><span>{checkpointLabel || 'Border Checkpoint'}</span><ArrowRight size={14} /><strong>{activeView}</strong></div>
          <div className="topbar-actions">
            <div className="live-clock"><span className="pulse-dot" /> LIVE <time>{new Date().toLocaleTimeString('en-GB')}</time></div>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setActiveView('Alerts')}><Bell size={19} /><i>{unreadCount > 0 ? unreadCount : 2}</i></button>
          </div>
        </header>

        {activeView === 'Overview' && (
          <Overview
            selectedTraveler={selectedTraveler}
            setSelectedTraveler={setSelectedTraveler}
            setCurrentCrossingId={setCurrentCrossingId}
            checkpointLabel={checkpointLabel}
            scanCard={scanCard}
            matchTraveler={matchTraveler}
            manualLookup={manualLookup}
            setManualLookup={setManualLookup}
            openDecision={openDecision}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            crossings={crossings}
            setNotice={setNotice}
            metrics={metrics}
            wsConnected={connected}
            queues={queues}
          />
        )}
        {activeView === 'Search' && <SearchView travelers={travelers} scanCard={scanCard} setActiveView={setActiveView} setNotice={setNotice} />}
        {activeView === 'Travelers' && <TravelersPage travelers={travelers} scanCard={scanCard} setActiveView={setActiveView} setNotice={setNotice} />}
        {activeView === 'Crossing history' && (
          <HistoryView crossings={filteredCrossings} search={search} setSearch={setSearch} />
        )}
        {activeView === 'Alerts' && <AlertsView setNotice={setNotice} />}
        {activeView === 'Checkpoint' && <CheckpointView isOnline={isOnline} setIsOnline={setIsOnline} setNotice={setNotice} wsConnected={connected} />}
          </>
        )}
      </main>

      {notice && <div className="toast"><Check size={17} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
      {modal && <DecisionModal modal={modal} close={() => setModal(null)} complete={completeDecision} checkpointLabel={checkpointLabel} />}
      {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
      {!shiftStartedAt && (
        <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9, background: '#123338', border: '1px solid #31545a', borderRadius: 8, padding: 10, color: '#eef7f4', fontSize: 11 }}>
          <div style={{ marginBottom: 6 }}>Shift not started</div>
          <button className="primary-button" onClick={startShift} style={{ padding: '6px 10px', fontSize: 10 }}>Start shift</button>
        </div>
      )}
      {shiftStartedAt && (
        <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9, background: '#16382f', border: '1px solid #31715e', borderRadius: 8, padding: 10, color: '#83dfac', fontSize: 11 }}>
          <div style={{ marginBottom: 6 }}>Shift active since {new Date(shiftStartedAt).toLocaleTimeString('en-GB')}</div>
          <button className="primary-button" onClick={endShift} style={{ padding: '6px 10px', fontSize: 10, background: 'var(--red)', borderColor: 'var(--red)' }}>End shift</button>
        </div>
      )}
    </div>
  )
}

function Overview({ selectedTraveler, setSelectedTraveler, setCurrentCrossingId, checkpointLabel, scanCard, matchTraveler, manualLookup, setManualLookup, openDecision, isOnline, setIsOnline, crossings, setNotice, metrics, wsConnected, queues }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">OFFICER WORKSPACE / {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
           <h1>Good morning.</h1>
          <p>Process the next traveler with care and confidence.</p>
        </div>
        <div className="heading-actions">
          <button className="secondary-button" onClick={() => setNotice('Report export is queued for your supervisor')}><Activity size={16} /> Shift report</button>
          <button className="primary-button" onClick={() => scanCard()}><CreditCard size={16} /> Simulate card tap</button>
        </div>
      </div>

      <div className="info-card" style={{ marginBottom: 20, padding: 18 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="eyebrow">MANUAL MATCH</span>
            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>Tap a traveler card ID or passport to verify identity.</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260, alignItems: 'center', justifyContent: 'flex-end' }}>
            <input
              value={manualLookup}
              onChange={(event) => setManualLookup(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  matchTraveler(manualLookup)
                }
              }}
              placeholder="Scan traveler ID or passport"
              style={{ flex: 1, maxWidth: 360, padding: 12, background: '#0a1c22', border: '1px solid #29434a', borderRadius: 8, color: '#d9e8e4' }}
            />
            <button className="primary-button" onClick={() => matchTraveler(manualLookup)}>Match traveler</button>
          </div>
        </div>
      </div>
      <section className="metric-row">
        <Metric icon={Users} label="Processed today" value={String(metrics.processed)} change="+12.4%" tone="teal" />
        <Metric icon={Check} label="Approved" value={String(metrics.approved)} change={`${metrics.processed ? Math.round((metrics.approved / metrics.processed) * 100) : 0}%`} tone="green" />
        <Metric icon={AlertTriangle} label="Requires review" value={String(metrics.review)} change={`${metrics.processed ? Math.round((metrics.review / metrics.processed) * 100) : 0}%`} tone="amber" />
        <Metric icon={Clock3} label="Avg. processing" value={metrics.avgTime} change="-8s vs avg" tone="blue" />
      </section>
      <div className="workspace-grid">
        <section className="verification-panel">
          {!selectedTraveler ? (
            <EmptyScanner scanCard={scanCard} wsConnected={wsConnected} checkpointLabel={checkpointLabel} />
          ) : (
            <TravelerVerification traveler={selectedTraveler} openDecision={openDecision} onReset={() => { setSelectedTraveler(null); setCurrentCrossingId(null) }} />
          )}
        </section>
        <aside className="side-stack">
          <DeviceCard isOnline={isOnline} setIsOnline={setIsOnline} wsConnected={wsConnected} />
          <QueueCard queues={queues} />
        </aside>
      </div>
      <section className="activity-section">
        <div className="section-heading">
          <div><span className="eyebrow">LIVE FEED</span><h2>Recent crossings</h2></div>
          <button className="text-button" onClick={() => setNotice('Showing all crossings in history')}>View all <ArrowRight size={15} /></button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>TRAVELER</th>
                <th>CARD ID</th>
                <th>TIME</th>
                <th>RESULT</th>
                <th>REASON</th>
              </tr>
            </thead>
            <tbody>
              {crossings.slice(0, 4).map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <div className="person-cell">
                      <span className="avatar">{transaction.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || '??'}</span>
                      <strong>{transaction.name}</strong>
                    </div>
                  </td>
                  <td className="mono">{transaction.card}</td>
                  <td className="muted">{transaction.time}</td>
                  <td>
                    <span className={`status-pill ${(transaction.outcome || '').toLowerCase()}`}>
                      <span />
                      {transaction.outcome}
                    </span>
                  </td>
                  <td className="muted">{transaction.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
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

function EmptyScanner({ scanCard, wsConnected, checkpointLabel }) {
  return (
    <div className="empty-scanner">
      <div className="scanner-art">
        <div className="scanner-ring ring-one" />
        <div className="scanner-ring ring-two" />
        <div className="scanner-core"><CreditCard size={31} /></div>
      </div>
      <span className="eyebrow">READY FOR NEXT TRAVELER</span>
      <h2>Tap an ID card to begin</h2>
      <p>The reader is listening at <strong>{checkpointLabel || 'Border Checkpoint'}</strong>. The traveler record will appear here for identity verification.</p>
      <button className="scan-button" onClick={() => scanCard()}><ScanIcon size={17} /> Simulate card tap <span>⌘ K</span></button>
      <div className="scanner-hint">
        <span className="pulse-dot" />
        {wsConnected ? 'Reader online' : 'Reader offline'} <b>•</b> Encrypted connection
      </div>
    </div>
  )
}

function TravelerVerification({ traveler, openDecision, onReset }) {
  return (
    <div className="traveler-view">
      <div className="verification-header">
        <div>
          <span className="eyebrow">CARD DETECTED / VERIFY IDENTITY</span>
          <h2>Traveler verification</h2>
        </div>
        <button className="close-button" onClick={onReset} aria-label="Clear traveler"><X size={19} /></button>
      </div>
      <div className="traveler-identity">
        <div className="traveler-photo">
          {traveler.photo ? (
            <img src={traveler.photo} alt={traveler.name || traveler.full_name} />
          ) : (
            <span>{(traveler.initials || traveler.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2))}</span>
          )}
          <div className="photo-check"><Check size={12} /></div>
        </div>
        <div className="identity-copy">
          <h3>{traveler.name || traveler.full_name}</h3>
          <p>{traveler.nationality} <span>•</span> Born {traveler.dob || traveler.date_of_birth}</p>
          <span className={`review-badge ${(traveler.status === 'Eligible' || traveler.status === 'active') ? 'eligible' : 'review'}`}>
            <span /> {traveler.status === 'active' ? 'Eligible' : traveler.status}
          </span>
        </div>
        <div className="tap-meta">
          <span className="eyebrow">CARD ID</span>
          <strong>{traveler.id}</strong>
          <small>Read at {new Date().toLocaleTimeString('en-GB')}</small>
        </div>
      </div>
      <div className="detail-grid">
        <Detail label="Passport / document" value={traveler.document || traveler.passport_number} />
        <Detail label="Document expiry" value={traveler.expiry || traveler.passport_expiry} valueTone={traveler.documentStatus === 'Valid' || !traveler.document_expired ? 'success' : 'danger'} />
        <Detail label="Face match" value={traveler.faceMatch || 'MATCHED'} valueTone={traveler.faceMatch === 'MATCHED' ? 'success' : 'danger'} />
        <Detail label="Nationality" value={traveler.nationality} />
        <Detail label="Last crossing" value={traveler.lastCrossing || 'No recent crossings'} />
      </div>
      {(traveler.alert || traveler.document_expired) && (
        <div className="alert-banner">
          <AlertIcon size={18} />
          <div>
            <strong>Attention required</strong>
            <span>{(traveler.alert || 'Travel document expired')}. Review the case before making a decision.</span>
          </div>
        </div>
      )}
      <div className="verify-note">
        <ShieldCheck size={17} />
        <span>Confirm that the person present matches the registered identity before deciding.</span>
      </div>
      <div className="decision-row">
        <button className="decision-button deny" onClick={() => openDecision('deny')}>
          <span className="decision-icon"><X size={20} /></span>
          <span><strong>Deny passage</strong><small>Record a reason</small></span>
          <ArrowRight size={18} />
        </button>
        <button className="decision-button allow" onClick={() => openDecision('allow')}>
          <span className="decision-icon"><Check size={20} /></span>
          <span><strong>Allow passage</strong><small>Verify and authorize</small></span>
          <ArrowRight size={18} />
        </button>
      </div>
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

function DeviceCard({ isOnline, setIsOnline, wsConnected }) {
  return (
    <div className="info-card device-card">
      <div className="card-top">
        <span className="eyebrow">HARDWARE STATUS</span>
        <button className="more-button" onClick={() => setIsOnline((current) => !current)}><Settings size={16} /></button>
      </div>
      <div className="device-name">
        <div className={`device-icon ${isOnline ? 'online' : 'offline'}`}><Radio size={19} /></div>
        <div><strong>Reader TP-NG03</strong><span>{isOnline ? 'Connected & ready' : 'Device offline'}</span></div>
        <span className={`status-dot ${isOnline ? 'green' : 'red'}`} />
      </div>
      <div className="device-stats">
        <div><span>Signal</span><strong>{isOnline ? 'Excellent' : 'No signal'}</strong></div>
        <div><span>WebSocket</span><strong>{wsConnected ? 'Connected' : 'Disconnected'}</strong></div>
      </div>
      <div className="signal-bars"><i /><i /><i /><i /><i /></div>
    </div>
  )
}

function QueueCard({ queues }) {
  const totalWaiting = queues?.reduce((sum, q) => sum + q.waiting, 0) || 6
  const avgWait = queues?.length ? Math.round(queues.reduce((sum, q) => sum + q.estimatedWait, 0) / queues.length) : 4
  return (
    <div className="info-card queue-card">
      <div className="card-top">
        <span className="eyebrow">CHECKPOINT QUEUE</span>
        <Gauge size={17} className="muted-icon" />
      </div>
      <div className="queue-number"><strong>{String(totalWaiting).padStart(2, '0')}</strong><span>travelers waiting</span></div>
      <div className="queue-track"><span /></div>
      <div className="queue-footer">
        <span>Estimated wait</span>
        <strong>~ {avgWait} min</strong>
        <span className="open-label"><i /> Open</span>
      </div>
    </div>
  )
}

function DecisionModal({ modal, close, complete, checkpointLabel }) {
  const [reason, setReason] = useState('')
  const isAllow = modal.type === 'allow'
  return (
    <div className="modal-backdrop">
      <div className="decision-modal">
        <button className="modal-close" onClick={close} aria-label="Close"><X size={18} /></button>
        <div className={`modal-symbol ${isAllow ? 'allow' : 'deny'}`}>{isAllow ? <Check size={25} /> : <AlertIcon size={25} />}</div>
        <span className="eyebrow">FINAL DECISION</span>
        <h2>{isAllow ? 'Authorize traveler?' : 'Deny passage?'}</h2>
        <p>{isAllow ? `You are authorizing ${modal.traveler.name || modal.traveler.full_name} to pass through ${checkpointLabel || 'this checkpoint'}.` : `A denial will be recorded against ${modal.traveler.name || modal.traveler.full_name}'s crossing record.`}</p>
        {!isAllow && (
          <label className="reason-label">
            Reason for denial
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Select a reason</option>
              <option>Document expired</option>
              <option>Secondary inspection required</option>
              <option>Identity could not be verified</option>
              <option>Other operational reason</option>
            </select>
          </label>
        )}
        <div className="modal-actions">
          <button className="secondary-button" onClick={close}>Cancel</button>
          <button
            disabled={!isAllow && !reason}
            className={`confirm-button ${isAllow ? 'green' : 'red'}`}
            onClick={() => complete(reason)}
          >
            {isAllow ? <Check size={17} /> : <AlertIcon size={17} />} Confirm {isAllow ? 'allow' : 'deny'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null
  return (
    <div className="modal-backdrop">
      <div className="decision-modal" style={{ width: 'min(420px, 95vw)' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <span className="eyebrow">CROSSING RECEIPT</span>
        <h2>{receipt.outcome}</h2>
        <div id="receipt-content" style={{ textAlign: 'left', background: '#0a1c22', border: '1px solid #29434a', borderRadius: 8, padding: 14, fontSize: 11, color: '#d9e8e4', display: 'grid', gap: 8 }}>
          <div><strong>Transaction:</strong> {receipt.id}</div>
          <div><strong>Traveler:</strong> {receipt.name}</div>
          <div><strong>Document:</strong> {receipt.document}</div>
          <div><strong>Expiry:</strong> {receipt.expiry}</div>
          <div><strong>Checkpoint:</strong> {receipt.checkpoint}</div>
          <div><strong>Officer:</strong> {receipt.officer}</div>
          <div><strong>Time:</strong> {receipt.time}</div>
          <div><strong>Result:</strong> {receipt.outcome}</div>
          {receipt.reason && <div><strong>Reason:</strong> {receipt.reason}</div>}
        </div>
        <div className="modal-actions">
          <button className="secondary-button" onClick={() => {
            const content = document.getElementById('receipt-content')?.innerHTML || ''
            const printWindow = window.open('', '_blank', 'width=300,height=600')
            printWindow.document.write(`<html><head><title>Receipt</title><style>body{font-family:monospace;padding:20px;color:#000;}div{margin-bottom:6px;}strong{display:inline-block;width:90px;}</style></head><body>${content}</body></html>`)
            printWindow.document.close()
            printWindow.focus()
            printWindow.print()
            printWindow.close()
          }}><Printer size={17} /> Print</button>
          <button className="confirm-button green" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

function HistoryView({ crossings, search, setSearch }) {
  const handleExport = () => {
    exportCrossingsToCSV(crossings, `crossings-${new Date().toISOString().slice(0, 10)}.csv`)
  }

  return (
    <div className="generic-page">
      <div className="page-heading">
        <div><span className="eyebrow">AUDITED RECORDS</span><h1>Crossing history</h1><p>Every decision made at this checkpoint is traceable.</p></div>
      </div>
      <div className="history-toolbar">
        <div className="search-field"><Search size={17} /><input placeholder="Search traveler, card or transaction" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <button className="secondary-button" onClick={handleExport}><Activity size={16} /> Export CSV</button>
      </div>
      <div className="history-table">
        <table>
          <thead>
            <tr><th>TRANSACTION</th><th>TRAVELER</th><th>TIME</th><th>RESULT</th><th>DECISION NOTE</th></tr>
          </thead>
          <tbody>
            {crossings.map((item) => (
              <tr key={item.id}>
                <td className="mono">{item.id}</td>
                <td><strong>{item.name}</strong><small className="table-sub">{item.card}</small></td>
                <td>{item.time}</td>
                <td>
                  <span className={`status-pill ${(item.outcome || '').toLowerCase()}`}>
                    <span />{item.outcome}
                  </span>
                </td>
                <td className="muted">{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AlertsView({ setNotice }) {
  return (
    <div className="generic-page">
      <div className="page-heading">
        <div><span className="eyebrow">NEEDS ATTENTION</span><h1>Alerts</h1><p>Review exceptions before they become operational delays.</p></div>
        <button className="secondary-button" onClick={() => setNotice('All visible alerts marked as reviewed')}><Check size={16} /> Mark all reviewed</button>
      </div>
      <div className="alert-list">
        <div className="full-alert amber"><AlertIcon /><div><strong>Secondary inspection queue is building</strong><p>3 travelers at North Gate 03 require supervisor review.</p></div><time>8 min ago</time></div>
        <div className="full-alert red"><Radio /><div><strong>Reader TP-SG02 briefly disconnected</strong><p>Connection restored. No crossings were lost.</p></div><time>22 min ago</time></div>
      </div>
    </div>
  )
}

function CheckpointView({ isOnline, setIsOnline, setNotice, wsConnected }) {
  return (
    <div className="generic-page">
      <div className="page-heading">
        <div><span className="eyebrow">DEVICE CONTROL</span><h1>Checkpoint operations</h1><p>North Gate 03 is configured for entry processing.</p></div>
        <button className="primary-button" onClick={() => setNotice('Device health check complete')}><Activity size={16} /> Run health check</button>
      </div>
      <div className="checkpoint-grid">
        <DeviceCard isOnline={isOnline} setIsOnline={setIsOnline} wsConnected={wsConnected} />
        <div className="info-card checkpoint-detail">
          <span className="eyebrow">PHYSICAL SIGNALS</span>
          <div className="signal-row">
            <span className="signal-light green-light" />
            <div><strong>Green / allow indicator</strong><small>Ready • Last activated 09:14:32</small></div>
          </div>
          <div className="signal-row">
            <span className="signal-light red-light" />
            <div><strong>Red / deny indicator</strong><small>Ready • Last activated 09:08:17</small></div>
          </div>
          <div className="signal-row">
            <span className="signal-light neutral-light" />
            <div><strong>Gate controller</strong><small>Standby • Manual release disabled</small></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchView({ travelers, scanCard, setActiveView, setNotice }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const searchTravelers = (e) => {
    e.preventDefault()
    const q = query.toLowerCase().trim()
    if (!q) { setResults([]); return }
    const filtered = travelers.filter(t =>
      t.full_name?.toLowerCase().includes(q) ||
      t.id?.toLowerCase().includes(q) ||
      t.passport_number?.toLowerCase().includes(q) ||
      t.nationality?.toLowerCase().includes(q)
    )
    setResults(filtered)
  }

  return (
    <div className="generic-page">
      <div className="page-heading">
        <div><span className="eyebrow">SEARCH</span><h1>Find traveler</h1><p>Search by name, card ID, passport number, or nationality.</p></div>
      </div>
      <form onSubmit={searchTravelers} className="history-toolbar" style={{ marginBottom: 20 }}>
        <div className="search-field" style={{ width: '100%', maxWidth: 600 }}><Search size={17} /><input placeholder="Search travelers..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <button type="submit" className="primary-button">Search</button>
      </form>
      <div className="history-table">
        <table>
          <thead><tr><th>NAME</th><th>CARD ID</th><th>NATIONALITY</th><th>PASSPORT</th><th>STATUS</th><th>ACTION</th></tr></thead>
          <tbody>
            {results.length === 0 ? (
              <tr><td colSpan={6} className="muted" style={{ textAlign: 'center', padding: 30 }}>Enter a search term to find travelers.</td></tr>
            ) : (
              results.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.full_name}</strong></td>
                  <td className="mono">{t.id}</td>
                  <td className="muted">{t.nationality}</td>
                  <td className="muted">{t.passport_number}</td>
                  <td><span className={`status-pill ${t.status === 'active' ? 'approved' : 'denied'}`}><span />{t.status}</span></td>
                  <td><button className="secondary-button" onClick={() => { scanCard(t); setActiveView('Overview'); setNotice(`Loaded traveler • ${t.id}`) }}>Process</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TravelersPage({ travelers, scanCard, setActiveView, setNotice }) {
  const handleExport = () => {
    exportTravelersToCSV(travelers, `travelers-${new Date().toISOString().slice(0, 10)}.csv`)
    setNotice('Travelers exported to CSV')
  }

  return (
    <div className="generic-page">
      <div className="page-heading">
        <div><span className="eyebrow">REGISTRY</span><h1>Travelers</h1><p>View registered travelers in the system.</p></div>
        <button className="secondary-button" onClick={handleExport}><Activity size={16} /> Export CSV</button>
      </div>
      <div className="history-table">
        <table>
          <thead><tr><th>NAME</th><th>CARD ID</th><th>NATIONALITY</th><th>PASSPORT</th><th>DATE OF BIRTH</th><th>STATUS</th><th>ACTION</th></tr></thead>
          <tbody>
            {travelers.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.full_name}</strong></td>
                <td className="mono">{t.id}</td>
                <td className="muted">{t.nationality}</td>
                <td className="muted">{t.passport_number}</td>
                <td className="muted">{t.date_of_birth}</td>
                <td><span className={`status-pill ${t.status === 'active' ? 'approved' : 'denied'}`}><span />{t.status}</span></td>
                <td><button className="secondary-button" onClick={() => { scanCard(t); setActiveView('Overview'); setNotice(`Loaded traveler • ${t.id}`) }}>Process</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}