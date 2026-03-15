import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  MapPin, Clock, Users, Star, ChevronRight,
  Check, X, Calendar, Minus, Plus, Shield,
  Plane, Hotel, Utensils, Bus, Loader2,
} from 'lucide-react'
import { getTourById } from '../api/tourApi'
import toast from 'react-hot-toast'

const TourDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [tour, setTour] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [guests, setGuests] = useState(2)
  const [expandedDay, setExpandedDay] = useState(1)

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setIsLoading(true)
        const data = await getTourById(id)
        setTour(data.tour)
        if (data.tour.departureDates?.length > 0) {
          setSelectedDate(data.tour.departureDates[0].date)
        }
      } catch (error) {
        toast.error('Tour not found')
        navigate('/tours')
      } finally {
        setIsLoading(false)
      }
    }
    fetchTour()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading tour details...</span>
        </div>
      </div>
    )
  }

  if (!tour) return null

  const totalPrice = tour.price * guests
  const selectedDeparture = tour.departureDates?.find(
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
              {tour.highlights?.length > 0 && (
                <>
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
                </>
              )}
            </div>

            {tour.itinerary?.length > 0 && (
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
            )}

            {tour.included?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-medium text-slate-800 mb-5">
                  What's included
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.included.map((item) => (
                    <div key={item.item} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.included ? 'bg-green-50' : 'bg-red-50'
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
            )}

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
                    ({tour.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400 text-center py-6">
                Reviews will appear here after booking.
              </p>
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

              {tour.departureDates?.length > 0 && (
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
                          dep.seatsLeft <= 10 ? 'text-red-500' : 'text-slate-400'
                        }`}>
                          {dep.seatsLeft} seats
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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