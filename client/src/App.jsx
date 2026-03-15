import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Routes>

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tours" element={<div className="p-8 text-center">Tours Page — coming soon</div>} />
        <Route path="/destinations" element={<div className="p-8 text-center">Destinations — coming soon</div>} />
        <Route path="/about" element={<div className="p-8 text-center">About — coming soon</div>} />
        <Route path="/contact" element={<div className="p-8 text-center">Contact — coming soon</div>} />
      </Route>

      {/* Auth pages — no layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<div className="p-8 text-center">Register — coming soon</div>} />

      {/* Protected admin routes */}
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