import { TrendingUp, TrendingDown } from 'lucide-react'

const KpiCard = ({ label, value, delta, deltaType = 'up', subtitle }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">
        {label}
      </p>
      <p className="text-2xl font-medium text-slate-800 mb-1">{value}</p>
      {delta && (
        <div className={`flex items-center gap-1 text-xs font-medium ${
          deltaType === 'up' ? 'text-green-600' : 'text-red-500'
        }`}>
          {deltaType === 'up'
            ? <TrendingUp className="w-3.5 h-3.5" />
            : <TrendingDown className="w-3.5 h-3.5" />
          }
          {delta}
        </div>
      )}
      {subtitle && (
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      )}
    </div>
  )
}

export default KpiCard