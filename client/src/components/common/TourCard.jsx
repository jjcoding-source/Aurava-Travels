import { Link } from 'react-router-dom'
import { Clock, MapPin, Star, Users } from 'lucide-react'

const TourCard = ({ tour }) => {
  const {
    _id,
    title,
    countries,
    duration,
    price,
    seatsAvailable,
    rating,
    reviewCount,
    image,
    badge,
  } = tour

  return (
    <Link
      to={`/tours/${_id}`}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image area */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="w-full h-full bg-gradient-to-br from-brand-700 to-brand-800 group-hover:scale-105 transition-transform duration-500"
          style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        />

        {/* Duration tag */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg">
            {duration} Days
          </span>
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-slate-800 mb-1 group-hover:text-brand-700 transition-colors">
          {title}
        </h3>

        {/* Countries */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-500 truncate">
            {Array.isArray(countries) ? countries.join(' · ') : countries}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration}D</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{seatsAvailable} seats left</span>
          </div>
        </div>

        {/* Price and rating */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-base font-medium text-slate-800">
              ₹{price?.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 ml-1">/ person</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-slate-700">{rating}</span>
            <span className="text-xs text-slate-400">({reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TourCard