import { useState, useEffect } from 'react'
import {
  Search, Flame, MapPin, Phone,
  Mail, Calendar, ChevronDown,
  X, Loader2, Plus, Clock,
  Filter,
} from 'lucide-react'
import { getAllLeads, updateLead, createLead } from '../../api/leadApi'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-slate-100 text-slate-600' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-50 text-blue-700' },
  { value: 'interested', label: 'Interested', color: 'bg-amber-50 text-amber-700' },
  { value: 'booked', label: 'Booked', color: 'bg-green-50 text-green-700' },
  { value: 'lost', label: 'Lost', color: 'bg-red-50 text-red-600' },
]

const SOURCE_OPTIONS = [
  'Website', 'WhatsApp', 'Phone',
  'Facebook Ad', 'Instagram', 'Referral', 'Other',
]

const SOURCE_COLORS = {
  Website: 'bg-blue-50 text-blue-600',
  WhatsApp: 'bg-green-50 text-green-700',
  Phone: 'bg-purple-50 text-purple-700',
  'Facebook Ad': 'bg-indigo-50 text-indigo-700',
  Instagram: 'bg-pink-50 text-pink-700',
  Referral: 'bg-amber-50 text-amber-700',
  Other: 'bg-slate-100 text-slate-600',
}

const EMPTY_FORM = {
  name: '', email: '', phone: '',
  destination: '', month: '', budget: '',
  source: 'Website', notes: '',
}

const NoteInput = ({ value, onChange }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder="Add a note about this lead..."
    rows={3}
    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-700 resize-none"
  />
)

