import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Target, LayoutDashboard, LogOut,
  Menu, X, Plane, ChevronDown,
} from 'lucide-react'
import { logout } from '../store/authSlice'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/agent', icon: LayoutDashboard },
  { label: 'My Leads', path: '/agent/leads', icon: Target },
]

const AgentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const isActive = (path) => {
    if (path === '/agent') return location.pathname === '/agent'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
          <Plane className="w-3.5 h-3.5 text-white" strokeWidth={2} />
        </div>
        <div>
          <span className="text-sm font-medium text-white">Aurava Travels</span>
          <p className="text-xs text-white/40">Sales Agent Panel</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive(link.path)
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* User card */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-white/40">Sales Agent</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">

      <aside className="hidden lg:flex lg:flex-col w-52 bg-brand-800 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-52 bg-brand-800 z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-52 flex flex-col min-h-screen">

        <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-sm font-medium text-slate-800">
                {NAV_ITEMS.find((l) => isActive(l.path))?.label || 'Agent Panel'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-xs text-slate-500 hover:text-brand-700 transition-colors hidden sm:block"
              >
                View site
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-brand-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-700 hidden sm:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-800">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-400">Sales Agent</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AgentLayout