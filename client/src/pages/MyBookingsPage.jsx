import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, Calendar, Users, Loader2,
  ChevronRight, PackageOpen,
} from 'lucide-react'
import { getMyBookings, cancelBooking } from '../api/bookingApi'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  paid: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-600',
  refunded: 'bg-slate-100 text-slate-600',
}

const BOOKING_STATUS_STYLES = {
  confirmed: 'bg-blue-50 text-blue-700',
  cancelled: 'bg-red-50 text-red-600',
  completed: 'bg-green-50 text-green-700',
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings()
        setBookings(data.bookings)
      } catch (error) {
        toast.error('Failed to load bookings')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    setCancellingId(bookingId)
    try {
      await cancelBooking(bookingId)
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b
        )
      )
      toast.success('Booking cancelled successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading your bookings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-medium text-slate-800 mb-1">
            My bookings
          </h1>
          <p className="text-sm text-slate-500">
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              No bookings yet
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              You have not booked any tours yet.
            </p>
            <Link
              to="/tours"
              className="inline-flex items-center gap-1 bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors"
            >
              Browse tours
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-slate-100 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                  <div className="w-full sm:w-32 h-20 bg-brand-800 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <span className="text-white/60 text-xs text-center px-2">
                      {booking.tour?.countries?.[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-medium text-slate-800">
                        {booking.tour?.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${STATUS_STYLES[booking.paymentStatus]}`}>
                          {booking.paymentStatus}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${BOOKING_STATUS_STYLES[booking.bookingStatus]}`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{booking.tour?.countries?.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{booking.departureDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{booking.seatsBooked} traveller{booking.seatsBooked > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-slate-800">
                        ₹{booking.totalAmount?.toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center gap-2">
                        {booking.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="text-xs text-red-500 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                        <Link
                          to={`/tours/${booking.tour?._id}`}
                          className="text-xs text-brand-700 hover:text-brand-800 border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                        >
                          View tour
                        </Link>
                      </div>
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

export default MyBookingsPage