const FormField = ({
  label, name, type = 'text',
  placeholder, required,
  value, onChange, errors,
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors ${
        errors && errors[name]
          ? 'border-red-400 focus:border-red-500'
          : 'border-slate-200 focus:border-brand-700'
      }`}
    />
    {errors && errors[name] && (
      <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
    )}
  </div>
)


const AgentLeadsPage = () => {
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [followUpDate, setFollowUpDate] = useState('')

  // Add lead modal state 
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Fetch leads 
  const fetchLeads = async () => {
    try {
      setIsLoading(true)
      const data = await getAllLeads()
      const allLeads = Object.values(data.grouped).flat()
      setLeads(allLeads)
    } catch (error) {
      toast.error('Failed to load leads')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  // Filtered leads 
  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.destination.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || lead.status === statusFilter
    return matchSearch && matchStatus
  })

  // Stats 
  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.isHot).length,
    booked: leads.filter((l) => l.status === 'booked').length,
    followUp: leads.filter((l) => l.followUpDate).length,
  }

  // Update lead status 
  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingId(leadId)
    try {
      await updateLead(leadId, { status: newStatus })
      setLeads((prev) =>
        prev.map((l) =>
          l._id === leadId ? { ...l, status: newStatus } : l
        )
      )
      if (selectedLead?._id === leadId) {
        setSelectedLead((prev) => ({ ...prev, status: newStatus }))
      }
      toast.success('Status updated')
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  // Toggle hot
  const handleToggleHot = async (lead) => {
    const newIsHot = !lead.isHot
    setLeads((prev) =>
      prev.map((l) =>
        l._id === lead._id ? { ...l, isHot: newIsHot } : l
      )
    )
    if (selectedLead?._id === lead._id) {
      setSelectedLead((prev) => ({ ...prev, isHot: newIsHot }))
    }
    try {
      await updateLead(lead._id, { isHot: newIsHot })
    } catch (error) {
      toast.error('Failed to update lead')
      fetchLeads()
    }
  }

  // Add note 
  const handleAddNote = async () => {
    if (!noteText.trim()) return
    setIsAddingNote(true)
    try {
      const data = await updateLead(selectedLead._id, { notes: noteText })
      setSelectedLead(data.lead)
      setLeads((prev) =>
        prev.map((l) => l._id === selectedLead._id ? data.lead : l)
      )
      setNoteText('')
      toast.success('Note added')
    } catch (error) {
      toast.error('Failed to add note')
    } finally {
      setIsAddingNote(false)
    }
  }

  //  Set follow up date 
  const handleSetFollowUp = async () => {
    if (!followUpDate) return
    try {
      const data = await updateLead(selectedLead._id, { followUpDate })
      setSelectedLead(data.lead)
      setLeads((prev) =>
        prev.map((l) => l._id === selectedLead._id ? data.lead : l)
      )
      toast.success('Follow up date set')
    } catch (error) {
      toast.error('Failed to set follow up date')
    }
  }

  // Open lead detail 
  const handleOpenLead = (lead) => {
    setSelectedLead(lead)
    setNoteText('')
    setFollowUpDate(
      lead.followUpDate
        ? new Date(lead.followUpDate).toISOString().split('T')[0]
        : ''
    )
  }

  // Validate add lead form
  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.destination.trim()) errors.destination = 'Destination is required'
    if (!formData.month.trim()) errors.month = 'Travel month is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  //  Handle form change 
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Submit add lead 
  const handleAddLead = async () => {
    if (!validateForm()) return
    setIsSaving(true)
    try {
      const data = await createLead(formData)
      setLeads((prev) => [data.lead, ...prev])
      setFormData(EMPTY_FORM)
      setFormErrors({})
      setShowAddModal(false)
      toast.success('Lead added successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add lead')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusStyle = (status) => {
    return STATUS_OPTIONS.find((s) => s.value === status)?.color ||
      'bg-slate-100 text-slate-600'
  }

  return (
    <div className="space-y-5">

      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-slate-800">My Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your assigned leads
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add lead
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total leads', value: stats.total, color: 'text-slate-800' },
          { label: 'Hot leads', value: stats.hot, color: 'text-red-500' },
          { label: 'Booked', value: stats.booked, color: 'text-green-600' },
          { label: 'Follow ups', value: stats.followUp, color: 'text-amber-600' },
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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-700 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
          </div>
          {[
            { label: 'All', value: '' },
            { label: 'New', value: 'new' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Interested', value: 'interested' },
            { label: 'Booked', value: 'booked' },
            { label: 'Lost', value: 'lost' },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setStatusFilter(pill.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === pill.value
                  ? 'bg-brand-700 text-white border-brand-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand-700'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads table*/}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading leads...</span>
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-slate-400 mb-3">No leads found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-sm text-brand-700 font-medium hover:underline"
            >
              Add your first lead
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-3">Lead</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Destination</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Budget</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Source</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Status</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Follow up</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => handleOpenLead(lead)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-brand-700">
                            {lead.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-medium text-slate-800">
                              {lead.name}
                            </p>
                            {lead.isHot && (
                              <Flame className="w-3 h-3 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-32">{lead.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-700">{lead.destination}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{lead.month}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-700">
                        {lead.budget ? `₹${lead.budget}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        SOURCE_COLORS[lead.source] || 'bg-slate-100 text-slate-600'
                      }`}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          disabled={updatingId === lead._id}
                          className={`text-xs font-medium px-2 py-1.5 rounded-lg border-0 outline-none cursor-pointer appearance-none pr-6 ${
                            getStatusStyle(lead.status)
                          } disabled:opacity-50`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {lead.followUpDate ? (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span className="text-xs text-amber-600 font-medium">
                            {new Date(lead.followUpDate).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short',
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleHot(lead)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            lead.isHot
                              ? 'bg-red-50 text-red-500'
                              : 'text-slate-300 hover:text-red-400 hover:bg-red-50'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenLead(lead)}
                          className="px-2.5 py-1.5 text-xs font-medium bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead detail modal  */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-50 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-brand-700">
                    {selectedLead.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800">
                      {selectedLead.name}
                    </p>
                    {selectedLead.isHot && (
                      <Flame className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {selectedLead.destination} · {selectedLead.month}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-700">
                    {selectedLead.phone || 'No phone'}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-700 truncate">
                    {selectedLead.email || 'No email'}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-700">
                    {selectedLead.destination}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-700">
                    {selectedLead.month || 'No date'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Status
                </label>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleStatusChange(selectedLead._id, opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedLead.status === opt.value
                          ? 'bg-brand-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Follow up date
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-700"
                  />
                  <button
                    onClick={handleSetFollowUp}
                    disabled={!followUpDate}
                    className="px-3 py-2 bg-brand-700 text-white text-xs font-medium rounded-lg hover:bg-brand-800 disabled:opacity-50 transition-colors"
                  >
                    Set
                  </button>
                </div>
              </div>

              {selectedLead.notes?.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Notes history
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {[...selectedLead.notes].reverse().map((note, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl px-3 py-2.5">
                        <p className="text-xs text-slate-700 mb-1">{note.text}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">{note.addedBy}</span>
                          <span className="text-xs text-slate-400">
                            {note.addedAt
                              ? new Date(note.addedAt).toLocaleDateString('en-IN')
                              : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Add note
                </label>
                <NoteInput
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || isAddingNote}
                  className="mt-2 flex items-center gap-1.5 px-3 py-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  {isAddingNote
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Plus className="w-3.5 h-3.5" />
                  }
                  Add note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add lead modal  */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10 max-h-screen overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="text-sm font-medium text-slate-800">
                Add new lead
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
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
                placeholder="Rahul Sharma" required
                value={formData.name}
                onChange={handleFormChange}
                errors={formErrors}
              />
              <FormField
                label="Email" name="email"
                type="email" placeholder="rahul@email.com" required
                value={formData.email}
                onChange={handleFormChange}
                errors={formErrors}
              />
              <FormField
                label="Phone" name="phone"
                type="tel" placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleFormChange}
                errors={formErrors}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Destination" name="destination"
                  placeholder="Europe, Bali..." required
                  value={formData.destination}
                  onChange={handleFormChange}
                  errors={formErrors}
                />
                <FormField
                  label="Travel month" name="month"
                  placeholder="Sep 2025" required
                  value={formData.month}
                  onChange={handleFormChange}
                  errors={formErrors}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Budget (e.g. 2.5L)" name="budget"
                  placeholder="2.5L"
                  value={formData.budget}
                  onChange={handleFormChange}
                  errors={formErrors}
                />
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Lead source
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-700"
                  >
                    {SOURCE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder="Any initial notes about this lead..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-700 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setFormData(EMPTY_FORM)
                  setFormErrors({})
                }}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLead}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Add lead
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

export default AgentLeadsPage