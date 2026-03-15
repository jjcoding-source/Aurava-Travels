import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  MapPin, Clock, Users, Star, ChevronRight,
  Check, X, Calendar, Minus, Plus, Shield,
  Plane, Hotel, Utensils, Bus,
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock tour data
const MOCK_TOURS = {
  '1': {
    _id: '1',
    title: 'Europe Grand Tour',
    countries: ['France', 'Switzerland', 'Italy'],
    duration: 10,
    price: 250000,
    seatsAvailable: 12,
    totalSeats: 40,
    rating: 4.9,
    reviewCount: 128,
    badge: 'Selling Fast',
    category: 'europe',
    overview: 'Experience the best of Europe on this carefully curated 10-day grand tour covering the most iconic destinations in France, Switzerland and Italy. Travel with a small group, stay in hand-picked 3-star hotels, and enjoy guided visits to the world\'s most celebrated landmarks.',
    highlights: [
      'Guided tour of the Louvre Museum in Paris',
      'Eiffel Tower visit with optional Seine River cruise',
      'Mount Titlis snow experience with rotair cable car',
      'Cliff Walk at Engelberg — 3041m above sea level',
      'Colosseum and Vatican City in Rome',
      'Gondola ride through the canals of Venice',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Paris — City of Lights',
        description: 'Arrive at Charles de Gaulle Airport. Transfer to your 3-star hotel in central Paris. Welcome dinner at a traditional French brasserie. Evening walk along the Seine.',
        activities: ['Airport transfer', 'Hotel check-in', 'Welcome dinner'],
      },
      {
        day: 2,
        title: 'Eiffel Tower & Louvre Museum',
        description: 'Morning guided tour of the Louvre — home to the Mona Lisa. Afternoon visit to the iconic Eiffel Tower with optional Seine River cruise at sunset.',
        activities: ['Louvre Museum', 'Eiffel Tower', 'Seine cruise (optional)'],
      },
      {
        day: 3,
        title: 'Paris → Geneva, Switzerland',
        description: 'Morning at leisure in Paris for shopping. Board the scenic train to Geneva, Switzerland. Check in and explore the Old Town and the famous Jet d\'Eau fountain.',
        activities: ['TGV train to Geneva', 'Old Town walk', 'Jet d\'Eau fountain'],
      },
      {
        day: 4,
        title: 'Mount Titlis Snow Experience',
        description: 'Full-day excursion to Mount Titlis — the world\'s first revolving cable car (Rotair). Enjoy the Snow World, Glacier Cave, and the thrilling Cliff Walk.',
        activities: ['Rotair cable car', 'Snow World', 'Cliff Walk', 'Glacier Cave'],
      },
      {
        day: 5,
        title: 'Zurich City Tour',
        description: 'Explore Zurich\'s famous Bahnhofstrasse shopping street and the medieval Grossmünster cathedral. Evening traditional Swiss fondue dinner.',
        activities: ['Bahnhofstrasse', 'Grossmünster', 'Swiss fondue dinner'],
      },
      {
        day: 6,
        title: 'Geneva → Rome, Italy',
        description: 'Fly from Geneva to Rome. Check in to your hotel near the historic centre. Evening stroll to the Trevi Fountain and Spanish Steps.',
        activities: ['Flight to Rome', 'Trevi Fountain', 'Spanish Steps'],
      },
      {
        day: 7,
        title: 'Vatican City & Colosseum',
        description: 'Morning guided tour of the Vatican Museums and Sistine Chapel. Afternoon at the Roman Colosseum and Roman Forum.',
        activities: ['Vatican Museums', 'Sistine Chapel', 'Colosseum', 'Roman Forum'],
      },
      {
        day: 8,
        title: 'Rome → Venice',
        description: 'Train to Venice — the floating city. Arrive and take the water taxi to your hotel. Evening gondola ride through the historic canals.',
        activities: ['Train to Venice', 'Water taxi', 'Gondola ride'],
      },
      {
        day: 9,
        title: 'Venice Exploration',
        description: 'Full day exploring Venice at your own pace. Visit St. Mark\'s Basilica, Doge\'s Palace, and the famous Rialto Bridge. Optional glass-blowing demo on Murano island.',
        activities: ['St. Mark\'s Basilica', 'Rialto Bridge', 'Murano island (optional)'],
      },
      {
        day: 10,
        title: 'Departure Day',
        description: 'Transfer to Venice Marco Polo Airport for your return flight to India. Tour manager assistance till departure.',
        activities: ['Checkout', 'Airport transfer', 'Departure'],
      },
    ],
    included: [
      { item: 'Return flights from Mumbai', included: true },
      { item: '9 nights in 3-star hotels', included: true },
      { item: 'Daily breakfast and dinner', included: true },
      { item: 'AC coach transfers', included: true },
      { item: 'All sightseeing entries', included: true },
      { item: 'Schengen visa assistance', included: true },
      { item: 'Travel insurance', included: true },
      { item: 'English-speaking tour manager', included: true },
      { item: 'Lunch (except Day 1)', included: false },
      { item: 'Personal expenses', included: false },
      { item: 'Optional activities', included: false },
    ],
    departureDates: [
      { date: '15 June 2025', seatsLeft: 12 },
      { date: '20 July 2025', seatsLeft: 28 },
      { date: '10 August 2025', seatsLeft: 40 },
      { date: '05 September 2025', seatsLeft: 35 },
    ],
    reviews: [
      {
        _id: 'r1',
        name: 'Rahul Sharma',
        location: 'Mumbai',
        rating: 5,
        date: 'January 2025',
        comment: 'Absolutely incredible trip! The guide was knowledgeable and the hotels were very comfortable. Mount Titlis was the absolute highlight. Will definitely book again with Aurava!',
        initials: 'RS',
      },
      {
        _id: 'r2',
        name: 'Priya Kapoor',
        location: 'Delhi',
        rating: 5,
        date: 'March 2025',
        comment: 'Our honeymoon was absolutely perfect. Everything was so well organised — we did not have to worry about a single thing. Highly recommend Aurava Travels to everyone!',
        initials: 'PK',
      },
      {
        _id: 'r3',
        name: 'Ankit Mehta',
        location: 'Bangalore',
        rating: 4,
        date: 'February 2025',
        comment: 'Great trip overall! The itinerary was well-planned. Venice was magical. Only minor issue was that Day 3 felt a bit rushed but the tour manager handled everything smoothly.',
        initials: 'AM',
      },
    ],
  },
}

