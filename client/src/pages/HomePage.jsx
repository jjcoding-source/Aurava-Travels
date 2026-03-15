import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, MapPin, Clock, Shield,
  Headphones, CreditCard, Star,
  ChevronRight, Plane,
} from 'lucide-react'
import TourCard from '../components/common/TourCard'
import TourCardSkeleton from '../components/common/TourCardSkeleton'
import { getAllTours } from '../api/tourApi'
import toast from 'react-hot-toast'

const FILTER_PILLS = [
  { label: 'All', value: '' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia', value: 'asia' },
  { label: 'Middle East', value: 'middleeast' },
  { label: 'Honeymoon', value: 'honeymoon' },
  { label: 'Adventure', value: 'adventure' },
]

const WHY_ITEMS = [
  {
    icon: Shield,
    title: '100% Safe & Trusted',
    desc: 'IATA-certified agency with 15 years of experience and 12,000+ happy travellers.',
    bg: 'bg-indigo-50',
    color: 'text-brand-700',
  },
  {
    icon: Plane,
    title: 'All-Inclusive Packages',
    desc: 'Flights, hotels, meals, and visas — all covered in one transparent price.',
    bg: 'bg-orange-50',
    color: 'text-orange-600',
  },
  {
    icon: Headphones,
    title: '24/7 Trip Support',
    desc: 'Dedicated agent on call throughout your journey, every step of the way.',
    bg: 'bg-green-50',
    color: 'text-green-600',
  },
  {
    icon: CreditCard,
    title: 'Easy EMI Options',
    desc: 'Pay in installments — 0% interest on select tours with major bank cards.',
    bg: 'bg-red-50',
    color: 'text-red-500',
  },
]

const STATS = [
  { value: '12,400+', label: 'Happy travellers' },
  { value: '4.9 ★', label: 'Average rating' },
  { value: '60+', label: 'Countries' },
  { value: '500+', label: 'Tour packages' },
]

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState('')
  const [searchDestination, setSearchDestination] = useState('')
  const [searchDuration, setSearchDuration] = useState('')
  const [searchBudget, setSearchBudget] = useState('')
  const [tours, setTours] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch tours from API 
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true)
        const params = {}
        if (activeFilter) params.category = activeFilter
        const data = await getAllTours({ ...params, limit: 6 })
        setTours(data.tours)
      } catch (error) {
        toast.error('Failed to load tours')
      } finally {
        setIsLoading(false)
      }
    }
    fetchTours()
  }, [activeFilter])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchDestination) params.set('destination', searchDestination)
    if (searchDuration) params.set('duration', searchDuration)
    if (searchBudget) params.set('maxPrice', searchBudget)
    navigate(`/tours?${params.toString()}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen">

      <section className="bg-brand-800 pt-14 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs text-white/80 font-medium">
              500+ tours across 60 countries
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-medium text-white leading-tight mb-4">
            Explore the world,{' '}
            <span className="text-brand-200">your way</span>
          </h1>
          <p className="text-base text-white/60 max-w-xl mx-auto mb-10">
            Curated group tours, luxury packages, and custom itineraries —
            handcrafted for Indian travellers.
          </p>

          <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto shadow-2xl">
            <div className="flex-1 flex items-center gap-2 px-3 py-2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="flex-1 text-left">
                <label className="block text-xs text-slate-400 font-medium mb-0.5">
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="Europe, Bali, Dubai..."
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm text-slate-700 placeholder-slate-300 outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="hidden sm:block w-px bg-slate-100 my-2" />

            <div className="flex-1 flex items-center gap-2 px-3 py-2">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="flex-1 text-left">
                <label className="block text-xs text-slate-400 font-medium mb-0.5">
                  Duration
                </label>
                <select
                  value={searchDuration}
                  onChange={(e) => setSearchDuration(e.target.value)}
                  className="w-full text-sm text-slate-700 outline-none bg-transparent cursor-pointer"
                >
                  <option value="">Any duration</option>
                  <option value="5">Up to 5 days</option>
                  <option value="7">Up to 7 days</option>
                  <option value="10">Up to 10 days</option>
                  <option value="15">Up to 15 days</option>
                </select>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-slate-100 my-2" />

            <div className="flex-1 flex items-center gap-2 px-3 py-2">
              <span className="text-slate-400 text-sm flex-shrink-0 font-medium">₹</span>
              <div className="flex-1 text-left">
                <label className="block text-xs text-slate-400 font-medium mb-0.5">
                  Max Budget
                </label>
                <select
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="w-full text-sm text-slate-700 outline-none bg-transparent cursor-pointer"
                >
                  <option value="">Any budget</option>
                  <option value="100000">Up to ₹1,00,000</option>
                  <option value="200000">Up to ₹2,00,000</option>
                  <option value="300000">Up to ₹3,00,000</option>
                  <option value="500000">Up to ₹5,00,000</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors flex-shrink-0 w-full sm:w-auto"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-medium text-white">{stat.value}</div>
                <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tour Packages Section ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-medium text-slate-800">
              Popular tour packages
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked tours loved by Indian travellers
            </p>
          </div>
          <button
            onClick={() => navigate('/tours')}
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800 transition-colors"
          >
            View all tours
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setActiveFilter(pill.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeFilter === pill.value
                  ? 'bg-brand-700 text-white border-brand-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand-700 hover:text-brand-700'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Tour cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <TourCardSkeleton key={i} />)
            : tours.length > 0
            ? tours.map((tour) => <TourCard key={tour._id} tour={tour} />)
            : (
              <div className="col-span-3 text-center py-16">
                <p className="text-slate-400 text-sm">
                  No tours found for this filter.
                </p>
                <button
                  onClick={() => setActiveFilter('')}
                  className="mt-3 text-sm text-brand-700 hover:underline"
                >
                  Clear filter
                </button>
              </div>
            )
          }
        </div>

        <div className="sm:hidden mt-8 text-center">
          <button
            onClick={() => navigate('/tours')}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-700"
          >
            View all tours
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section className="bg-slate-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-slate-800">
              Why book with Aurava?
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              We take care of everything so you just enjoy the journey
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="text-sm font-medium text-slate-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand-700 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-medium text-white mb-3">
            Ready for your next adventure?
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Talk to our travel experts and get a personalised tour plan — completely free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/tours')}
              className="bg-white text-brand-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              Browse all tours
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border border-white/30 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              Talk to an expert
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage