import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search, SlidersHorizontal, X,
  ChevronLeft, ChevronRight, ArrowUpDown,
} from 'lucide-react'
import TourCard from '../components/common/TourCard'
import TourCardSkeleton from '../components/common/TourCardSkeleton'

//Mock Data
const ALL_TOURS = [
  {
    _id: '1',
    title: 'Europe Grand Tour',
    countries: ['France', 'Switzerland', 'Italy'],
    duration: 10,
    price: 250000,
    seatsAvailable: 12,
    rating: 4.9,
    reviewCount: 128,
    badge: 'Selling Fast',
    category: 'europe',
  },
  {
    _id: '2',
    title: 'Bali Bliss Escape',
    countries: ['Ubud', 'Seminyak', 'Nusa Dua'],
    duration: 7,
    price: 85000,
    seatsAvailable: 22,
    rating: 4.8,
    reviewCount: 96,
    badge: null,
    category: 'asia',
  },
  {
    _id: '3',
    title: 'Dubai Luxury Getaway',
    countries: ['Downtown', 'Desert Safari', 'Marina'],
    duration: 5,
    price: 110000,
    seatsAvailable: 32,
    rating: 4.7,
    reviewCount: 74,
    badge: 'New',
    category: 'middleeast',
  },
  {
    _id: '4',
    title: 'Swiss Alps Adventure',
    countries: ['Zurich', 'Interlaken', 'Geneva'],
    duration: 8,
    price: 190000,
    seatsAvailable: 8,
    rating: 4.9,
    reviewCount: 103,
    badge: null,
    category: 'europe',
  },
  {
    _id: '5',
    title: 'Japan Cherry Blossom',
    countries: ['Tokyo', 'Kyoto', 'Osaka'],
    duration: 12,
    price: 220000,
    seatsAvailable: 18,
    rating: 5.0,
    reviewCount: 61,
    badge: 'Popular',
    category: 'asia',
  },
  {
    _id: '6',
    title: 'Maldives Honeymoon',
    countries: ['North Male Atoll', 'Baa Atoll'],
    duration: 6,
    price: 160000,
    seatsAvailable: 10,
    rating: 4.8,
    reviewCount: 88,
    badge: null,
    category: 'honeymoon',
  },
  {
    _id: '7',
    title: 'Thailand Explorer',
    countries: ['Bangkok', 'Chiang Mai', 'Phuket'],
    duration: 8,
    price: 95000,
    seatsAvailable: 25,
    rating: 4.6,
    reviewCount: 112,
    badge: null,
    category: 'asia',
  },
  {
    _id: '8',
    title: 'Singapore City Break',
    countries: ['Marina Bay', 'Sentosa', 'Clarke Quay'],
    duration: 5,
    price: 75000,
    seatsAvailable: 30,
    rating: 4.5,
    reviewCount: 67,
    badge: null,
    category: 'asia',
  },
  {
    _id: '9',
    title: 'Paris Romance Getaway',
    countries: ['Paris', 'Versailles'],
    duration: 6,
    price: 175000,
    seatsAvailable: 14,
    rating: 4.8,
    reviewCount: 92,
    badge: null,
    category: 'europe',
  },
]

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Duration: Short First', value: 'duration_asc' },
  { label: 'Highest Rated', value: 'rating' },
]

const DURATION_OPTIONS = [
  { label: 'Any duration', value: '' },
  { label: 'Up to 5 days', value: '5' },
  { label: '6 to 8 days', value: '8' },
  { label: '9 to 12 days', value: '12' },
  { label: '13+ days', value: '99' },
]

const CATEGORY_OPTIONS = [
  { label: 'All destinations', value: '' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia', value: 'asia' },
  { label: 'Middle East', value: 'middleeast' },
  { label: 'Honeymoon', value: 'honeymoon' },
]

const TOURS_PER_PAGE = 6


const ToursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const [filters, setFilters] = useState({
    search: searchParams.get('destination') || '',
    category: searchParams.get('category') || '',
    duration: searchParams.get('duration') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
  })
  const [sortBy, setSortBy] = useState('popular')

  
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [filters, sortBy])

 
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy])

  const filteredAndSorted = useMemo(() => {
    let result = [...ALL_TOURS]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.countries.some((c) => c.toLowerCase().includes(q))
      )
    }

    if (filters.category) {
      result = result.filter((t) => t.category === filters.category)
    }

    if (filters.duration) {
      const max = parseInt(filters.duration)
      if (max === 5) result = result.filter((t) => t.duration <= 5)
      else if (max === 8) result = result.filter((t) => t.duration >= 6 && t.duration <= 8)
      else if (max === 12) result = result.filter((t) => t.duration >= 9 && t.duration <= 12)
      else if (max === 99) result = result.filter((t) => t.duration >= 13)
    }

    if (filters.maxPrice) {
      result = result.filter((t) => t.price <= parseInt(filters.maxPrice))
    }
 
    if (filters.minRating) {
      result = result.filter((t) => t.rating >= parseFloat(filters.minRating))
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'duration_asc':
        result.sort((a, b) => a.duration - b.duration)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    return result
  }, [filters, sortBy])

  // ── Pagination ────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredAndSorted.length / TOURS_PER_PAGE)
  const paginatedTours = filteredAndSorted.slice(
    (currentPage - 1) * TOURS_PER_PAGE,
    currentPage * TOURS_PER_PAGE
  )

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      category: '',
      duration: '',
      maxPrice: '',
      minRating: '',
    })
    setSearchParams({})
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const FilterSidebar = () => (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">
          Destination
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search destination..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-700 bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">
          Category
        </label>
        <div className="space-y-1.5">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilterChange('category', opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.category === opt.value
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">
          Duration
        </label>
        <div className="space-y-1.5">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilterChange('duration', opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.duration === opt.value
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">
          Max Budget
        </label>
        <select
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-700 bg-white"
        >
          <option value="">Any budget</option>
          <option value="100000">Up to ₹1,00,000</option>
          <option value="200000">Up to ₹2,00,000</option>
          <option value="300000">Up to ₹3,00,000</option>
          <option value="500000">Up to ₹5,00,000</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider">
          Minimum Rating
        </label>
        <div className="space-y-1.5">
          {[
            { label: 'Any rating', value: '' },
            { label: '4.5 and above', value: '4.5' },
            { label: '4.7 and above', value: '4.7' },
            { label: '4.9 and above', value: '4.9' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilterChange('minRating', opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.minRating === opt.value
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-medium text-slate-800 mb-1">
            All Tour Packages
          </h1>
          <p className="text-sm text-slate-500">
            Discover {ALL_TOURS.length}+ curated tours across the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1 min-w-0">

            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">

                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-brand-700"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-brand-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Results count */}
                <p className="text-sm text-slate-500">
                  <span className="font-medium text-slate-800">
                    {filteredAndSorted.length}
                  </span>{' '}
                  {filteredAndSorted.length === 1 ? 'tour' : 'tours'} found
                </p>
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-brand-700 bg-white text-slate-700"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full border border-brand-200"
                    >
                      {value}
                      <button
                        onClick={() => handleFilterChange(key, '')}
                        className="hover:text-brand-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                })}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Tour cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {isLoading
                ? Array(6).fill(0).map((_, i) => <TourCardSkeleton key={i} />)
                : paginatedTours.length > 0
                ? paginatedTours.map((tour) => (
                    <TourCard key={tour._id} tour={tour} />
                  ))
                : (
                  <div className="col-span-3 text-center py-20">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      No tours found
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Try adjusting your filters or search term
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-brand-700 font-medium hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )
              }
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
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
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-medium text-slate-800">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar />
            </div>
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-brand-700 text-white py-2.5 rounded-xl text-sm font-medium"
              >
                Show {filteredAndSorted.length} tours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ToursPage