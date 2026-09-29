import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import Login from './pages/Login'
import OfficerDashboard from './pages/OfficerDashboard'
import SupervisorDashboard from './pages/SupervisorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import TravelerPortal from './pages/TravelerPortal'
import CheckpointSelection from './pages/CheckpointSelection'
import { ErrorBoundary } from './components/ErrorBoundary'
import { api } from './services/api'
import './styles.css'

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(() => {
    try {
      const saved = localStorage.getItem('tap_selected_checkpoint')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const navigate = useNavigate()

  const handleLoginSuccess = async (user) => {
    try {
      setAuthenticatedUser(user)
      if (user.role === 1) {
        navigate('/admin', { replace: true })
      } else if (user.role === 2) {
        navigate('/supervisor', { replace: true })
      } else {
        navigate('/checkpoint', { replace: true })
      }
    } catch (err) {
      console.error('Login success handler failed:', err)
    }
  }

  const handleCheckpointSelect = (checkpoint) => {
    try {
      setSelectedCheckpoint(checkpoint)
      localStorage.setItem('tap_selected_checkpoint', JSON.stringify(checkpoint))
      navigate('/officer', { replace: true })
    } catch (err) {
      console.error('Checkpoint selection failed:', err)
    }
  }

  const handleLogout = () => {
    try {
      setAuthenticatedUser(null)
      setSelectedCheckpoint(null)
      localStorage.removeItem('tap_selected_checkpoint')
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/checkpoint" element={<CheckpointSelection onSelect={handleCheckpointSelect} />} />
      <Route path="/officer" element={<ProtectedRoute allowedRoles={[3, 4]}><OfficerDashboard onSwitchToLogin={handleLogout} selectedCheckpoint={selectedCheckpoint} /></ProtectedRoute>} />
      <Route path="/supervisor" element={<ProtectedRoute allowedRoles={[2]}><SupervisorDashboard onSwitchToLogin={handleLogout} selectedCheckpoint={selectedCheckpoint} /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={[1]}><AdminDashboard onSwitchToLogin={handleLogout} selectedCheckpoint={selectedCheckpoint} /></ProtectedRoute>} />
      <Route path="/traveler" element={<TravelerPortal onBack={() => navigate('/login', { replace: true })} />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <LanguageProvider>
            <AppRoutes />
          </LanguageProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
