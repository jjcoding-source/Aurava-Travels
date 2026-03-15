import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import AgentLayout from './layouts/AgentLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ToursPage from './pages/ToursPage'
import TourDetailPage from './pages/TourDetailPage'
import BookingPage from './pages/BookingPage'
import BookingSuccessPage from './pages/BookingSuccessPage'
import MyBookingsPage from './pages/MyBookingsPage'
import DashboardPage from './pages/admin/DashboardPage'
import ToursManagementPage from './pages/admin/ToursManagementPage'
import BookingsManagementPage from './pages/admin/BookingsManagementPage'
import CustomersPage from './pages/admin/CustomersPage'
import LeadsPage from './pages/admin/LeadsPage'
import ReportsPage from './pages/admin/ReportsPage'
import AgentDashboardPage from './pages/agent/AgentDashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Routes>

      {/* Public pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/tours/:id" element={<TourDetailPage />} />
        <Route path="/destinations" element={<div className="p-8 text-center">Destinations — coming soon</div>} />
        <Route path="/about" element={<div className="p-8 text-center">About — coming soon</div>} />
        <Route path="/contact" element={<div className="p-8 text-center">Contact — coming soon</div>} />
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-success/:id"
          element={
            <ProtectedRoute>
              <BookingSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin pages */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="tours" element={<ToursManagementPage />} />
        <Route path="bookings" element={<BookingsManagementPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<div className="p-4 text-slate-500 text-sm">Settings — coming soon</div>} />
      </Route>

      {/* Agent pages */}
      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRoles={['agent']}>
            <AgentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AgentDashboardPage />} />
        <Route path="leads" element={<div className="p-4 text-slate-500 text-sm">My Leads — coming soon</div>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}

export default App