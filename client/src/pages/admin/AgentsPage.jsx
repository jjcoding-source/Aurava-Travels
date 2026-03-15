import { useState, useEffect } from 'react'
import {
  Plus, Search, Loader2, X,
  Mail, Phone, UserCheck, UserX,
  Eye, EyeOff, TrendingUp, Target,
} from 'lucide-react'
import { getAllUsers, toggleUserStatus, createAgent } from '../../api/userApi'
import { getAllLeads } from '../../api/leadApi'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

const FormField = ({
  label, name, type = 'text',
  placeholder, required,
  value, onChange, errors,
  rightElement,
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors ${
          rightElement ? 'pr-10' : ''
        } ${
          errors && errors[name]
            ? 'border-red-400 focus:border-red-500'
            : 'border-slate-200 focus:border-brand-700'
        }`}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
    {errors && errors[name] && (
      <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
    )}
  </div>
)

const AgentsPage = () => {
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agentLeadStats, setAgentLeadStats] = useState({})

  // ── Fetch agents ──────────────────────────────────────────
  const fetchAgents = async () => {
    try {
      setIsLoading(true)
      const data = await getAllUsers({ role: 'agent', limit: 50 })
      setAgents(data.users)
    } catch (error) {
      toast.error('Failed to load agents')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Fetch lead stats per agent ────────────────────────────
  const fetchLeadStats = async () => {
    try {
      const data = await getAllLeads()
      const allLeads = Object.values(data.grouped).flat()

      const stats = {}
      allLeads.forEach((lead) => {
        const agentId = lead.assignedAgent?._id || lead.assignedAgent
        if (!agentId) return
        if (!stats[agentId]) {
          stats[agentId] = { total: 0, booked: 0, lost: 0 }
        }
        stats[agentId].total += 1
        if (lead.status === 'booked') stats[agentId].booked += 1
        if (lead.status === 'lost') stats[agentId].lost += 1
      })

      setAgentLeadStats(stats)
    } catch (error) {
      console.error('Failed to load lead stats')
    }
  }

  useEffect(() => {
    fetchAgents()
    fetchLeadStats()
  }, [])

  // ── Filter agents ─────────────────────────────────────────
  const filteredAgents = agents.filter((agent) => {
    if (!search) return true
    return (
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.email.toLowerCase().includes(search.toLowerCase())
    )
  })

  // ── Stats ─────────────────────────────────────────────────
  const totalAgents = agents.length
  const activeAgents = agents.filter((a) => a.isActive).length
  const totalLeadsManaged = Object.values(agentLeadStats).reduce(
    (sum, s) => sum + s.total, 0
  )
  const totalBooked = Object.values(agentLeadStats).reduce(
    (sum, s) => sum + s.booked, 0
  )

  // ── Validate form ─────────────────────────────────────────
  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email'
    if (!formData.phone.trim()) errors.phone = 'Phone is required'
    if (!formData.password) errors.password = 'Password is required'
    else if (formData.password.length < 6) errors.password = 'Minimum 6 characters'
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ── Handle form change ────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // ── Create agent ──────────────────────────────────────────
  const handleCreateAgent = async () => {
    if (!validateForm()) return
    setIsSaving(true)
    try {
      const { confirmPassword, ...submitData } = formData
      const data = await createAgent(submitData)
      setAgents((prev) => [data.user, ...prev])
      setFormData(EMPTY_FORM)
      setFormErrors({})
      setShowModal(false)
      toast.success('Agent created successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create agent')
    } finally {
      setIsSaving(false)
    }
  }

  // ── Toggle agent status ───────────────────────────────────
  const handleToggle = async (agentId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate'
    if (!window.confirm(`Are you sure you want to ${action} this agent?`)) return
    setTogglingId(agentId)
    try {
      await toggleUserStatus(agentId)
      setAgents((prev) =>
        prev.map((a) =>
          a._id === agentId ? { ...a, isActive: !a.isActive } : a
        )
      )
      toast.success(`Agent ${action}d successfully`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update agent')
    } finally {
      setTogglingId(null)
    }
  }

  // ── Get conversion rate for agent ─────────────────────────
  const getConversionRate = (agentId) => {
    const stats = agentLeadStats[agentId]
    if (!stats || stats.total === 0) return 0
    return Math.round((stats.booked / stats.total) * 100)
  }

  return (
    <div className="space-y-5">

      {/* ── Page heading ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-slate-800">
            Sales Agents
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your sales team
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add agent
        </button>
      </div>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total agents', value: totalAgents, color: 'text-slate-800', icon: Target },
          { label: 'Active agents', value: activeAgents, color: 'text-green-600', icon: UserCheck },
          { label: 'Leads managed', value: totalLeadsManaged, color: 'text-blue-600', icon: Target },
          { label: 'Total booked', value: totalBooked, color: 'text-brand-700', icon: TrendingUp },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-100 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
              <p className={`text-2xl font-medium ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Search ────────────────────────────────────────── */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-700 bg-white"
        />
      </div>

      {/* ── Agents table ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading agents...</span>
            </div>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-slate-400 mb-3">
              No agents found
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-brand-700 font-medium hover:underline"
            >
              Create your first agent
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-3">
                    Agent
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Contact
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Leads
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Booked
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Conversion
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
                {filteredAgents.map((agent) => {
                  const stats = agentLeadStats[agent._id] || { total: 0, booked: 0 }
                  const conversionRate = getConversionRate(agent._id)
                  return (
                    <tr
                      key={agent._id}
                      className={`hover:bg-slate-50 transition-colors ${
                        !agent.isActive ? 'opacity-60' : ''
                      }`}
                    >
                      {/* Agent */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-brand-700">
                              {agent.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800">
                              {agent.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Sales Agent
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-slate-600 mb-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-36">{agent.email}</span>
                        </div>
                        {agent.phone && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{agent.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Leads */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-slate-700">
                          {stats.total}
                        </span>
                      </td>

                      {/* Booked */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-green-600">
                          {stats.booked}
                        </span>
                      </td>

                      {/* Conversion rate */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                            conversionRate >= 50
                              ? 'bg-green-50 text-green-700'
                              : conversionRate >= 25
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {conversionRate}%
                          </span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                conversionRate >= 50
                                  ? 'bg-green-500'
                                  : conversionRate >= 25
                                  ? 'bg-amber-400'
                                  : 'bg-red-400'
                              }`}
                              style={{ width: `${conversionRate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-slate-600">
                          {new Date(agent.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                          agent.isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {agent.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(agent._id, agent.isActive)}
                          disabled={togglingId === agent._id}
                          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                            agent.isActive
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          }`}
                        >
                          {togglingId === agent._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : agent.isActive ? (
                            <UserX className="w-3 h-3" />
                          ) : (
                            <UserCheck className="w-3 h-3" />
                          )}
                          {agent.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create Agent Modal ────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-medium text-slate-800">
                  Create new agent
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Agent will be able to login and manage leads
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false)
                  setFormData(EMPTY_FORM)
                  setFormErrors({})
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4">
              <FormField
                label="Full name" name="name"
                placeholder="Priya Sharma" required
                value={formData.name}
                onChange={handleFormChange}
                errors={formErrors}
              />
              <FormField
                label="Email address" name="email"
                type="email" placeholder="priya@aurava.in" required
                value={formData.email}
                onChange={handleFormChange}
                errors={formErrors}
              />
              <FormField
                label="Phone number" name="phone"
                type="tel" placeholder="10-digit mobile" required
                value={formData.phone}
                onChange={handleFormChange}
                errors={formErrors}
              />
              <FormField
                label="Password" name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters" required
                value={formData.password}
                onChange={handleFormChange}
                errors={formErrors}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                }
              />
              <FormField
                label="Confirm password" name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password" required
                value={formData.confirmPassword}
                onChange={handleFormChange}
                errors={formErrors}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                }
              />

              {/* Info note */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-xs text-blue-700 leading-relaxed">
                  The agent will be able to log in immediately using these
                  credentials. They will only see leads assigned to them.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false)
                  setFormData(EMPTY_FORM)
                  setFormErrors({})
                }}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAgent}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Create agent
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgentsPage