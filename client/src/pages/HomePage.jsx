import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  Clock,
  Shield,
  Headphones,
  CreditCard,
  Star,
  ChevronRight,
  Plane,
} from 'lucide-react'
import TourCard from '../components/common/TourCard'
import TourCardSkeleton from '../components/common/TourCardSkeleton'

const MOCK_TOURS = [
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
  },
]

const FILTER_PILLS = [
  { label: 'All', value: 'all' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia', value: 'asia' },
  { label: 'Middle East', value: 'middleeast' },
  { label: 'Honeymoon', value: 'honeymoon' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Budget Picks', value: 'budget' },
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

// ─────────────────────────────────────────────────────────────────────────────

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchDestination, setSearchDestination] = useState('')
  const [searchDuration, setSearchDuration] = useState('')
  const [searchBudget, setSearchBudget] = useState('')
  const [isLoading] = useState(false)
  const navigate = useNavigate()

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

  const filteredTours = MOCK_TOURS.filter((tour) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'europe') {
      return tour.countries.some((c) =>
        ['France', 'Switzerland', 'Italy', 'Zurich', 'Interlaken', 'Geneva'].includes(c)
      )
    }
    if (activeFilter === 'asia') {
      return tour.countries.some((c) =>
        ['Tokyo', 'Kyoto', 'Osaka', 'Ubud', 'Seminyak', 'Nusa Dua'].includes(c)
      )
    }
    if (activeFilter === 'middleeast') {
      return tour.countries.some((c) =>
        ['Downtown', 'Desert Safari', 'Marina'].includes(c)
      )
    }
    if (activeFilter === 'honeymoon') {
      return tour.title.toLowerCase().includes('honeymoon') ||
        tour.title.toLowerCase().includes('maldives')
    }
    if (activeFilter === 'adventure') {
      return tour.title.toLowerCase().includes('adventure') ||
        tour.title.toLowerCase().includes('alps')
    }
    if (activeFilter === 'budget') {
      return tour.price <= 100000
    }
    return true
  })

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <TourCardSkeleton key={i} />)
            : filteredTours.length > 0
            ? filteredTours.map((tour) => <TourCard key={tour._id} tour={tour} />)
            : (
              <div className="col-span-3 text-center py-16">
                <p className="text-slate-400 text-sm">
                  No tours found for this filter.
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
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