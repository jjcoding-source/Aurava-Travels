import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ToursPage from './pages/ToursPage'
import TourDetailPage from './pages/TourDetailPage'
import DashboardPage from './pages/admin/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Routes>

      {/* Public pages with Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/tours/:id" element={<TourDetailPage />} />
        <Route path="/destinations" element={<div className="p-8 text-center">Destinations — coming soon</div>} />
        <Route path="/about" element={<div className="p-8 text-center">About — coming soon</div>} />
        <Route path="/contact" element={<div className="p-8 text-center">Contact — coming soon</div>} />
      </Route>

      {/* Auth pages — no layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin pages — AdminLayout + protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="tours" element={<div className="p-4 text-slate-500 text-sm">Tour management — coming soon</div>} />
        <Route path="bookings" element={<div className="p-4 text-slate-500 text-sm">Bookings — coming soon</div>} />
        <Route path="customers" element={<div className="p-4 text-slate-500 text-sm">Customers — coming soon</div>} />
        <Route path="leads" element={<div className="p-4 text-slate-500 text-sm">Leads CRM — coming soon</div>} />
        <Route path="reports" element={<div className="p-4 text-slate-500 text-sm">Reports — coming soon</div>} />
        <Route path="settings" element={<div className="p-4 text-slate-500 text-sm">Settings — coming soon</div>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}

export default App
