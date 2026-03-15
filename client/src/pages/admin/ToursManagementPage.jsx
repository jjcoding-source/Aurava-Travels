import { useState, useEffect } from 'react'
import {
  Plus, Search, Edit, Trash2,
  Loader2, X, Check, Star,
  Users, Clock, MapPin,
} from 'lucide-react'
import { getAllTours, createTour, updateTour, deleteTour } from '../../api/tourApi'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'middleeast', label: 'Middle East' },
  { value: 'honeymoon', label: 'Honeymoon' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'budget', label: 'Budget' },
]

const EMPTY_FORM = {
  title: '',
  overview: '',
  countries: '',
  duration: '',
  price: '',
  totalSeats: 40,
  seatsAvailable: 40,
  category: 'europe',
  badge: '',
  isFeatured: false,
  isActive: true,
}

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


const ToursManagementPage = () => {
  const [tours, setTours] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTour, setEditingTour] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  // Fetch tours
  const fetchTours = async () => {
    try {
      setIsLoading(true)
      const data = await getAllTours({ limit: 50 })
      setTours(data.tours)
    } catch (error) {
      toast.error('Failed to load tours')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTours()
  }, [])

  // Filter tours 
  const filteredTours = tours.filter((tour) => {
    const matchSearch =
      !search ||
      tour.title.toLowerCase().includes(search.toLowerCase()) ||
      tour.countries.some((c) =>
        c.toLowerCase().includes(search.toLowerCase())
      )
    const matchFilter =
      activeFilter === 'all' ||
      (activeFilter === 'featured' && tour.isFeatured) ||
      (activeFilter === 'active' && tour.isActive) ||
      (activeFilter === 'inactive' && !tour.isActive) ||
      tour.category === activeFilter
    return matchSearch && matchFilter
  })

  //  Open create modal 
  const handleCreate = () => {
    setEditingTour(null)
    setFormData(EMPTY_FORM)
    setFormErrors({})
    setShowModal(true)
  }

  //  Open edit modal 
  const handleEdit = (tour) => {
    setEditingTour(tour)
    setFormData({
      title: tour.title || '',
      overview: tour.overview || '',
      countries: Array.isArray(tour.countries)
        ? tour.countries.join(', ')
        : tour.countries || '',
      duration: tour.duration || '',
      price: tour.price || '',
      totalSeats: tour.totalSeats || 40,
      seatsAvailable: tour.seatsAvailable || 40,
      category: tour.category || 'europe',
      badge: tour.badge || '',
      isFeatured: tour.isFeatured || false,
      isActive: tour.isActive !== false,
    })
    setFormErrors({})
    setShowModal(true)
  }

  // Delete tour 
  const handleDelete = async (tourId) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) return
    setDeletingId(tourId)
    try {
      await deleteTour(tourId)
      setTours((prev) => prev.filter((t) => t._id !== tourId))
      toast.success('Tour deleted successfully')
    } catch (error) {
      toast.error('Failed to delete tour')
    } finally {
      setDeletingId(null)
    }
  }

  // Validate form 
  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Title is required'
    if (!formData.overview.trim()) errors.overview = 'Overview is required'
    if (!formData.countries.trim()) errors.countries = 'Countries are required'
    if (!formData.duration) errors.duration = 'Duration is required'
    if (!formData.price) errors.price = 'Price is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form change 
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  //  Save tour 
  const handleSave = async () => {
    if (!validateForm()) return
    setIsSaving(true)
    try {
      const payload = {
        ...formData,
        countries: formData.countries.split(',').map((c) => c.trim()).filter(Boolean),
        duration: Number(formData.duration),
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
        seatsAvailable: Number(formData.seatsAvailable),
      }

      if (editingTour) {
        const data = await updateTour(editingTour._id, payload)
        setTours((prev) =>
          prev.map((t) => t._id === editingTour._id ? data.tour : t)
        )
        toast.success('Tour updated successfully')
      } else {
        const data = await createTour(payload)
        setTours((prev) => [data.tour, ...prev])
        toast.success('Tour created successfully')
      }

      setShowModal(false)
      setFormData(EMPTY_FORM)
      setEditingTour(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save tour')
    } finally {
      setIsSaving(false)
    }
  }

  const getSeatColor = (available, total) => {
    const pct = ((total - available) / total) * 100
    if (pct >= 75) return 'bg-red-500'
    if (pct >= 50) return 'bg-amber-400'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-5">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-medium text-slate-800">
            Tour Packages
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {tours.length} packages in total
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-700 bg-white"
            />
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add tour
          </button>
        </div>
      </div>

      {/* ── Filter pills ─ */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { label: 'All', value: 'all' },
          { label: 'Featured', value: 'featured' },
          { label: 'Active', value: 'active' },
          { label: 'Europe', value: 'europe' },
          { label: 'Asia', value: 'asia' },
          { label: 'Honeymoon', value: 'honeymoon' },
        ].map((pill) => (
          <button
            key={pill.value}
            onClick={() => setActiveFilter(pill.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === pill.value
                ? 'bg-brand-700 text-white border-brand-700'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-700'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* ─Tours grid ─ */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading tours...</span>
          </div>
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-slate-400 mb-3">No tours found</p>
          <button
            onClick={handleCreate}
            className="text-sm text-brand-700 font-medium hover:underline"
          >
            Create your first tour
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTours.map((tour) => (
            <div
              key={tour._id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Color banner */}
              <div className="h-28 bg-brand-800 flex items-end p-3 relative">
                <div className="flex gap-2">
                  <span className="bg-white/90 text-slate-700 text-xs font-medium px-2 py-1 rounded-lg">
                    {tour.duration} Days
                  </span>
                  <span className="bg-white/90 text-slate-700 text-xs font-medium px-2 py-1 rounded-lg capitalize">
                    {tour.category}
                  </span>
                </div>

                {/* Status badges */}
                <div className="absolute top-3 right-3 flex gap-1">
                  {tour.isFeatured && (
                    <span className="bg-amber-400 text-amber-900 text-xs font-medium px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" />
                      Featured
                    </span>
                  )}
                  {!tour.isActive && (
                    <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-lg">
                      Inactive
                    </span>
                  )}
                  {tour.badge && (
                    <span className="bg-white/90 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-lg">
                      {tour.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-slate-800 mb-1 truncate">
                  {tour.title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">
                    {Array.isArray(tour.countries)
                      ? tour.countries.join(' · ')
                      : tour.countries}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{tour.duration}D</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{tour.seatsAvailable} seats left</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{tour.rating}</span>
                  </div>
                </div>

                {/* Seat bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Availability</span>
                    <span>{tour.seatsAvailable}/{tour.totalSeats}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getSeatColor(tour.seatsAvailable, tour.totalSeats)}`}
                      style={{
                        width: `${((tour.totalSeats - tour.seatsAvailable) / tour.totalSeats) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Price and actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-base font-medium text-slate-800">
                      ₹{tour.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ person</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(tour)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:border-brand-700 hover:text-brand-700 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tour._id)}
                      disabled={deletingId === tour._id}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {deletingId === tour._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <div
            onClick={handleCreate}
            className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-700 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 min-h-64"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">
                Create new package
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Add destinations, pricing and itinerary
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─ Create/Edit Modal ─ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 max-h-screen overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-sm font-medium text-slate-800">
                {editingTour ? 'Edit tour package' : 'Create new tour package'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4">

              <FormField
                label="Tour title" name="title"
                placeholder="Europe Grand Tour" required
                value={formData.title}
                onChange={handleFormChange}
                errors={formErrors}
              />

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Overview <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="overview"
                  value={formData.overview}
                  onChange={handleFormChange}
                  placeholder="Brief description of the tour..."
                  rows={3}
                  className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors resize-none ${
                    formErrors.overview
                      ? 'border-red-400'
                      : 'border-slate-200 focus:border-brand-700'
                  }`}
                />
                {formErrors.overview && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.overview}</p>
                )}
              </div>

              <FormField
                label="Countries (comma separated)" name="countries"
                placeholder="France, Switzerland, Italy" required
                value={formData.countries}
                onChange={handleFormChange}
                errors={formErrors}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Duration (days)" name="duration"
                  type="number" placeholder="10" required
                  value={formData.duration}
                  onChange={handleFormChange}
                  errors={formErrors}
                />
                <FormField
                  label="Price (₹ per person)" name="price"
                  type="number" placeholder="250000" required
                  value={formData.price}
                  onChange={handleFormChange}
                  errors={formErrors}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Total seats" name="totalSeats"
                  type="number" placeholder="40"
                  value={formData.totalSeats}
                  onChange={handleFormChange}
                  errors={formErrors}
                />
                <FormField
                  label="Seats available" name="seatsAvailable"
                  type="number" placeholder="40"
                  value={formData.seatsAvailable}
                  onChange={handleFormChange}
                  errors={formErrors}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-700"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <FormField
                  label="Badge (optional)" name="badge"
                  placeholder="Selling Fast, New, Popular"
                  value={formData.badge}
                  onChange={handleFormChange}
                  errors={formErrors}
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      formData.isFeatured ? 'bg-brand-700' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      formData.isFeatured ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    Featured tour
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      formData.isActive ? 'bg-green-500' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      formData.isActive ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    Active
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowModal(false)
                  setFormData(EMPTY_FORM)
                  setEditingTour(null)
                  setFormErrors({})
                }}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
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
                    <Check className="w-3.5 h-3.5" />
                    {editingTour ? 'Update tour' : 'Create tour'}
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

export default ToursManagementPage