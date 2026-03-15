import { useState, useEffect } from 'react'
import { Loader2, TrendingUp, Users, Target, DollarSign } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart,
  Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { getReports } from '../../api/analyticsApi'
import toast from 'react-hot-toast'

const CATEGORY_LABELS = {
  europe: 'Europe',
  asia: 'Asia',
  middleeast: 'Middle East',
  honeymoon: 'Honeymoon',
  adventure: 'Adventure',
  budget: 'Budget',
}

const STATUS_COLORS = {
  paid: '#10B981',
  pending: '#F59E0B',
  failed: '#EF4444',
  refunded: '#94A3B8',
}

const FUNNEL_COLORS = {
  new: '#94A3B8',
  contacted: '#60A5FA',
  interested: '#FBBF24',
  booked: '#10B981',
  lost: '#EF4444',
}

const PIE_COLORS = [
  '#1A3050', '#2563EB', '#10B981',
  '#F59E0B', '#8B5CF6', '#EF4444',
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs font-medium" style={{ color: p.color }}>
            {p.name}: {p.name === 'revenue' ? `₹${p.value}L` : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const ReportsPage = () => {
  const [reports, setReports] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('revenue')

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true)
        const data = await getReports()
        setReports(data)
      } catch (error) {
        toast.error('Failed to load reports')
      } finally {
        setIsLoading(false)
      }
    }
    fetchReports()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading reports...</span>
        </div>
      </div>
    )
  }

  if (!reports) return null

  const {
    revenueByCategory,
    bookingsChartData,
    paymentBreakdown,
    topTours,
    leadsBySource,
    leadsFunnel,
    agentPerformance,
  } = reports


  const paymentPieData = paymentBreakdown.map((p) => ({
    name: p._id,
    value: p.count,
    amount: p.amount,
  }))

  const categoryData = revenueByCategory.map((c) => ({
    name: CATEGORY_LABELS[c._id] || c._id,
    revenue: Math.round(c.revenue / 100000 * 10) / 10,
    bookings: c.bookings,
  }))

  const tabs = [
    { key: 'revenue', label: 'Revenue', icon: DollarSign },
    { key: 'bookings', label: 'Bookings', icon: TrendingUp },
    { key: 'leads', label: 'Leads', icon: Target },
    { key: 'agents', label: 'Agents', icon: Users },
  ]

  return (
    <div className="space-y-5">

      {/* Page heading */}
      <div>
        <h1 className="text-xl font-medium text-slate-800">Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Business analytics and performance metrics
        </p>
      </div>

      {/*  Tab navigation */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Revenue tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-5">

          {/* Monthly revenue chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-medium text-slate-800 mb-5">
              Monthly revenue trend (₹ lakhs)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={bookingsChartData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}L`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1A3050"
                  strokeWidth={2}
                  dot={{ fill: '#1A3050', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-sm font-medium text-slate-800 mb-5">
                Revenue by category
              </h3>
              {categoryData.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No revenue data yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={categoryData}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    barSize={24}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${v}L`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="revenue"
                      fill="#1A3050"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Payment breakdown pie */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-sm font-medium text-slate-800 mb-5">
                Payment status breakdown
              </h3>
              {paymentPieData.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No payment data yet
                </p>
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="60%" height={180}>
                    <PieChart>
                      <Pie
                        data={paymentPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {paymentPieData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={STATUS_COLORS[entry.name] || PIE_COLORS[index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [value, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {paymentPieData.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: STATUS_COLORS[entry.name] }}
                          />
                          <span className="text-xs text-slate-600 capitalize">
                            {entry.name}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-700">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bookings tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-5">

          {/* Bookings by month */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-medium text-slate-800 mb-5">
              Bookings per month
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={bookingsChartData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                barSize={28}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="bookings"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top tours */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-medium text-slate-800 mb-4">
              Top tours by bookings
            </h3>
            {topTours.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                No booking data yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs text-slate-400 font-medium pb-2">Tour</th>
                      <th className="text-left text-xs text-slate-400 font-medium pb-2">Bookings</th>
                      <th className="text-left text-xs text-slate-400 font-medium pb-2">Revenue</th>
                      <th className="text-left text-xs text-slate-400 font-medium pb-2">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {topTours.map((tour, index) => {
                      const maxBookings = topTours[0].bookings
                      return (
                        <tr key={tour._id}>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 w-4">
                                {index + 1}
                              </span>
                              <span className="text-xs font-medium text-slate-700 truncate max-w-40">
                                {tour.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="text-xs font-medium text-slate-700">
                              {tour.bookings}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-xs text-slate-600">
                              ₹{tour.revenue?.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="py-3 w-32">
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-700 rounded-full"
                                style={{
                                  width: `${(tour.bookings / maxBookings) * 100}%`,
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/*Leads tab */}
      {activeTab === 'leads' && (
        <div className="space-y-5">

          {/* Conversion funnel */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-medium text-slate-800 mb-5">
              Lead conversion funnel
            </h3>
            <div className="space-y-3">
              {leadsFunnel.map((stage) => {
                const total = leadsFunnel.reduce((s, l) => s + l.count, 0)
                const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0
                return (
                  <div key={stage.status} className="flex items-center gap-4">
                    <div className="w-20 text-xs text-slate-600 capitalize text-right flex-shrink-0">
                      {stage.status}
                    </div>
                    <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full rounded-lg transition-all flex items-center px-3"
                        style={{
                          width: `${pct}%`,
                          background: FUNNEL_COLORS[stage.status],
                          minWidth: stage.count > 0 ? '40px' : '0px',
                        }}
                      >
                        {stage.count > 0 && (
                          <span className="text-white text-xs font-medium">
                            {stage.count}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-10 text-xs text-slate-500 text-right flex-shrink-0">
                      {pct}%
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Leads by source */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-sm font-medium text-slate-800 mb-5">
                Leads by source
              </h3>
              {leadsBySource.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No leads data yet
                </p>
              ) : (
                <div className="space-y-3">
                  {leadsBySource.map((source, index) => {
                    const max = leadsBySource[0].count
                    return (
                      <div key={source._id} className="flex items-center gap-3">
                        <span className="text-xs text-slate-600 w-24 flex-shrink-0">
                          {source._id}
                        </span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(source.count / max) * 100}%`,
                              background: PIE_COLORS[index % PIE_COLORS.length],
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-500 w-6 text-right">
                          {source.count}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Leads pie chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-sm font-medium text-slate-800 mb-5">
                Source distribution
              </h3>
              {leadsBySource.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No data yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={leadsBySource.map((s) => ({
                        name: s._id,
                        value: s.count,
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {leadsBySource.map((_, index) => (
                        <Cell
                          key={index}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agents tab */}
      {activeTab === 'agents' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-medium text-slate-800 mb-4">
              Agent performance
            </h3>
            {agentPerformance.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                No agent data yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs text-slate-400 font-medium pb-2">Agent</th>
                      <th className="text-left text-xs text-slate-400 font-medium pb-2">Total leads</th>
                      <th className="text-left text-xs text-slate-400 font-medium pb-2">Booked</th>
                      <th className="text-left text-xs text-slate-400 font-medium pb-2">Lost</th>
                      <th className="text-left text-xs text-slate-400 font-medium pb-2">Conversion</th>
                      <th className="text-left text-xs text-slate-400 font-medium pb-2">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {agentPerformance.map((agent) => (
                      <tr key={agent._id}>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-brand-50 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-brand-700">
                                {agent.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-slate-700">
                              {agent.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-xs text-slate-600">
                            {agent.total}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-xs font-medium text-green-600">
                            {agent.booked}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-xs font-medium text-red-500">
                            {agent.lost}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                            agent.conversionRate >= 50
                              ? 'bg-green-50 text-green-700'
                              : agent.conversionRate >= 25
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {agent.conversionRate}%
                          </span>
                        </td>
                        <td className="py-3 w-32">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                agent.conversionRate >= 50
                                  ? 'bg-green-500'
                                  : agent.conversionRate >= 25
                                  ? 'bg-amber-400'
                                  : 'bg-red-400'
                              }`}
                              style={{ width: `${agent.conversionRate}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Agent leads chart */}
          {agentPerformance.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-sm font-medium text-slate-800 mb-5">
                Leads distribution by agent
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={agentPerformance}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  barSize={32}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="booked"
                    name="booked"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="lost"
                    name="lost"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ReportsPage