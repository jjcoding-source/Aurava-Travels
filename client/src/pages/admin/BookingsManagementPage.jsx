import { useState, useEffect } from 'react'
import {
  Search, Loader2, ChevronLeft,
  ChevronRight, CheckCircle, X,
  Calendar, Users, MapPin,
} from 'lucide-react'
import { getAllBookingsAdmin, markBookingAsPaid, cancelBooking } from '../../api/bookingApi'
import toast from 'react-hot-toast'

const PAYMENT_STATUS_STYLES = {
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

const BOOKINGS_PER_PAGE = 8

const BookingsManagementPage = () => {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState({
    total: 0, paid: 0, pending: 0, failed: 0,
  })
  const [processingId, setProcessingId] = useState(null)

  //  Fetch bookings 
  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const params = {
        page: currentPage,
        limit: BOOKINGS_PER_PAGE,
      }
      if (statusFilter) params.status = statusFilter

      const data = await getAllBookingsAdmin(params)
      setBookings(data.bookings)
      setTotal(data.total)
      setTotalPages(data.pages)
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }

  //  Fetch stats 
  const fetchStats = async () => {
    try {
      const [all, paid, pending, failed] = await Promise.all([
        getAllBookingsAdmin({ limit: 1 }),
        getAllBookingsAdmin({ limit: 1, status: 'paid' }),
        getAllBookingsAdmin({ limit: 1, status: 'pending' }),
        getAllBookingsAdmin({ limit: 1, status: 'failed' }),
      ])
      setStats({
        total: all.total,
        paid: paid.total,
        pending: pending.total,
        failed: failed.total,
      })
    } catch (error) {
      console.error('Failed to load stats')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [currentPage, statusFilter])

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter])


  const filteredBookings = bookings.filter((b) => {
    if (!search) return true
    return (
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.tour?.title?.toLowerCase().includes(search.toLowerCase())
    )
  })

  // Mark as paid 
  const handleMarkPaid = async (bookingId) => {
    setProcessingId(bookingId)
    try {
      await markBookingAsPaid(bookingId)
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, paymentStatus: 'paid' }
            : b
        )
      )
      setStats((prev) => ({
        ...prev,
        paid: prev.paid + 1,
        pending: prev.pending - 1,
      }))
      toast.success('Booking marked as paid')
    } catch (error) {
      toast.error('Failed to update payment status')
    } finally {
      setProcessingId(null)
    }
  }

  // Cancel booking 
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return
    setProcessingId(bookingId)
    try {
      await cancelBooking(bookingId)
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, bookingStatus: 'cancelled' }
            : b
        )
      )
      toast.success('Booking cancelled')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-5">

      {/* ── Page heading ── */}
      <div>
        <h1 className="text-xl font-medium text-slate-800">Bookings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage all customer bookings
        </p>
      </div>

      {/* ── Stats bar ──*/}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total bookings', value: stats.total, color: 'text-slate-800' },
          { label: 'Paid', value: stats.paid, color: 'text-green-600' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
          { label: 'Failed', value: stats.failed, color: 'text-red-500' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-slate-100 p-4"
          >
            <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-medium ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer or tour..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-700 bg-white"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'All', value: '' },
            { label: 'Paid', value: 'paid' },
            { label: 'Pending', value: 'pending' },
            { label: 'Failed', value: 'failed' },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setStatusFilter(pill.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === pill.value
                  ? 'bg-brand-700 text-white border-brand-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand-700'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bookings table ─*/}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading bookings...</span>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-slate-400">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Tour
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Departure
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Seats
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Amount
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Payment
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50 transition-colors">

                    {/* Customer */}
                    <td className="px-5 py-3">
                      <p className="text-xs font-medium text-slate-800">
                        {booking.user?.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {booking.user?.email}
                      </p>
                    </td>

                    {/* Tour */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-slate-700 max-w-32 truncate">
                        {booking.tour?.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-28">
                          {booking.tour?.countries?.[0]}
                        </span>
                      </div>
                    </td>

                    {/* Departure */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{booking.departureDate}</span>
                      </div>
                    </td>

                    {/* Seats */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{booking.seatsBooked}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-slate-800">
                        ₹{booking.totalAmount?.toLocaleString('en-IN')}
                      </p>
                    </td>

                    {/* Payment status */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${
                        PAYMENT_STATUS_STYLES[booking.paymentStatus]
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>

                    {/* Booking status */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${
                        BOOKING_STATUS_STYLES[booking.bookingStatus]
                      }`}>
                        {booking.bookingStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {booking.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handleMarkPaid(booking._id)}
                            disabled={processingId === booking._id}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            {processingId === booking._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            Mark paid
                          </button>
                        )}
                        {booking.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            disabled={processingId === booking._id}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Showing {((currentPage - 1) * BOOKINGS_PER_PAGE) + 1} to{' '}
              {Math.min(currentPage * BOOKINGS_PER_PAGE, total)} of {total} bookings
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
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
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingsManagementPage