import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Loader2, Flame, MapPin,
  Target, TrendingUp, CheckCircle, AlertCircle,
} from 'lucide-react'
import { getAllLeads, updateLead } from '../../api/leadApi'
import toast from 'react-hot-toast'

const COLUMNS = [
  { key: 'new', label: 'New', color: 'bg-slate-400' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-400' },
  { key: 'interested', label: 'Interested', color: 'bg-amber-400' },
  { key: 'booked', label: 'Booked', color: 'bg-green-500' },
  { key: 'lost', label: 'Lost', color: 'bg-red-400' },
]

const AgentDashboardPage = () => {
  const { user } = useSelector((state) => state.auth)
  const [leads, setLeads] = useState({
    new: [], contacted: [], interested: [], booked: [], lost: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [draggedLead, setDraggedLead] = useState(null)
  const [dragFromCol, setDragFromCol] = useState(null)
  const [dragOverCol, setDragOverCol] = useState(null)

  // Fetch agent's leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true)
        const data = await getAllLeads()
        setLeads(data.grouped)
      } catch (error) {
        toast.error('Failed to load leads')
      } finally {
        setIsLoading(false)
      }
    }
    fetchLeads()
  }, [])

  const allLeads = Object.values(leads).flat()
  const totalLeads = allLeads.length
  const bookedLeads = leads.booked?.length || 0
  const hotLeads = allLeads.filter((l) => l.isHot).length
  const conversionRate = totalLeads > 0
    ? Math.round((bookedLeads / totalLeads) * 100)
    : 0

  const today = new Date().toDateString()
  const followUpsToday = allLeads.filter((l) => {
    if (!l.followUpDate) return false
    return new Date(l.followUpDate).toDateString() === today
  })

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
      toast.success('Lead status updated')
    } catch (error) {
      toast.error('Failed to update lead')
    }

    setDraggedLead(null)
    setDragFromCol(null)
    setDragOverCol(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading your dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div className="bg-brand-800 rounded-2xl p-6 text-white">
        <p className="text-white/60 text-sm mb-1">Welcome back</p>
        <h1 className="text-xl font-medium mb-1">{user?.name}</h1>
        <p className="text-white/50 text-sm">
          You have{' '}
          <span className="text-white font-medium">{totalLeads} leads</span>
          {' '}in your pipeline today
        </p>
      </div>

      {/* KPI cards  */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-xs text-slate-500">Total leads</p>
          </div>
          <p className="text-2xl font-medium text-slate-800">{totalLeads}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            </div>
            <p className="text-xs text-slate-500">Booked</p>
          </div>
          <p className="text-2xl font-medium text-green-600">{bookedLeads}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <p className="text-xs text-slate-500">Conversion</p>
          </div>
          <p className="text-2xl font-medium text-indigo-600">{conversionRate}%</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-red-500" />
            </div>
            <p className="text-xs text-slate-500">Hot leads</p>
          </div>
          <p className="text-2xl font-medium text-red-500">{hotLeads}</p>
        </div>
      </div>

      {/* Follow ups due today  */}
      {followUpsToday.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-medium text-amber-800">
              {followUpsToday.length} follow-up{followUpsToday.length > 1 ? 's' : ''} due today
            </h3>
          </div>
          <div className="space-y-2">
            {followUpsToday.map((lead) => (
              <div
                key={lead._id}
                className="flex items-center justify-between bg-white rounded-xl px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-slate-800">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.destination}</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg capitalize">
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My leads kanban  */}
      <div>
        <h2 className="text-sm font-medium text-slate-800 mb-4">
          My lead pipeline
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colLeads = leads[col.key] || []
            const isDragTarget = dragOverCol === col.key

            return (
              <div
                key={col.key}
                className="flex-shrink-0 w-56"
                onDragOver={(e) => handleDragOver(e, col.key)}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.color}`} />
                    <span className="text-xs font-medium text-slate-700">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className={`min-h-24 rounded-xl p-2 space-y-2 transition-colors ${
                  isDragTarget
                    ? 'bg-brand-50 border-2 border-dashed border-brand-300'
                    : 'bg-slate-100'
                }`}>
                  {colLeads.map((lead) => (
                    <div
                      key={lead._id}
                      draggable
                      onDragStart={() => handleDragStart(lead, col.key)}
                      className={`bg-white rounded-lg p-2.5 cursor-grab active:cursor-grabbing border transition-shadow hover:shadow-sm ${
                        lead.isHot
                          ? 'border-l-2 border-l-red-400 border-t-slate-100 border-r-slate-100 border-b-slate-100'
                          : 'border-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <p className="text-xs font-medium text-slate-800 leading-tight">
                          {lead.name}
                        </p>
                        {lead.isHot && (
                          <Flame className="w-3 h-3 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        <span className="text-xs text-slate-500 truncate">
                          {lead.destination}
                        </span>
                      </div>
                      {lead.budget && (
                        <span className="mt-1.5 inline-block text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          ₹{lead.budget}
                        </span>
                      )}
                    </div>
                  ))}

                  {colLeads.length === 0 && (
                    <div className="flex items-center justify-center h-16">
                      <p className="text-xs text-slate-400">No leads</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick stats summary */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h3 className="text-sm font-medium text-slate-800 mb-4">
          Pipeline summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {COLUMNS.map((col) => {
            const count = leads[col.key]?.length || 0
            const pct = totalLeads > 0
              ? Math.round((count / totalLeads) * 100)
              : 0
            return (
              <div key={col.key} className="text-center">
                <div className={`w-10 h-10 rounded-full ${col.color} flex items-center justify-center mx-auto mb-2 opacity-80`}>
                  <span className="text-white text-xs font-medium">{count}</span>
                </div>
                <p className="text-xs font-medium text-slate-700 capitalize">
                  {col.label}
                </p>
                <p className="text-xs text-slate-400">{pct}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AgentDashboardPage