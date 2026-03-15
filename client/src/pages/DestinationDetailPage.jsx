import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  MapPin, Clock, ChevronRight,
  Check, Plane, Star, ArrowRight,
  Loader2,
} from 'lucide-react'
import TourCard from '../components/common/TourCard'
import TourCardSkeleton from '../components/common/TourCardSkeleton'
import { getAllTours } from '../api/tourApi'
import toast from 'react-hot-toast'

const DESTINATIONS = {
  europe: {
    id: 'europe',
    name: 'Europe',
    tagline: 'History, culture and breathtaking landscapes',
    description: 'Europe is a continent of extraordinary diversity — ancient ruins and cutting-edge art, Alpine peaks and sun-kissed Mediterranean coastlines, world-famous cuisine and centuries-old traditions. From the romantic boulevards of Paris to the canals of Venice and the snowy peaks of Switzerland, Europe offers an unmatched travel experience.',
    region: 'europe',
    flag: '🌍',
    gradient: 'from-blue-900 to-blue-700',
    bestTime: 'April to October',
    bestTimeDetail: 'Spring and summer offer the best weather across most of Europe. Shoulder season (Apr-May, Sep-Oct) means fewer crowds and lower prices.',
    visaInfo: 'Indian passport holders require a Schengen visa for most European countries. Apply 3-4 weeks in advance.',
    capital: 'Multiple countries',
    currency: 'Euro (EUR), CHF (Switzerland)',
    language: 'French, German, Italian and more',
    thingsToDo: [
      { title: 'Eiffel Tower, Paris', desc: 'Climb to the top for panoramic views of the most romantic city in the world.' },
      { title: 'Swiss Alps', desc: 'Take the Jungfrau railway to the Top of Europe at 3454m above sea level.' },
      { title: 'Colosseum, Rome', desc: 'Step inside the world\'s most famous ancient amphitheatre.' },
      { title: 'Venice Gondola Ride', desc: 'Glide through centuries-old canals on a traditional gondola.' },
      { title: 'Louvre Museum', desc: 'Home to the Mona Lisa and thousands of other masterpieces.' },
      { title: 'Santorini Sunsets', desc: 'Watch the world\'s most famous sunsets from the clifftops of Oia.' },
    ],
    highlights: [
      'Eiffel Tower', 'Swiss Alps', 'Colosseum',
      'Venice Canals', 'Louvre Museum', 'Santorini',
    ],
    searchKey: 'europe',
  },
  bali: {
    id: 'bali',
    name: 'Bali, Indonesia',
    tagline: 'Island of the Gods',
    description: 'Bali is one of the world\'s most iconic travel destinations — a magical island of spiritual temples, terraced rice paddies, lush volcanic mountains and pristine beaches. Whether you seek adventure, spiritual renewal or pure relaxation, Bali delivers it all with warm Indonesian hospitality.',
    region: 'asia',
    flag: '🏝',
    gradient: 'from-green-900 to-green-700',
    bestTime: 'April to October',
    bestTimeDetail: 'The dry season from April to October is the best time to visit Bali. July and August are peak season — book early.',
    visaInfo: 'Indian passport holders get visa on arrival in Indonesia for up to 30 days. Cost is approximately $35 USD.',
    capital: 'Denpasar',
    currency: 'Indonesian Rupiah (IDR)',
    language: 'Balinese, Indonesian',
    thingsToDo: [
      { title: 'Tegalalang Rice Terraces', desc: 'Walk through stunning emerald-green terraced rice fields near Ubud.' },
      { title: 'Tanah Lot Temple', desc: 'Visit the iconic sea temple perched on a rocky outcrop in the ocean.' },
      { title: 'Mount Batur Sunrise Trek', desc: 'Hike to the crater rim of an active volcano to watch the sunrise.' },
      { title: 'Monkey Forest, Ubud', desc: 'Wander through a sacred forest inhabited by hundreds of macaques.' },
      { title: 'Seminyak Beach', desc: 'Relax on one of Bali\'s most beautiful beaches with world-class resorts.' },
      { title: 'Traditional Cooking Class', desc: 'Learn to cook authentic Balinese dishes from local families.' },
    ],
    highlights: [
      'Rice Terraces', 'Tanah Lot', 'Mount Batur',
      'Monkey Forest', 'Seminyak Beach', 'Cooking Class',
    ],
    searchKey: 'bali',
  },
  dubai: {
    id: 'dubai',
    name: 'Dubai, UAE',
    tagline: 'Where luxury meets the desert',
    description: 'Dubai is a city of superlatives and spectacular contrasts — where the ancient desert meets ultramodern architecture, where traditional souks exist alongside the world\'s largest malls, and where camels roam near the world\'s tallest skyscrapers. A truly unique city unlike anywhere else on earth.',
    region: 'middleeast',
    flag: '🏙',
    gradient: 'from-amber-800 to-amber-600',
    bestTime: 'November to March',
    bestTimeDetail: 'Winter months offer perfect weather with temperatures between 20-28°C. Avoid summer — temperatures can exceed 45°C.',
    visaInfo: 'Indian passport holders can get a UAE visa on arrival for 14 days. Longer stay visas available easily online.',
    capital: 'Dubai',
    currency: 'UAE Dirham (AED)',
    language: 'Arabic, English widely spoken',
    thingsToDo: [
      { title: 'Burj Khalifa', desc: 'Visit the observation deck of the world\'s tallest building — 828 metres high.' },
      { title: 'Desert Safari', desc: 'Dune bashing, camel riding, and a BBQ dinner under the stars in the Arabian desert.' },
      { title: 'Dubai Mall & Fountain', desc: 'Shop at the world\'s largest mall and watch the spectacular fountain show.' },
      { title: 'Old Dubai Creek', desc: 'Explore the gold and spice souks and take a traditional abra boat ride.' },
      { title: 'Palm Jumeirah', desc: 'Visit the world-famous man-made island and the Atlantis resort.' },
      { title: 'Dubai Frame', desc: 'Stand in the world\'s largest picture frame for views of old and new Dubai.' },
    ],
    highlights: [
      'Burj Khalifa', 'Desert Safari', 'Dubai Mall',
      'Gold Souk', 'Palm Jumeirah', 'Dubai Frame',
    ],
    searchKey: 'dubai',
  },
  switzerland: {
    id: 'switzerland',
    name: 'Switzerland',
    tagline: 'Land of lakes, mountains and chocolate',
    description: 'Switzerland is one of the most beautiful countries in the world — a land of pristine alpine lakes, snow-capped peaks, charming medieval towns and world-class skiing. Whether you ride the Jungfrau railway to the top of Europe or cruise along Lake Geneva, every view in Switzerland feels like a postcard.',
    region: 'europe',
    flag: '🏔',
    gradient: 'from-sky-900 to-sky-600',
    bestTime: 'June to September',
    bestTimeDetail: 'Summer is perfect for hiking and sightseeing. Winter (Dec-Mar) is ideal for skiing. Spring and autumn offer fewer crowds.',
    visaInfo: 'Switzerland is part of the Schengen area. Indian passport holders require a Schengen visa — apply 3-4 weeks in advance.',
    capital: 'Bern',
    currency: 'Swiss Franc (CHF)',
    language: 'German, French, Italian, Romansh',
    thingsToDo: [
      { title: 'Jungfraujoch', desc: 'Take the cogwheel railway to the Top of Europe at 3454m — home to year-round snow.' },
      { title: 'Mount Titlis', desc: 'Ride the world\'s first revolving cable car and walk the Cliff Walk suspension bridge.' },
      { title: 'Lake Geneva Cruise', desc: 'Cruise across the stunning Lake Geneva between Lausanne and Geneva.' },
      { title: 'Interlaken Adventure', desc: 'Paragliding, skydiving and canyoning in the adventure capital of Switzerland.' },
      { title: 'Zurich Old Town', desc: 'Explore the medieval old town, the Grossmunster cathedral and Bahnhofstrasse.' },
      { title: 'Swiss Chocolate Factory', desc: 'Tour a traditional chocolate factory and sample Switzerland\'s finest chocolates.' },
    ],
    highlights: [
      'Jungfraujoch', 'Mount Titlis', 'Lake Geneva',
      'Interlaken', 'Zurich', 'Swiss Chocolate',
    ],
    searchKey: 'switzerland',
  },
  japan: {
    id: 'japan',
    name: 'Japan',
    tagline: 'Ancient traditions meet modern marvels',
    description: 'Japan is a land of extraordinary contrasts — where ancient Shinto shrines sit beside gleaming skyscrapers, where centuries-old tea ceremonies coexist with cutting-edge technology, and where the delicate beauty of cherry blossoms transforms entire cities into pink wonderlands every spring.',
    region: 'asia',
    flag: '⛩',
    gradient: 'from-red-900 to-red-700',
    bestTime: 'March to May',
    bestTimeDetail: 'Cherry blossom season (late March to early May) is the most magical time to visit Japan. Autumn (Oct-Nov) offers stunning fall foliage.',
    visaInfo: 'Indian passport holders require a Japan visa. Apply through the Japanese consulate or embassy 3-4 weeks in advance.',
    capital: 'Tokyo',
    currency: 'Japanese Yen (JPY)',
    language: 'Japanese',
    thingsToDo: [
      { title: 'Cherry Blossom Viewing', desc: 'Experience hanami — the Japanese tradition of picnicking under blooming cherry trees.' },
      { title: 'Fushimi Inari Shrine', desc: 'Walk through thousands of iconic vermillion torii gates on the hillside of Inari.' },
      { title: 'Shinkansen Bullet Train', desc: 'Travel between cities at 320 km/h on Japan\'s famous high-speed rail network.' },
      { title: 'Arashiyama Bamboo Grove', desc: 'Walk through a towering grove of giant bamboo in the outskirts of Kyoto.' },
      { title: 'Tokyo Shibuya Crossing', desc: 'Stand in the world\'s busiest pedestrian crossing at the heart of Tokyo.' },
      { title: 'Traditional Tea Ceremony', desc: 'Participate in a centuries-old Japanese tea ceremony in a traditional tatami room.' },
    ],
    highlights: [
      'Cherry Blossoms', 'Fushimi Inari', 'Shinkansen',
      'Arashiyama', 'Shibuya Crossing', 'Tea Ceremony',
    ],
    searchKey: 'japan',
  },
  maldives: {
    id: 'maldives',
    name: 'Maldives',
    tagline: 'Paradise on earth',
    description: 'The Maldives is the ultimate tropical paradise — a nation of 1200 coral islands scattered across the Indian Ocean, each surrounded by turquoise lagoons, vibrant coral reefs and impossibly white beaches. It is the world\'s premier destination for overwater villas, snorkelling and absolute luxury.',
    region: 'asia',
    flag: '🐠',
    gradient: 'from-teal-900 to-teal-600',
    bestTime: 'November to April',
    bestTimeDetail: 'The dry season from November to April offers the best weather. December to March is peak season — book months in advance.',
    visaInfo: 'Indian passport holders get a free 30-day visa on arrival in the Maldives. No advance application needed.',
    capital: 'Malé',
    currency: 'Maldivian Rufiyaa (MVR), USD widely accepted',
    language: 'Dhivehi, English widely spoken',
    thingsToDo: [
      { title: 'Overwater Villa Stay', desc: 'Wake up above the turquoise lagoon in a glass-floor overwater bungalow.' },
      { title: 'Snorkelling with Manta Rays', desc: 'Swim alongside giant manta rays in the UNESCO-protected Baa Atoll.' },
      { title: 'Sunset Dolphin Cruise', desc: 'Watch pods of spinner dolphins leap at sunset from a traditional dhoni boat.' },
      { title: 'Underwater Restaurant', desc: 'Dine 5 metres below the ocean surface surrounded by coral and tropical fish.' },
      { title: 'Island Hopping', desc: 'Visit local Maldivian villages, sandbanks and uninhabited desert islands.' },
      { title: 'Couples Spa', desc: 'Indulge in world-class spa treatments in an overwater pavilion above the lagoon.' },
    ],
    highlights: [
      'Overwater Villas', 'Manta Rays', 'Dolphin Cruise',
      'Coral Reefs', 'Island Hopping', 'Luxury Spas',
    ],
    searchKey: 'maldives',
  },
  singapore: {
    id: 'singapore',
    name: 'Singapore',
    tagline: 'The city that has everything',
    description: 'Singapore is Asia\'s most polished and exciting city state — a dazzling blend of Chinese, Malay, Indian and Western cultures packed into a tiny island. From the futuristic Gardens by the Bay to legendary hawker centre food, Singapore is a world-class destination that consistently surprises visitors.',
    region: 'asia',
    flag: '🌆',
    gradient: 'from-indigo-900 to-indigo-700',
    bestTime: 'February to April',
    bestTimeDetail: 'Singapore has a tropical climate year-round. February to April sees less rainfall and is the best time to visit.',
    visaInfo: 'Indian passport holders do not require a visa for Singapore for stays up to 30 days.',
    capital: 'Singapore City',
    currency: 'Singapore Dollar (SGD)',
    language: 'English, Mandarin, Malay, Tamil',
    thingsToDo: [
      { title: 'Gardens by the Bay', desc: 'Walk among the iconic Supertrees and explore the spectacular climate-controlled domes.' },
      { title: 'Marina Bay Sands', desc: 'Visit the iconic three-tower hotel with its rooftop infinity pool and observation deck.' },
      { title: 'Sentosa Island', desc: 'Universal Studios, S.E.A. Aquarium, beaches and Adventure Cove all on one island.' },
      { title: 'Hawker Centre Food', desc: 'Sample Singapore\'s legendary street food — from chicken rice to laksa and chilli crab.' },
      { title: 'Little India and Chinatown', desc: 'Explore two of Asia\'s most vibrant cultural neighbourhoods side by side.' },
      { title: 'Night Safari', desc: 'The world\'s first nocturnal zoo — encounter hundreds of animals in their night habitat.' },
    ],
    highlights: [
      'Gardens by the Bay', 'Marina Bay Sands', 'Sentosa',
      'Hawker Food', 'Little India', 'Night Safari',
    ],
    searchKey: 'singapore',
  },
  thailand: {
    id: 'thailand',
    name: 'Thailand',
    tagline: 'Land of smiles',
    description: 'Thailand enchants visitors with its ornate temples, turquoise waters, lush jungles and some of the warmest hospitality in the world. From the chaotic energy of Bangkok to the serene beauty of Chiang Mai and the paradise islands of Koh Samui — Thailand has something for every kind of traveller.',
    region: 'asia',
    flag: '🙏',
    gradient: 'from-purple-900 to-purple-700',
    bestTime: 'November to March',
    bestTimeDetail: 'The cool dry season from November to March is the best time to visit. Avoid May to October during the monsoon season.',
    visaInfo: 'Indian passport holders can get a Thailand visa on arrival for 15 days. Advance e-visa available for 30 days.',
    capital: 'Bangkok',
    currency: 'Thai Baht (THB)',
    language: 'Thai, English in tourist areas',
    thingsToDo: [
      { title: 'Phi Phi Islands', desc: 'Snorkel in crystal-clear waters and relax on some of Asia\'s most beautiful beaches.' },
      { title: 'Grand Palace, Bangkok', desc: 'Explore the magnificent palace complex and Wat Phra Kaew — the Temple of the Emerald Buddha.' },
      { title: 'Elephant Sanctuary', desc: 'Spend a day with rescued elephants at an ethical sanctuary near Chiang Mai.' },
      { title: 'Floating Market', desc: 'Navigate colourful canal-side markets selling fresh fruits, food and handicrafts.' },
      { title: 'Doi Suthep Temple', desc: 'Visit the golden mountaintop temple overlooking the city of Chiang Mai.' },
      { title: 'Thai Cooking Class', desc: 'Learn to cook authentic pad thai, green curry and mango sticky rice.' },
    ],
    highlights: [
      'Phi Phi Islands', 'Grand Palace', 'Elephants',
      'Floating Market', 'Doi Suthep', 'Thai Cuisine',
    ],
    searchKey: 'thailand',
  },
  paris: {
    id: 'paris',
    name: 'Paris, France',
    tagline: 'The city of love and light',
    description: 'Paris is simply one of the greatest cities on earth — a timeless masterpiece of boulevards, bridges, brasseries and breathtaking art. Whether you\'re climbing the Eiffel Tower, getting lost in the Louvre or sipping cafe au lait at a pavement terrace, every moment in Paris feels cinematic.',
    region: 'europe',
    flag: '🗼',
    gradient: 'from-pink-900 to-pink-700',
    bestTime: 'April to June',
    bestTimeDetail: 'Spring (April-June) and early autumn (Sep-Oct) are the best times to visit Paris — pleasant weather and fewer tourists than peak summer.',
    visaInfo: 'France is part of the Schengen area. Indian passport holders require a Schengen visa — apply at the French consulate 3-4 weeks in advance.',
    capital: 'Paris',
    currency: 'Euro (EUR)',
    language: 'French',
    thingsToDo: [
      { title: 'Eiffel Tower', desc: 'Climb or take the lift to the top of the world\'s most recognisable monument for stunning views.' },
      { title: 'Louvre Museum', desc: 'Spend hours exploring one of the world\'s largest art museums — home to the Mona Lisa.' },
      { title: 'Seine River Cruise', desc: 'Glide past Notre Dame, the Eiffel Tower and the Pont Neuf on a romantic river cruise.' },
      { title: 'Montmartre', desc: 'Wander the cobblestone streets of the artistic hilltop village and visit the Sacré-Coeur.' },
      { title: 'Palace of Versailles', desc: 'Day trip to the opulent royal palace and its extraordinary gardens just outside Paris.' },
      { title: 'French Cuisine', desc: 'Croissants, baguettes, escargot, coq au vin and crème brûlée — eat your way through Paris.' },
    ],
    highlights: [
      'Eiffel Tower', 'Louvre', 'Seine Cruise',
      'Montmartre', 'Versailles', 'French Cuisine',
    ],
    searchKey: 'paris',
  },
}

const DestinationDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tours, setTours] = useState([])
  const [isLoadingTours, setIsLoadingTours] = useState(true)

  const dest = DESTINATIONS[id]

  // Redirect if destination not found 
  useEffect(() => {
    if (!dest) {
      navigate('/destinations')
    }
  }, [id])

  // Fetch tours for this destination 
  useEffect(() => {
    if (!dest) return
    const fetchTours = async () => {
      try {
        setIsLoadingTours(true)
        const data = await getAllTours({
          destination: dest.searchKey,
          limit: 3,
        })
        setTours(data.tours)
      } catch (error) {
        toast.error('Failed to load tours')
      } finally {
        setIsLoadingTours(false)
      }
    }
    fetchTours()
  }, [id])

  if (!dest) return null

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-brand-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/destinations" className="hover:text-brand-700 transition-colors">
              Destinations
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 font-medium">{dest.name}</span>
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className={`bg-gradient-to-br ${dest.gradient} py-14 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4 mb-5">
            <span className="text-5xl">{dest.flag}</span>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full capitalize">
                  {dest.region === 'middleeast' ? 'Middle East' : dest.region}
                </span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                  {dest.toursCount || tours.length} tours available
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-medium text-white mb-2">
                {dest.name}
              </h1>
              <p className="text-white/60 text-sm">{dest.tagline}</p>
            </div>
          </div>

          {/* Quick info */}
          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { label: 'Best time', value: dest.bestTime },
              { label: 'Currency', value: dest.currency.split(',')[0] },
              { label: 'Language', value: dest.language.split(',')[0] },
            ].map((info) => (
              <div key={info.label}>
                <p className="text-xs text-white/40">{info.label}</p>
                <p className="text-sm font-medium text-white">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*  Main content  */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="flex-1 min-w-0 space-y-8">

            {/* Overview */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-3">
                About {dest.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {dest.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {dest.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-green-600" />
                    </div>
                    <span className="text-xs text-slate-600">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Things to do */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-5">
                Things to do
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dest.thingsToDo.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="w-7 h-7 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-brand-700">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-800 mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tours from this destination */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-medium text-slate-800">
                  Tours to {dest.name}
                </h2>
                <button
                  onClick={() => navigate(`/tours?destination=${dest.searchKey}`)}
                  className="flex items-center gap-1 text-sm text-brand-700 hover:text-brand-800 font-medium transition-colors"
                >
                  View all
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {isLoadingTours ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TourCardSkeleton />
                  <TourCardSkeleton />
                </div>
              ) : tours.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tours.map((tour) => (
                    <TourCard key={tour._id} tour={tour} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400 mb-3">
                    No tours available for this destination yet
                  </p>
                  <button
                    onClick={() => navigate('/tours')}
                    className="text-sm text-brand-700 hover:underline"
                  >
                    Browse all tours
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-72 flex-shrink-0 space-y-5">

            {/* Best time to visit */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-brand-700" />
                <h3 className="text-sm font-medium text-slate-800">
                  Best time to visit
                </h3>
              </div>
              <p className="text-sm font-medium text-brand-700 mb-2">
                {dest.bestTime}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {dest.bestTimeDetail}
              </p>
            </div>

            {/* Visa info */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Plane className="w-4 h-4 text-brand-700" />
                <h3 className="text-sm font-medium text-slate-800">
                  Visa information
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {dest.visaInfo}
              </p>
            </div>

            {/* Quick facts */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-sm font-medium text-slate-800 mb-3">
                Quick facts
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Capital', value: dest.capital },
                  { label: 'Currency', value: dest.currency },
                  { label: 'Language', value: dest.language },
                ].map((fact) => (
                  <div key={fact.label} className="flex justify-between gap-2">
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {fact.label}
                    </span>
                    <span className="text-xs text-slate-700 text-right">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-brand-700 rounded-2xl p-5 text-center">
              <p className="text-white font-medium text-sm mb-1">
                Ready to explore {dest.name}?
              </p>
              <p className="text-white/60 text-xs mb-4">
                Browse our curated tour packages
              </p>
              <button
                onClick={() => navigate(`/tours?destination=${dest.searchKey}`)}
                className="w-full bg-white text-brand-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                View tours
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationDetailPage