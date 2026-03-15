import { useState } from 'react'
import {
  Plus, Search, X, Phone, Mail,
  MapPin, Calendar, User, ChevronDown,
  Flame, Loader2,
} from 'lucide-react'

const INITIAL_LEADS = {
  new: [
    {
      id: 'l1', name: 'Nisha Gupta', email: 'nisha@email.com',
      phone: '9876543210', destination: 'Dubai', month: 'Sep 2025',
      budget: '1.2L', source: 'WhatsApp', agent: 'RK', isHot: false,
      notes: 'Interested in 5-day package',
    },
    {
      id: 'l2', name: 'Suresh Pillai', email: 'suresh@email.com',
      phone: '9823456781', destination: 'Singapore', month: 'Oct 2025',
      budget: '1.5L', source: 'Facebook Ad', agent: 'PV', isHot: false,
      notes: 'Family trip with 2 kids',
    },
    {
      id: 'l3', name: 'Meera Joshi', email: 'meera@email.com',
      phone: '9012345678', destination: 'Europe', month: 'Dec 2025',
      budget: '2L', source: 'Website', agent: 'RK', isHot: false,
      notes: 'First international trip',
    },
  ],
  contacted: [
    {
      id: 'l4', name: 'Divya Menon', email: 'divya@email.com',
      phone: '9345678901', destination: 'Japan', month: 'Mar 2026',
      budget: '2.5L', source: 'Phone', agent: 'PV', isHot: true,
      notes: 'Couple trip for anniversary',
    },
    {
      id: 'l5', name: 'Kiran Bhat', email: 'kiran@email.com',
      phone: '9456789012', destination: 'Switzerland', month: 'Jan 2026',
      budget: '2L', source: 'WhatsApp', agent: 'RK', isHot: false,
      notes: 'Honeymoon package inquiry',
    },
    {
      id: 'l6', name: 'Tarun Singh', email: 'tarun@email.com',
      phone: '9567890123', destination: 'Maldives', month: 'Feb 2026',
      budget: '1.8L', source: 'Instagram', agent: 'PV', isHot: false,
      notes: 'Solo traveller',
    },
  ],
  interested: [
    {
      id: 'l7', name: 'Ankit Sharma', email: 'ankit@email.com',
      phone: '9678901234', destination: 'Europe', month: 'Sep 2025',
      budget: '2.5L', source: 'Referral', agent: 'PV', isHot: true,
      notes: 'Group of 4 friends',
    },
    {
      id: 'l8', name: 'Rohan Das', email: 'rohan@email.com',
      phone: '9789012345', destination: 'Switzerland', month: 'Aug 2025',
      budget: '2L', source: 'Referral', agent: 'RK', isHot: false,
      notes: 'Solo trip planned',
    },
  ],
  booked: [
    {
      id: 'l9', name: 'Saurabh Jain', email: 'saurabh@email.com',
      phone: '9890123456', destination: 'Maldives', month: 'Jul 2025',
      budget: '3.2L', source: 'Website', agent: 'PV', isHot: false,
      notes: 'Paid in full',
    },
    {
      id: 'l10', name: 'Rahul Sharma', email: 'rahul@email.com',
      phone: '9901234567', destination: 'Europe', month: 'Jun 2025',
      budget: '5L', source: 'Referral', agent: 'PV', isHot: false,
      notes: 'Departure confirmed 15 Jun',
    },
    {
      id: 'l11', name: 'Priya & Aditya', email: 'priya@email.com',
      phone: '9012345679', destination: 'Bali', month: 'Aug 2025',
      budget: '1.7L', source: 'Instagram', agent: 'RK', isHot: false,
      notes: 'Honeymoon package booked',
    },
  ],
  lost: [
    {
      id: 'l12', name: 'Vijay Kumar', email: 'vijay@email.com',
      phone: '9123456780', destination: 'Europe', month: 'Jun 2025',
      budget: '2L', source: 'Website', agent: 'RK', isHot: false,
      notes: 'Said too expensive',
    },
    {
      id: 'l13', name: 'Geeta Mishra', email: 'geeta@email.com',
      phone: '9234567891', destination: 'Japan', month: 'Aug 2025',
      budget: '2.2L', source: 'Facebook', agent: 'PV', isHot: false,
      notes: 'Booked with another agency',
    },
  ],
}

