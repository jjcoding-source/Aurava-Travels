import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Clock, ChevronRight } from 'lucide-react'

const DESTINATIONS = [
  {
    id: 'europe',
    name: 'Europe',
    tagline: 'History, culture and breathtaking landscapes',
    description: 'From the romantic streets of Paris to the snowy peaks of the Swiss Alps and the ancient ruins of Rome — Europe is a continent of endless wonder.',
    region: 'europe',
    flag: '🌍',
    gradient: 'from-blue-900 to-blue-700',
    bestTime: 'Apr — Oct',
    toursCount: 12,
    highlights: ['Eiffel Tower', 'Swiss Alps', 'Colosseum', 'Venice Canals'],
    countries: ['France', 'Switzerland', 'Italy', 'Germany', 'Spain'],
  },
  {
    id: 'bali',
    name: 'Bali, Indonesia',
    tagline: 'Island of the Gods',
    description: 'Stunning rice terraces, ancient temples, lush jungles and pristine beaches make Bali one of the most magical destinations in the world.',
    region: 'asia',
    flag: '🏝',
    gradient: 'from-green-900 to-green-700',
    bestTime: 'Apr — Oct',
    toursCount: 8,
    highlights: ['Tegalalang Rice Terrace', 'Tanah Lot Temple', 'Mount Batur', 'Seminyak Beach'],
    countries: ['Indonesia'],
  },
  {
    id: 'dubai',
    name: 'Dubai, UAE',
    tagline: 'Where luxury meets the desert',
    description: 'A city of superlatives — the tallest building, the largest mall, and the most glamorous hotels. Dubai is a once-in-a-lifetime experience.',
    region: 'middleeast',
    flag: '🏙',
    gradient: 'from-amber-800 to-amber-600',
    bestTime: 'Nov — Mar',
    toursCount: 6,
    highlights: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Palm Jumeirah'],
    countries: ['UAE'],
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    tagline: 'Land of lakes, mountains and chocolate',
    description: 'Crystal-clear lakes, snow-capped alpine peaks, charming medieval towns and world-class ski resorts make Switzerland a year-round paradise.',
    region: 'europe',
    flag: '🏔',
    gradient: 'from-sky-900 to-sky-600',
    bestTime: 'Jun — Sep',
    toursCount: 9,
    highlights: ['Jungfraujoch', 'Lake Geneva', 'Interlaken', 'Zurich Old Town'],
    countries: ['Switzerland'],
  },
  {
    id: 'japan',
    name: 'Japan',
    tagline: 'Ancient traditions meet modern marvels',
    description: 'From cherry blossom season in Kyoto to the neon-lit streets of Tokyo — Japan is a country that will surprise and delight you at every turn.',
    region: 'asia',
    flag: '⛩',
    gradient: 'from-red-900 to-red-700',
    bestTime: 'Mar — May',
    toursCount: 7,
    highlights: ['Mount Fuji', 'Fushimi Inari', 'Tokyo Shibuya', 'Arashiyama Bamboo'],
    countries: ['Japan'],
  },
  {
    id: 'maldives',
    name: 'Maldives',
    tagline: 'Paradise on earth',
    description: 'Overwater villas, crystal-clear turquoise lagoons, vibrant coral reefs and powdery white sand beaches — the Maldives is pure paradise.',
    region: 'asia',
    flag: '🐠',
    gradient: 'from-teal-900 to-teal-600',
    bestTime: 'Nov — Apr',
    toursCount: 5,
    highlights: ['Overwater Villas', 'Snorkelling', 'Sunset Cruises', 'Coral Reefs'],
    countries: ['Maldives'],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    tagline: 'The city that has everything',
    description: 'A clean, green, ultra-modern city state where East meets West. World-class food, stunning architecture and incredible shopping await.',
    region: 'asia',
    flag: '🌆',
    gradient: 'from-indigo-900 to-indigo-700',
    bestTime: 'Feb — Apr',
    toursCount: 4,
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Hawker Centres'],
    countries: ['Singapore'],
  },
  {
    id: 'thailand',
    name: 'Thailand',
    tagline: 'Land of smiles',
    description: 'Ancient temples, turquoise beaches, bustling night markets and warm hospitality — Thailand is one of Asia\'s most beloved destinations.',
    region: 'asia',
    flag: '🙏',
    gradient: 'from-purple-900 to-purple-700',
    bestTime: 'Nov — Mar',
    toursCount: 6,
    highlights: ['Phi Phi Islands', 'Chiang Mai Temples', 'Bangkok Street Food', 'Elephant Sanctuary'],
    countries: ['Thailand'],
  },
  {
    id: 'paris',
    name: 'Paris, France',
    tagline: 'The city of love and light',
    description: 'The Eiffel Tower, the Louvre, Notre Dame, charming cafes and world-class cuisine — Paris is simply one of the greatest cities on earth.',
    region: 'europe',
    flag: '🗼',
    gradient: 'from-pink-900 to-pink-700',
    bestTime: 'Apr — Jun',
    toursCount: 5,
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre Dame', 'Champs Elysees'],
    countries: ['France'],
  },
]

