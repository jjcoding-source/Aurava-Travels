import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import KpiCard from '../../components/admin/KpiCard'
import RevenueChart from '../../components/admin/RevenueChart'
import TopDestinationsChart from '../../components/admin/TopDestinationsChart'
import { getDashboardAnalytics } from '../../api/analyticsApi'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  paid: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-600',
  refunded: 'bg-slate-100 text-slate-600',
}

const LEAD_STATUS_STYLES = {
  new: 'bg-slate-100 text-slate-600',
  contacted: 'bg-blue-50 text-blue-700',
  interested: 'bg-indigo-50 text-indigo-700',
  booked: 'bg-green-50 text-green-700',
  lost: 'bg-red-50 text-red-600',
}

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        const data = await getDashboardAnalytics()
        setAnalytics(data)
      } catch (error) {
        toast.error('Failed to load analytics')
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  const { stats, chartData, topDestinations, recentBookings, recentLeads } = analytics

  const formatRevenue = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${amount.toLocaleString('en-IN')}`
  }

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div>
        <h1 className="text-xl font-medium text-slate-800">
          Analytics overview
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Welcome back — here is what is happening today
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total revenue"
          value={formatRevenue(stats.totalRevenue)}
          delta="Paid bookings only"
          deltaType="up"
        />
        <KpiCard
          label="Total bookings"
          value={stats.totalBookings}
          delta={`${stats.paidBookings} paid`}
          deltaType="up"
        />
        <KpiCard
          label="Lead conversion"
          value={`${stats.conversionRate}%`}
          delta={`${stats.bookedLeads} booked`}
          deltaType="up"
        />
        <KpiCard
          label="Active leads"
          value={stats.activeLeads}
          delta={`${stats.totalLeads} total leads`}
          deltaType={stats.activeLeads > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart
            data={chartData}
            trend="+18% this month"
          />
        </div>
        <div>
          <TopDestinationsChart destinations={topDestinations} />
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-800">
              Recent bookings
            </h3>
            <span className="text-xs text-slate-400">
              {stats.totalBookings} total
            </span>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No bookings yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs text-slate-400 font-medium pb-2">Customer</th>
                    <th className="text-left text-xs text-slate-400 font-medium pb-2">Tour</th>
                    <th className="text-left text-xs text-slate-400 font-medium pb-2">Amount</th>
                    <th className="text-left text-xs text-slate-400 font-medium pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="py-2.5">
                        <p className="text-xs font-medium text-slate-700">
                          {b.user?.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(b.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </td>
                      <td className="py-2.5">
                        <p className="text-xs text-slate-600 max-w-24 truncate">
                          {b.tour?.title}
                        </p>
                      </td>
                      <td className="py-2.5">
                        <p className="text-xs font-medium text-slate-700">
                          ₹{b.totalAmount?.toLocaleString('en-IN')}
                        </p>
                      </td>
                      <td className="py-2.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-lg capitalize ${STATUS_STYLES[b.paymentStatus]}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent leads */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-800">
              Lead pipeline
            </h3>
            <span className="text-xs text-slate-400">
              {stats.totalLeads} total
            </span>
          </div>

          {recentLeads.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No leads yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs text-slate-400 font-medium pb-2">Name</th>
                    <th className="text-left text-xs text-slate-400 font-medium pb-2">Destination</th>
                    <th className="text-left text-xs text-slate-400 font-medium pb-2">Agent</th>
                    <th className="text-left text-xs text-slate-400 font-medium pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td className="py-2.5">
                        <p className="text-xs font-medium text-slate-700">
                          {lead.name}
                        </p>
                        <p className="text-xs text-slate-400">{lead.month}</p>
                      </td>
                      <td className="py-2.5">
                        <p className="text-xs text-slate-600">
                          {lead.destination}
                        </p>
                      </td>
                      <td className="py-2.5">
                        <p className="text-xs text-slate-600">
                          {lead.assignedAgent?.name || 'Unassigned'}
                        </p>
                      </td>
                      <td className="py-2.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-lg capitalize ${LEAD_STATUS_STYLES[lead.status]}`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <p className="text-xs text-slate-500 mb-1">Total customers</p>
          <p className="text-xl font-medium text-slate-800">
            {stats.totalCustomers}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <p className="text-xs text-slate-500 mb-1">Paid bookings</p>
          <p className="text-xl font-medium text-slate-800">
            {stats.paidBookings}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <p className="text-xs text-slate-500 mb-1">Leads booked</p>
          <p className="text-xl font-medium text-slate-800">
            {stats.bookedLeads}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <p className="text-xs text-slate-500 mb-1">Active leads</p>
          <p className="text-xl font-medium text-slate-800">
            {stats.activeLeads}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
