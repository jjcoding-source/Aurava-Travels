import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ToursPage from './pages/ToursPage'
import TourDetailPage from './pages/TourDetailPage'
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

      {/* Auth pages — no Navbar/Footer */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected admin route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="p-8">Admin Dashboard — coming soon</div>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}

export default App