const REGIONS = [
  { label: 'All', value: '' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia', value: 'asia' },
  { label: 'Middle East', value: 'middleeast' },
]

const DestinationsPage = () => {
  const [search, setSearch] = useState('')
  const [activeRegion, setActiveRegion] = useState('')
  const navigate = useNavigate()

  const filtered = DESTINATIONS.filter((dest) => {
    const matchSearch =
      !search ||
      dest.name.toLowerCase().includes(search.toLowerCase()) ||
      dest.countries.some((c) =>
        c.toLowerCase().includes(search.toLowerCase())
      )
    const matchRegion = !activeRegion || dest.region === activeRegion
    return matchSearch && matchRegion
  })

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <div className="bg-brand-800 py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <MapPin className="w-3.5 h-3.5 text-white/70" />
            <span className="text-xs text-white/70 font-medium">
              60+ destinations worldwide
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium text-white mb-3">
            Explore destinations
          </h1>
          <p className="text-white/50 text-sm mb-8">
            Discover handpicked destinations curated for Indian travellers —
            from Europe to Asia and beyond
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl text-sm text-slate-700 placeholder-slate-400 outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Region filter */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {REGIONS.map((region) => (
            <button
              key={region.value}
              onClick={() => setActiveRegion(region.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeRegion === region.value
                  ? 'bg-brand-700 text-white border-brand-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand-700 hover:text-brand-700'
              }`}
            >
              {region.label}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-2">
            {filtered.length} destination{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Destinations grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-slate-400 mb-2">
              No destinations found
            </p>
            <button
              onClick={() => {
                setSearch('')
                setActiveRegion('')
              }}
              className="text-sm text-brand-700 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest) => (
              <div
                key={dest.id}
                onClick={() => navigate(`/destinations/${dest.id}`)}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Color banner */}
                <div className={`h-44 bg-gradient-to-br ${dest.gradient} relative flex flex-col justify-between p-4`}>

                  {/* Flag and tours count */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{dest.flag}</span>
                    <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                      {dest.toursCount} tours
                    </span>
                  </div>

                  {/* Destination name */}
                  <div>
                    <h3 className="text-xl font-medium text-white mb-1">
                      {dest.name}
                    </h3>
                    <p className="text-white/60 text-xs">{dest.tagline}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {dest.highlights.slice(0, 3).map((h) => (
                      <span
                        key={h}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg"
                      >
                        {h}
                      </span>
                    ))}
                    {dest.highlights.length > 3 && (
                      <span className="text-xs text-slate-400">
                        +{dest.highlights.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Best time + CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Best time: {dest.bestTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-brand-700 group-hover:gap-2 transition-all">
                      Explore
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DestinationsPage