const DEFAULT_TOUR = MOCK_TOURS['1']


const TourDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const tour = MOCK_TOURS[id] || { ...DEFAULT_TOUR, _id: id }

  const [selectedDate, setSelectedDate] = useState(tour.departureDates[0].date)
  const [guests, setGuests] = useState(2)
  const [expandedDay, setExpandedDay] = useState(1)

  const totalPrice = tour.price * guests

  const selectedDeparture = tour.departureDates.find(
    (d) => d.date === selectedDate
  )
  const seatsFilled = tour.totalSeats - (selectedDeparture?.seatsLeft || 0)
  const seatPercent = Math.round((seatsFilled / tour.totalSeats) * 100)

  const handleBookNow = () => {
    if (!token) {
      toast.error('Please log in to book a tour')
      navigate('/login')
      return
    }
    navigate(`/booking/${tour._id}?date=${selectedDate}&guests=${guests}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-brand-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/tours" className="hover:text-brand-700 transition-colors">
              Tours
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 font-medium truncate">
              {tour.title}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-brand-800 py-10 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1 rounded-full">
              {tour.duration} Days · {tour.duration - 1} Nights
            </span>
            <span className="bg-green-500/20 border border-green-400/30 text-green-300 text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-green-300" />
              {tour.rating} · {tour.reviewCount} reviews
            </span>
            {tour.badge && (
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                {tour.badge}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-medium text-white mb-3">
            {tour.title}
          </h1>

          <div className="flex items-center gap-2 text-white/60 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{tour.countries.join(' · ')}</span>
          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { icon: Clock, label: 'Duration', value: `${tour.duration} Days` },
              { icon: Users, label: 'Group size', value: `Max ${tour.totalSeats}` },
              { icon: Plane, label: 'Flights', value: 'Included' },
              { icon: Hotel, label: 'Hotels', value: '3-star' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-white/40" />
                  <div>
                    <div className="text-xs text-white/40">{stat.label}</div>
                    <div className="text-sm font-medium text-white">{stat.value}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="flex-1 min-w-0 space-y-8">

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-3">
                Tour overview
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {tour.overview}
              </p>
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                Tour highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tour.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-slate-600">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-5">
                Day-by-day itinerary
              </h2>
              <div className="space-y-3">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        setExpandedDay(expandedDay === day.day ? null : day.day)
                      }
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-brand-700">
                            {day.day}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {day.title}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
                          expandedDay === day.day ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {expandedDay === day.day && (
                      <div className="px-4 pb-4 border-t border-slate-100">
                        <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-3">
                          {day.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {day.activities.map((activity) => (
                            <span
                              key={activity}
                              className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-5">
                What's included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.included.map((item) => (
                  <div key={item.item} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.included
                        ? 'bg-green-50'
                        : 'bg-red-50'
                    }`}>
                      {item.included
                        ? <Check className="w-3 h-3 text-green-600" />
                        : <X className="w-3 h-3 text-red-500" />
                      }
                    </div>
                    <span className={`text-sm ${
                      item.included ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-medium text-slate-800">
                  Traveller reviews
                </h2>
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium text-amber-700">
                    {tour.rating}
                  </span>
                  <span className="text-xs text-amber-600">
                    ({tour.reviewCount})
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                {tour.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="pb-5 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-9 h-9 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-brand-700">
                          {review.initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className="text-sm font-medium text-slate-800">
                              {review.name}
                            </span>
                            <span className="text-xs text-slate-400 ml-2">
                              · {review.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200 fill-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed pl-12">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24">

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-medium text-slate-800">
                  ₹{tour.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400">/ person</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                All inclusive — flights, hotels, meals
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Seat availability</span>
                  <span className={`font-medium ${
                    (selectedDeparture?.seatsLeft || 0) <= 10
                      ? 'text-red-500'
                      : 'text-green-600'
                  }`}>
                    {selectedDeparture?.seatsLeft} left
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      seatPercent >= 75
                        ? 'bg-red-500'
                        : seatPercent >= 50
                        ? 'bg-amber-400'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${seatPercent}%` }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Choose departure date
                </label>
                <div className="space-y-2">
                  {tour.departureDates.map((dep) => (
                    <button
                      key={dep.date}
                      onClick={() => setSelectedDate(dep.date)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                        selectedDate === dep.date
                          ? 'border-brand-700 bg-brand-50 text-brand-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 opacity-60" />
                        <span>{dep.date}</span>
                      </div>
                      <span className={`text-xs ${
                        dep.seatsLeft <= 10
                          ? 'text-red-500'
                          : 'text-slate-400'
                      }`}>
                        {dep.seatsLeft} seats
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Number of travellers
                </label>
                <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-2.5">
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      {guests} {guests === 1 ? 'person' : 'persons'}
                    </div>
                    <div className="text-xs text-slate-400">Travellers</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-brand-700 hover:text-brand-700 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">
                      {guests}
                    </span>
                    <button
                      onClick={() =>
                        setGuests((g) =>
                          Math.min(selectedDeparture?.seatsLeft || 10, g + 1)
                        )
                      }
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-brand-700 hover:text-brand-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600">Total amount</span>
                <span className="text-lg font-medium text-slate-800">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3 rounded-xl text-sm font-medium transition-colors"
              >
                Book Now
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-3">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">
                  Secure payment · Free cancellation up to 30 days
                </span>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-600 mb-3">
                  Package includes
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Plane, label: 'Flights' },
                    { icon: Hotel, label: 'Hotels' },
                    { icon: Utensils, label: 'Meals' },
                    { icon: Bus, label: 'Transfers' },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 text-xs text-slate-500"
                      >
                        <Icon className="w-3.5 h-3.5 text-brand-700" />
                        {item.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetailPage