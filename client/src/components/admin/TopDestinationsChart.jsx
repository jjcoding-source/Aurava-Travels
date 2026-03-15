const TopDestinationsChart = ({ destinations = [] }) => {
  const max = destinations.length > 0
    ? Math.max(...destinations.map((d) => d.bookings))
    : 1

  const colors = [
    'bg-brand-700', 'bg-brand-600',
    'bg-blue-400', 'bg-blue-300',
    'bg-blue-200', 'bg-slate-200',
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <h3 className="text-sm font-medium text-slate-800 mb-5">
        Top destinations
      </h3>
      {destinations.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-8">
          No booking data yet
        </p>
      ) : (
        <div className="space-y-3">
          {destinations.map((dest, index) => (
            <div key={dest.name} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 w-20 flex-shrink-0 truncate">
                {dest.name}
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors[index] || 'bg-slate-300'} transition-all`}
                  style={{ width: `${(dest.bookings / max) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-500 w-8 text-right flex-shrink-0">
                {dest.bookings}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopDestinationsChart