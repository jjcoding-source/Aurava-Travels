import { useState, useEffect } from 'react'
import {
  Plus, Search, X, Phone, Mail,
  MapPin, Calendar, User, ChevronDown,
  Flame, Loader2,
} from 'lucide-react'
import { getAllLeads, createLead, updateLead } from '../../api/leadApi'
import toast from 'react-hot-toast'

const COLUMNS = [
  { key: 'new', label: 'New', color: 'bg-slate-400' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-400' },
  { key: 'interested', label: 'Interested', color: 'bg-amber-400' },
  { key: 'booked', label: 'Booked', color: 'bg-green-500' },
  { key: 'lost', label: 'Lost', color: 'bg-red-400' },
]

const SOURCE_OPTIONS = [
  'Website', 'WhatsApp', 'Phone',
  'Facebook Ad', 'Instagram', 'Referral', 'Other',
]

const EMPTY_FORM = {
  name: '', email: '', phone: '',
  destination: '', month: '', budget: '',
  source: 'Website', agent: '', notes: '',
}

const Field = ({
  label, name, type = 'text', placeholder,
  required, value, onChange, errors,
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


const LeadsPage = () => {
  const [leads, setLeads] = useState({
    new: [], contacted: [], interested: [], booked: [], lost: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [selectedLeadCol, setSelectedLeadCol] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [draggedLead, setDraggedLead] = useState(null)
  const [dragFromCol, setDragFromCol] = useState(null)
  const [dragOverCol, setDragOverCol] = useState(null)

  // Fetch leads 
  const fetchLeads = async () => {
    try {
      setIsLoading(true)
      const params = {}
      if (search) params.search = search
      const data = await getAllLeads(params)
      setLeads(data.grouped)
    } catch (error) {
      toast.error('Failed to load leads')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const totalLeads = Object.values(leads).flat().length
  const bookedCount = leads.booked?.length || 0
  const conversionRate = totalLeads > 0
    ? Math.round((bookedCount / totalLeads) * 100)
    : 0
  const pipelineValue = Object.values(leads)
    .flat()
    .filter((l) => l.budget)
    .reduce((sum, l) => {
      const val = parseFloat(l.budget?.replace('L', '')) || 0
      return sum + val
    }, 0)
    .toFixed(1)

  // Filter leads 
  const filterLeads = (colLeads = []) => {
    if (!search) return colLeads
    return colLeads.filter((lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.destination.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Drag and drop 
  const handleDragStart = (lead, colKey) => {
    setDraggedLead(lead)
    setDragFromCol(colKey)
  }

  const handleDragOver = (e, colKey) => {
    e.preventDefault()
    setDragOverCol(colKey)
  }

  const handleDrop = async (e, toCol) => {
    e.preventDefault()
    if (!draggedLead || dragFromCol === toCol) {
      setDraggedLead(null)
      setDragFromCol(null)
      setDragOverCol(null)
      return
    }

   
    setLeads((prev) => {
      const fromLeads = prev[dragFromCol].filter((l) => l._id !== draggedLead._id)
      const toLeads = [...prev[toCol], { ...draggedLead, status: toCol }]
      return { ...prev, [dragFromCol]: fromLeads, [toCol]: toLeads }
    })

   
    try {
      await updateLead(draggedLead._id, { status: toCol })
    } catch (error) {
      toast.error('Failed to update lead status')
      fetchLeads()
    }

    setDraggedLead(null)
    setDragFromCol(null)
    setDragOverCol(null)
  }

  // Move lead via modal 
  const handleMoveLeadTo = async (newStatus) => {
    if (!selectedLead || selectedLeadCol === newStatus) return

    setLeads((prev) => {
      const fromLeads = prev[selectedLeadCol].filter((l) => l._id !== selectedLead._id)
      const toLeads = [...prev[newStatus], { ...selectedLead, status: newStatus }]
      return { ...prev, [selectedLeadCol]: fromLeads, [newStatus]: toLeads }
    })
    setSelectedLeadCol(newStatus)

    try {
      await updateLead(selectedLead._id, { status: newStatus })
      toast.success('Lead moved successfully')
    } catch (error) {
      toast.error('Failed to update lead')
      fetchLeads()
    }
  }

  // Toggle hot
  const toggleHot = async (colKey, lead) => {
    const newIsHot = !lead.isHot
    setLeads((prev) => ({
      ...prev,
      [colKey]: prev[colKey].map((l) =>
        l._id === lead._id ? { ...l, isHot: newIsHot } : l
      ),
    }))
    try {
      await updateLead(lead._id, { isHot: newIsHot })
    } catch (error) {
      toast.error('Failed to update lead')
      fetchLeads()
    }
  }

  //  Validate form 
  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.destination.trim()) errors.destination = 'Destination is required'
    if (!formData.month.trim()) errors.month = 'Travel month is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Add lead 
  const handleAddLead = async () => {
    if (!validateForm()) return
    setIsSaving(true)
    try {
      const data = await createLead(formData)
      setLeads((prev) => ({
        ...prev,
        new: [data.lead, ...prev.new],
      }))
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

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading leads...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-medium text-slate-800">Leads CRM</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your sales pipeline
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={handleSearch}
              className="w-full sm:w-48 pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-700 bg-white"
            />
          </div>
          <button
            onClick={fetchLeads}
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:border-brand-700 bg-white transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add lead
          </button>
        </div>
      </div>

      {/*  Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colLeads = filterLeads(leads[col.key])
          const isDragTarget = dragOverCol === col.key

          return (
            <div
              key={col.key}
              className="flex-shrink-0 w-64"
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.color}`} />
                  <span className="text-sm font-medium text-slate-700">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded-full">
                  {colLeads.length}
                </span>
              </div>

              <div className={`min-h-32 rounded-2xl p-2 space-y-2 transition-colors ${
                isDragTarget
                  ? 'bg-brand-50 border-2 border-dashed border-brand-300'
                  : 'bg-slate-100'
              }`}>
                {colLeads.map((lead) => (
                  <div
                    key={lead._id}
                    draggable
                    onDragStart={() => handleDragStart(lead, col.key)}
                    onClick={() => {
                      setSelectedLead(lead)
                      setSelectedLeadCol(col.key)
                    }}
                    className={`bg-white rounded-xl p-3 cursor-pointer hover:shadow-md transition-all border ${
                      lead.isHot
                        ? 'border-l-2 border-l-red-400 border-t-slate-100 border-r-slate-100 border-b-slate-100'
                        : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className="text-xs font-medium text-slate-800 leading-tight">
                        {lead.name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleHot(col.key, lead)
                        }}
                        className={`flex-shrink-0 transition-opacity ${
                          lead.isHot ? 'opacity-100' : 'opacity-20 hover:opacity-60'
                        }`}
                      >
                        <Flame className={`w-3.5 h-3.5 ${lead.isHot ? 'text-red-500' : 'text-slate-400'}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{lead.destination}</span>
                      <span className="text-slate-300 text-xs">·</span>
                      <span className="text-xs text-slate-500">{lead.month}</span>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap mb-2">
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        {lead.source}
                      </span>
                      {lead.budget && (
                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          ₹{lead.budget}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="w-6 h-6 bg-brand-50 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-brand-700">
                          {lead.assignedAgent?.name?.charAt(0) || 'A'}
                        </span>
                      </div>
                      {lead.notes?.length > 0 && (
                        <p className="text-xs text-slate-400 truncate max-w-28">
                          {lead.notes[lead.notes.length - 1]?.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="flex items-center justify-center h-20">
                    <p className="text-xs text-slate-400">No leads</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/*  Summary bar */}
      <div className="bg-white rounded-2xl border border-slate-100 px-5 py-3 flex flex-wrap items-center gap-6">
        {[
          { label: 'Total leads', value: totalLeads },
          { label: 'Pipeline value', value: `₹${pipelineValue}L` },
          { label: 'Booked this month', value: bookedCount },
          { label: 'Conversion rate', value: `${conversionRate}%` },
        ].map((item) => (
          <div key={item.label}>
            <span className="text-xs text-slate-400">{item.label}: </span>
            <span className="text-xs font-medium text-slate-700">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Lead detail modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-brand-700">
                    {selectedLead.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedLead.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedLead.destination} · {selectedLead.month}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600">{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600 truncate">{selectedLead.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600">{selectedLead.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600">{selectedLead.month}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600">
                    Agent: {selectedLead.assignedAgent?.name || 'Unassigned'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Budget:</span>
                  <span className="text-xs text-slate-600">₹{selectedLead.budget}</span>
                </div>
              </div>

              {selectedLead.notes?.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 font-medium">Latest note</p>
                  <p className="text-xs text-slate-600">
                    {selectedLead.notes[selectedLead.notes.length - 1]?.text}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">
                  Move to stage
                </p>
                <div className="flex flex-wrap gap-2">
                  {COLUMNS.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => handleMoveLeadTo(col.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedLeadCol === col.key
                          ? 'bg-brand-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add lead modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="text-sm font-medium text-slate-800">Add new lead</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <Field
                label="Full name" name="name"
                placeholder="Rahul Sharma" required
                value={formData.name}
                onChange={handleFormChange}
                errors={formErrors}
              />
              <Field
                label="Email" name="email"
                type="email" placeholder="rahul@email.com" required
                value={formData.email}
                onChange={handleFormChange}
                errors={formErrors}
              />
              <Field
                label="Phone" name="phone"
                type="tel" placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleFormChange}
                errors={formErrors}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Destination" name="destination"
                  placeholder="Europe, Bali..." required
                  value={formData.destination}
                  onChange={handleFormChange}
                  errors={formErrors}
                />
                <Field
                  label="Travel month" name="month"
                  placeholder="Sep 2025" required
                  value={formData.month}
                  onChange={handleFormChange}
                  errors={formErrors}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
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
                  placeholder="Any notes about this lead..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-700 resize-none"
                />
              </div>
            </div>

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
                  'Add lead'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeadsPage
