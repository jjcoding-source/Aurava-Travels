import { useState, useEffect } from 'react'
import {
  Search, Loader2, ChevronLeft,
  ChevronRight, UserCheck, UserX,
  Mail, Phone, Shield,
} from 'lucide-react'
import { getAllUsers, toggleUserStatus } from '../../api/userApi'
import toast from 'react-hot-toast'

const ROLE_STYLES = {
  customer: 'bg-blue-50 text-blue-700',
  agent: 'bg-purple-50 text-purple-700',
  admin: 'bg-red-50 text-red-600',
}

const USERS_PER_PAGE = 10

const CustomersPage = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState({
    total: 0, customers: 0, agents: 0, admins: 0,
  })
  const [togglingId, setTogglingId] = useState(null)

  // ── Fetch users ───────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const params = {
        page: currentPage,
        limit: USERS_PER_PAGE,
      }
      if (roleFilter) params.role = roleFilter
      if (search) params.search = search

      const data = await getAllUsers(params)
      setUsers(data.users)
      setTotal(data.total)
      setTotalPages(data.pages)
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Fetch stats ───────────────────────────────────────────
  const fetchStats = async () => {
    try {
      const [all, customers, agents, admins] = await Promise.all([
        getAllUsers({ limit: 1 }),
        getAllUsers({ limit: 1, role: 'customer' }),
        getAllUsers({ limit: 1, role: 'agent' }),
        getAllUsers({ limit: 1, role: 'admin' }),
      ])
      setStats({
        total: all.total,
        customers: customers.total,
        agents: agents.total,
        admins: admins.total,
      })
    } catch (error) {
      console.error('Failed to load stats')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, roleFilter])

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [roleFilter, search])

  // ── Search handler ────────────────────────────────────────
  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') fetchUsers()
  }

  // ── Toggle user status ────────────────────────────────────
  const handleToggle = async (userId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate'
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return

    setTogglingId(userId)
    try {
      await toggleUserStatus(userId)
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !u.isActive } : u
        )
      )
      toast.success(`User ${action}d successfully`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="space-y-5">

      {/* ── Page heading ──────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-medium text-slate-800">Customers</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage all users and agents
        </p>
      </div>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total users', value: stats.total, color: 'text-slate-800' },
          { label: 'Customers', value: stats.customers, color: 'text-blue-600' },
          { label: 'Sales agents', value: stats.agents, color: 'text-purple-600' },
          { label: 'Admins', value: stats.admins, color: 'text-red-500' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-slate-100 p-4"
          >
            <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-medium ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearch}
            onKeyDown={handleSearchSubmit}
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-700 bg-white"
          />
        </div>

        {/* Role filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'All', value: '' },
            { label: 'Customers', value: 'customer' },
            { label: 'Agents', value: 'agent' },
            { label: 'Admins', value: 'admin' },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setRoleFilter(pill.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                roleFilter === pill.value
                  ? 'bg-brand-700 text-white border-brand-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand-700'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <button
          onClick={fetchUsers}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:border-brand-700 bg-white transition-colors"
        >
          Search
        </button>
      </div>

      {/* ── Users table ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading users...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-slate-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-3">
                    User
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Contact
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Joined
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className={`hover:bg-slate-50 transition-colors ${
                      !user.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    {/* User */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-brand-700">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-800">
                            {user.name}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3">
                      {user.phone ? (
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">
                          No phone
                        </span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {user.role === 'admin' && (
                          <Shield className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${
                          ROLE_STYLES[user.role]
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        user.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggle(user._id, user.isActive)}
                          disabled={togglingId === user._id}
                          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                            user.isActive
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          }`}
                        >
                          {togglingId === user._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : user.isActive ? (
                            <UserX className="w-3 h-3" />
                          ) : (
                            <UserCheck className="w-3 h-3" />
                          )}
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <span className="text-xs text-slate-300">
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Showing {((currentPage - 1) * USERS_PER_PAGE) + 1} to{' '}
              {Math.min(currentPage * USERS_PER_PAGE, total)} of {total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-brand-700 text-white border border-brand-700'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomersPage