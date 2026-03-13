import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import OverviewPage from './pages/OverviewPage'
import IntegrationsPage from './pages/IntegrationsPage'
import ManagePage from './pages/ManagePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function ManagerRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user?.role === 'manager' ? <>{children}</> : <Navigate to="/dashboard/overview" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Navigate to="/dashboard/overview" replace /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/overview" element={
        <ProtectedRoute>
          <Layout><OverviewPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/integrations" element={
        <ProtectedRoute>
          <Layout><IntegrationsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/manage" element={
        <ProtectedRoute>
          <ManagerRoute>
            <Layout><ManagePage /></Layout>
          </ManagerRoute>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
