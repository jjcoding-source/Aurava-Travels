const destinations = [
  { name: 'Switzerland', bookings: 120, color: 'bg-brand-700' },
  { name: 'France', bookings: 95, color: 'bg-brand-600' },
  { name: 'Italy', bookings: 80, color: 'bg-blue-400' },
  { name: 'Japan', bookings: 65, color: 'bg-blue-300' },
  { name: 'Maldives', bookings: 52, color: 'bg-blue-200' },
  { name: 'Dubai', bookings: 42, color: 'bg-slate-200' },
]

const max = Math.max(...destinations.map((d) => d.bookings))

const TopDestinationsChart = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <h3 className="text-sm font-medium text-slate-800 mb-5">
        Top destinations
      </h3>
      <div className="space-y-3">
        {destinations.map((dest) => (
          <div key={dest.name} className="flex items-center gap-3">
            <span className="text-xs text-slate-600 w-20 flex-shrink-0">
              {dest.name}
            </span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${dest.color} transition-all`}
                style={{ width: `${(dest.bookings / max) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-500 w-8 text-right flex-shrink-0">
              {dest.bookings}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopDestinationsChart