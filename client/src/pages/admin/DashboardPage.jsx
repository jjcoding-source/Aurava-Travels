import KpiCard from '../../components/admin/KpiCard'
import RevenueChart from '../../components/admin/RevenueChart'
import TopDestinationsChart from '../../components/admin/TopDestinationsChart'

const RECENT_BOOKINGS = [
  { id: 'B001', customer: 'Rahul Sharma', tour: 'Europe Grand Tour', amount: 500000, status: 'paid', date: '12 Jun 2025' },
  { id: 'B002', customer: 'Sneha Iyer', tour: 'Bali Bliss Escape', amount: 170000, status: 'paid', date: '11 Jun 2025' },
  { id: 'B003', customer: 'Amit Verma', tour: 'Swiss Alps Adventure', amount: 380000, status: 'pending', date: '10 Jun 2025' },
  { id: 'B004', customer: 'Pooja Nair', tour: 'Japan Cherry Blossom', amount: 220000, status: 'pending', date: '09 Jun 2025' },
  { id: 'B005', customer: 'Karan Mehta', tour: 'Dubai Luxury Getaway', amount: 110000, status: 'failed', date: '08 Jun 2025' },
]

const RECENT_LEADS = [
  { name: 'Ankit Sharma', destination: 'Europe', agent: 'Priya', status: 'interested', month: 'Sep 2025' },
  { name: 'Divya Menon', destination: 'Japan', agent: 'Ravi', status: 'contacted', month: 'Mar 2026' },
  { name: 'Saurabh Jain', destination: 'Maldives', agent: 'Priya', status: 'booked', month: 'Jul 2025' },
  { name: 'Nisha Gupta', destination: 'Dubai', agent: 'Ravi', status: 'new', month: 'Sep 2025' },
  { name: 'Rohan Das', destination: 'Switzerland', agent: 'Priya', status: 'interested', month: 'Aug 2025' },
]

const STATUS_STYLES = {
  paid: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-600',
}

const LEAD_STATUS_STYLES = {
  new: 'bg-slate-100 text-slate-600',
  contacted: 'bg-blue-50 text-blue-700',
  interested: 'bg-indigo-50 text-indigo-700',
  booked: 'bg-green-50 text-green-700',
  lost: 'bg-red-50 text-red-600',
}

const DashboardPage = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-xl font-medium text-slate-800">
          Analytics overview
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Welcome back — here is what is happening today
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total revenue"
          value="₹25.4L"
          delta="18% vs last month"
          deltaType="up"
        />
        <KpiCard
          label="Bookings"
          value="142"
          delta="12 new this week"
          deltaType="up"
        />
        <KpiCard
          label="Lead conversion"
          value="34%"
          delta="4% improvement"
          deltaType="up"
        />
        <KpiCard
          label="Active leads"
          value="87"
          delta="3 lost this week"
          deltaType="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <TopDestinationsChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-800">
              Recent bookings
            </h3>
            <button className="text-xs text-brand-700 hover:underline">
              View all
            </button>
          </div>
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
                {RECENT_BOOKINGS.map((b) => (
                  <tr key={b.id}>
                    <td className="py-2.5">
                      <p className="text-xs font-medium text-slate-700">{b.customer}</p>
                      <p className="text-xs text-slate-400">{b.date}</p>
                    </td>
                    <td className="py-2.5">
                      <p className="text-xs text-slate-600 max-w-24 truncate">{b.tour}</p>
                    </td>
                    <td className="py-2.5">
                      <p className="text-xs font-medium text-slate-700">
                        ₹{b.amount.toLocaleString('en-IN')}
                      </p>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-lg capitalize ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-800">
              Lead pipeline
            </h3>
            <button className="text-xs text-brand-700 hover:underline">
              View all
            </button>
          </div>
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
                {RECENT_LEADS.map((lead) => (
                  <tr key={lead.name}>
                    <td className="py-2.5">
                      <p className="text-xs font-medium text-slate-700">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.month}</p>
                    </td>
                    <td className="py-2.5">
                      <p className="text-xs text-slate-600">{lead.destination}</p>
                    </td>
                    <td className="py-2.5">
                      <p className="text-xs text-slate-600">{lead.agent}</p>
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
        </div>
      </div>
    </div>
  )
}

export default DashboardPage