const COLUMNS = [
  { key: 'new', label: 'New', color: 'bg-slate-400' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-400' },
  { key: 'interested', label: 'Interested', color: 'bg-amber-400' },
  { key: 'booked', label: 'Booked', color: 'bg-green-500' },
  { key: 'lost', label: 'Lost', color: 'bg-red-400' },
]

const AGENTS = [
  { value: '', label: 'All agents' },
  { value: 'RK', label: 'Ravi Kumar (RK)' },
  { value: 'PV', label: 'Priya V (PV)' },
]

const SOURCE_OPTIONS = [
  'Website', 'WhatsApp', 'Phone', 'Facebook Ad',
  'Instagram', 'Referral', 'Other',
]

const EMPTY_FORM = {
  name: '', email: '', phone: '',
  destination: '', month: '', budget: '',
  source: 'Website', agent: 'RK', notes: '',
}


const LeadsPage = () => {
  const [leads, setLeads] = useState(INITIAL_LEADS)
  const [search, setSearch] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [selectedLeadCol, setSelectedLeadCol] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [draggedLead, setDraggedLead] = useState(null)
  const [dragFromCol, setDragFromCol] = useState(null)
  const [dragOverCol, setDragOverCol] = useState(null)

  const totalLeads = Object.values(leads).flat().length
  const bookedCount = leads.booked.length
  const conversionRate = Math.round((bookedCount / totalLeads) * 100)
  const pipelineValue = Object.values(leads)
    .flat()
    .filter((l) => l.budget)
    .reduce((sum, l) => {
      const val = parseFloat(l.budget.replace('L', '')) || 0
      return sum + val
    }, 0)
    .toFixed(1)

  const filterLeads = (colLeads) => {
    return colLeads.filter((lead) => {
      const matchSearch =
        !search ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.destination.toLowerCase().includes(search.toLowerCase())
      const matchAgent = !agentFilter || lead.agent === agentFilter
      return matchSearch && matchAgent
    })
  }

  const handleDragStart = (lead, colKey) => {
    setDraggedLead(lead)
    setDragFromCol(colKey)
  }

  const handleDragOver = (e, colKey) => {
    e.preventDefault()
    setDragOverCol(colKey)
  }

  const handleDrop = (e, toCol) => {
    e.preventDefault()
    if (!draggedLead || dragFromCol === toCol) {
      setDraggedLead(null)
      setDragFromCol(null)
      setDragOverCol(null)
      return
    }
    setLeads((prev) => {
      const fromLeads = prev[dragFromCol].filter((l) => l.id !== draggedLead.id)
      const toLeads = [...prev[toCol], { ...draggedLead }]
      return { ...prev, [dragFromCol]: fromLeads, [toCol]: toLeads }
    })
    setDraggedLead(null)
    setDragFromCol(null)
    setDragOverCol(null)
  }

  const handleMoveLeadTo = (newStatus) => {
    if (!selectedLead || !selectedLeadCol) return
    if (selectedLeadCol === newStatus) return
    setLeads((prev) => {
      const fromLeads = prev[selectedLeadCol].filter((l) => l.id !== selectedLead.id)
      const toLeads = [...prev[newStatus], { ...selectedLead }]
      return { ...prev, [selectedLeadCol]: fromLeads, [newStatus]: toLeads }
    })
    setSelectedLeadCol(newStatus)
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.destination.trim()) errors.destination = 'Destination is required'
    if (!formData.month.trim()) errors.month = 'Travel month is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddLead = async () => {
    if (!validateForm()) return
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    const newLead = {
      ...formData,
      id: `l${Date.now()}`,
      isHot: false,
    }
    setLeads((prev) => ({ ...prev, new: [newLead, ...prev.new] }))
    setFormData(EMPTY_FORM)
    setFormErrors({})
    setShowAddModal(false)
    setIsSaving(false)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const toggleHot = (colKey, leadId) => {
    setLeads((prev) => ({
      ...prev,
      [colKey]: prev[colKey].map((l) =>
        l.id === leadId ? { ...l, isHot: !l.isHot } : l
      ),
    }))
  }

  const Field = ({ label, name, type = 'text', placeholder, required }) => (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleFormChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors ${
          formErrors[name]
            ? 'border-red-400 focus:border-red-500'
            : 'border-slate-200 focus:border-brand-700'
        }`}
      />
      {formErrors[name] && (
        <p className="mt-1 text-xs text-red-500">{formErrors[name]}</p>
      )}
    </div>
  )

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
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-48 pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-700 bg-white"
            />
          </div>

          {/* Agent filter */}
          <div className="relative">
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-700 bg-white appearance-none cursor-pointer"
            >
              {AGENTS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Add lead button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add lead
          </button>
        </div>
      </div>

      {/*  Kanban board  */}
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

              <div
                className={`min-h-32 rounded-2xl p-2 space-y-2 transition-colors ${
                  isDragTarget
                    ? 'bg-brand-50 border-2 border-dashed border-brand-300'
                    : 'bg-slate-100'
                }`}
              >
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
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
                          toggleHot(col.key, lead.id)
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
                      <span className="text-xs text-slate-500">
                        {lead.destination}
                      </span>
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
                          {lead.agent}
                        </span>
                      </div>
                      {lead.notes && (
                        <p className="text-xs text-slate-400 truncate max-w-28">
                          {lead.notes}
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
                  <span className="text-xs text-slate-600">
                    {selectedLead.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600 truncate">
                    {selectedLead.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600">
                    {selectedLead.destination}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600">
                    {selectedLead.month}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600">
                    Agent: {selectedLead.agent}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Budget:</span>
                  <span className="text-xs text-slate-600">
                    ₹{selectedLead.budget}
                  </span>
                </div>
              </div>

              {selectedLead.notes && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 font-medium">Notes</p>
                  <p className="text-xs text-slate-600">{selectedLead.notes}</p>
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

            {/* Modal footer */}
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

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10 max-h-screen overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="text-sm font-medium text-slate-800">Add new lead</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4">
              <Field
                label="Full name" name="name"
                placeholder="Rahul Sharma" required
              />
              <Field
                label="Email" name="email"
                type="email" placeholder="rahul@email.com" required
              />
              <Field
                label="Phone" name="phone"
                type="tel" placeholder="10-digit mobile number"
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Destination" name="destination"
                  placeholder="Europe, Bali..." required
                />
                <Field
                  label="Travel month" name="month"
                  placeholder="Sep 2025" required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Budget (e.g. 2.5L)" name="budget"
                  placeholder="2.5L"
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
                  Assign agent
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'RK', label: 'Ravi Kumar' },
                    { value: 'PV', label: 'Priya V' },
                  ].map((agent) => (
                    <button
                      key={agent.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, agent: agent.value }))
                      }
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                        formData.agent === agent.value
                          ? 'bg-brand-700 text-white border-brand-700'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-brand-700'
                      }`}
                    >
                      {agent.label}
                    </button>
                  ))}
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