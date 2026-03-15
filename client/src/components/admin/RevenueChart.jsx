import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

const data = [
  { month: 'Jan', revenue: 12 },
  { month: 'Feb', revenue: 15 },
  { month: 'Mar', revenue: 18 },
  { month: 'Apr', revenue: 14 },
  { month: 'May', revenue: 21 },
  { month: 'Jun', revenue: 25 },
  { month: 'Jul', revenue: 22 },
  { month: 'Aug', revenue: 28 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800">
          ₹{payload[0].value}L
        </p>
      </div>
    )
  }
  return null
}

const RevenueChart = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-medium text-slate-800">
            Monthly revenue
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            In lakhs (₹)
          </p>
        </div>
        <span className="text-xs bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-lg">
          +18% this month
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          barSize={28}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar
            dataKey="revenue"
            fill="#1A3050"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart