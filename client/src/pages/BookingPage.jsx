import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  MapPin, Calendar, Users, Shield,
  Loader2, ChevronRight, Check,
  Plane, Hotel, Utensils, Bus,
} from 'lucide-react'
import { getTourById } from '../api/tourApi'
import { createBooking } from '../api/bookingApi'
import toast from 'react-hot-toast'

const BookingPage = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)

  const dateFromUrl = searchParams.get('date') || ''
  const guestsFromUrl = Number(searchParams.get('guests')) || 2

  const [tour, setTour] = useState(null)
  const [isLoadingTour, setIsLoadingTour] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [selectedDate, setSelectedDate] = useState(dateFromUrl)
  const [guests, setGuests] = useState(guestsFromUrl)
  const [step, setStep] = useState(1)
  const [travellers, setTravellers] = useState(
    Array(guestsFromUrl).fill({ name: '', age: '' })
  )

  useEffect(() => {
    if (!token) {
      toast.error('Please log in to book a tour')
      navigate('/login')
    }
  }, [token])

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setIsLoadingTour(true)
        const data = await getTourById(id)
        setTour(data.tour)
        if (!selectedDate && data.tour.departureDates?.length > 0) {
          setSelectedDate(data.tour.departureDates[0].date)
        }
      } catch (error) {
        toast.error('Tour not found')
        navigate('/tours')
      } finally {
        setIsLoadingTour(false)
      }
    }
    fetchTour()
  }, [id])

  useEffect(() => {
    setTravellers(Array(guests).fill(null).map((_, i) => ({
      name: travellers[i]?.name || '',
      age: travellers[i]?.age || '',
    })))
  }, [guests])

  const totalAmount = (tour?.price || 0) * guests

  const handleTravellerChange = (index, field, value) => {
    setTravellers((prev) => prev.map((t, i) =>
      i === index ? { ...t, [field]: value } : t
    ))
  }

  const handleConfirmBooking = async () => {
    if (!selectedDate) {
      toast.error('Please select a departure date')
      return
    }

    setIsBooking(true)
    try {
      const data = await createBooking({
        tourId: id,
        departureDate: selectedDate,
        seatsBooked: guests,
        travellers: travellers.filter((t) => t.name),
      })

      toast.success('Booking confirmed!')
      navigate(`/booking-success/${data.booking._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed')
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoadingTour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading booking details...</span>
        </div>
      </div>
    )
  }

  if (!tour) return null

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/tours" className="hover:text-brand-700">Tours</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/tours/${id}`} className="hover:text-brand-700 truncate max-w-32">
              {tour.title}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 font-medium">Book</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center gap-3 mb-8">
          {[
            { num: 1, label: 'Trip details' },
            { num: 2, label: 'Traveller info' },
            { num: 3, label: 'Confirm' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  step > s.num
                    ? 'bg-green-500 text-white'
                    : step === s.num
                    ? 'bg-brand-700 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${
                  step === s.num ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`h-px w-8 sm:w-16 ${
                  step > s.num ? 'bg-green-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          <div className="flex-1 min-w-0">

            {step === 1 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <h2 className="text-lg font-medium text-slate-800">
                  Trip details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select departure date
                  </label>
                  <div className="space-y-2">
                    {tour.departureDates?.map((dep) => (
                      <button
                        key={dep.date}
                        onClick={() => setSelectedDate(dep.date)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-colors ${
                          selectedDate === dep.date
                            ? 'border-brand-700 bg-brand-50 text-brand-700'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 opacity-60" />
                          <span>{dep.date}</span>
                        </div>
                        <span className={`text-xs font-medium ${
                          dep.seatsLeft <= 10 ? 'text-red-500' : 'text-slate-500'
                        }`}>
                          {dep.seatsLeft} seats left
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of travellers
                  </label>
                  <div className="flex items-center gap-4 border border-slate-200 rounded-xl px-4 py-3 w-fit">
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-brand-700 hover:text-brand-700 transition-colors text-lg"
                    >
                      −
                    </button>
                    <span className="text-base font-medium w-6 text-center">
                      {guests}
                    </span>
                    <button
                      onClick={() => setGuests((g) => Math.min(10, g + 1))}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-brand-700 hover:text-brand-700 transition-colors text-lg"
                    >
                      +
                    </button>
                    <span className="text-sm text-slate-500 ml-2">
                      {guests === 1 ? 'person' : 'persons'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedDate}
                  className="w-full bg-brand-700 hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Continue to traveller info
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <h2 className="text-lg font-medium text-slate-800">
                  Traveller information
                </h2>
                <p className="text-sm text-slate-500">
                  Enter details for all {guests} traveller{guests > 1 ? 's' : ''}.
                  Name should match passport.
                </p>

                {travellers.map((traveller, index) => (
                  <div
                    key={index}
                    className="border border-slate-100 rounded-xl p-4 space-y-3"
                  >
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Traveller {index + 1}
                      {index === 0 && ' (Primary)'}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Full name
                        </label>
                        <input
                          type="text"
                          value={traveller.name}
                          onChange={(e) =>
                            handleTravellerChange(index, 'name', e.target.value)
                          }
                          placeholder="As per passport"
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={traveller.age}
                          onChange={(e) =>
                            handleTravellerChange(index, 'age', e.target.value)
                          }
                          placeholder="Age"
                          min="1"
                          max="100"
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-brand-700 hover:bg-brand-800 text-white py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    Review booking
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <h2 className="text-lg font-medium text-slate-800">
                  Review and confirm
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Tour</span>
                    <span className="text-sm font-medium text-slate-800">
                      {tour.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Departure</span>
                    <span className="text-sm font-medium text-slate-800">
                      {selectedDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Travellers</span>
                    <span className="text-sm font-medium text-slate-800">
                      {guests} {guests === 1 ? 'person' : 'persons'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Price per person</span>
                    <span className="text-sm font-medium text-slate-800">
                      ₹{tour.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-slate-700">
                      Total amount
                    </span>
                    <span className="text-lg font-medium text-slate-800">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-600 mb-2">
                    Booking for
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-green-50 rounded-xl p-3">
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700">
                    Free cancellation up to 30 days before departure.
                    Full refund guaranteed.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isBooking}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      'Confirm booking'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24">
              <h3 className="text-sm font-medium text-slate-800 mb-4">
                Booking summary
              </h3>

              <div className="bg-brand-800 rounded-xl p-4 mb-4">
                <p className="text-white font-medium text-sm mb-1">
                  {tour.title}
                </p>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>{tour.countries?.join(', ')}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedDate || 'No date selected'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{guests} traveller{guests > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>₹{tour.price?.toLocaleString('en-IN')} × {guests}</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-800">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                {[
                  { icon: Plane, label: 'Flights included' },
                  { icon: Hotel, label: 'Hotels included' },
                  { icon: Utensils, label: 'Meals included' },
                  { icon: Bus, label: 'Transfers included' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-2 text-xs text-slate-500">
                      <Icon className="w-3.5 h-3.5 text-green-500" />
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
  )
}

export default BookingPage