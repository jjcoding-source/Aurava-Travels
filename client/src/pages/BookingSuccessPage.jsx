import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CheckCircle, MapPin, Calendar, Users, Loader2, Download } from 'lucide-react'
import { getBookingById } from '../api/bookingApi'
import toast from 'react-hot-toast'

const BookingSuccessPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(id)
        setBooking(data.booking)
      } catch (error) {
        toast.error('Booking not found')
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBooking()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-medium text-slate-800 mb-2">
            Booking confirmed!
          </h1>
          <p className="text-sm text-slate-500">
            Your trip is booked. Check your email for details.
          </p>
        </div>

        {/* Booking details card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-500">Booking ID</p>
            <p className="text-xs font-mono font-medium text-slate-700">
              #{booking._id?.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="bg-brand-800 rounded-xl p-4 mb-4">
            <p className="text-white font-medium text-sm mb-1">
              {booking.tour?.title}
            </p>
            <div className="flex items-center gap-1 text-white/60 text-xs">
              <MapPin className="w-3 h-3" />
              <span>{booking.tour?.countries?.join(', ')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Departure</span>
              </div>
              <span className="text-sm font-medium text-slate-800">
                {booking.departureDate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users className="w-4 h-4" />
                <span>Travellers</span>
              </div>
              <span className="text-sm font-medium text-slate-800">
                {booking.seatsBooked} person{booking.seatsBooked > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-sm font-medium text-slate-700">
                Total paid
              </span>
              <span className="text-lg font-medium text-slate-800">
                ₹{booking.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
              booking.paymentStatus === 'paid'
                ? 'bg-green-50 text-green-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              Payment: {booking.paymentStatus}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/my-bookings"
            className="block w-full bg-brand-700 hover:bg-brand-800 text-white py-3 rounded-xl text-sm font-medium text-center transition-colors"
          >
            View my bookings
          </Link>
          <Link
            to="/"
            className="block w-full border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium text-center hover:bg-slate-50 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookingSuccessPage