import { Link } from 'react-router-dom'
import { Plane, MapPin, Phone, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'All Tours', path: '/tours' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  const popularDestinations = [
    { label: 'Europe Tours', path: '/tours?destination=europe' },
    { label: 'Bali, Indonesia', path: '/tours?destination=bali' },
    { label: 'Switzerland', path: '/tours?destination=switzerland' },
    { label: 'Japan', path: '/tours?destination=japan' },
    { label: 'Dubai, UAE', path: '/tours?destination=dubai' },
    { label: 'Maldives', path: '/tours?destination=maldives' },
  ]

  return (
    <footer className="bg-brand-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-lg font-medium text-white">
                Aurava Travels
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Premium tour packages crafted for unforgettable experiences.
              Trusted by 12,000+ happy travellers across India.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Instagram</span>
              <span>·</span>
              <span>Facebook</span>
              <span>·</span>
              <span>Twitter</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular destinations */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">
              Popular Destinations
            </h3>
            <ul className="space-y-2">
              {popularDestinations.map((dest) => (
                <li key={dest.path}>
                  <Link
                    to={dest.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {dest.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-400">
                  42, Travel Street, Kochi,
                  Kerala 682001, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-400">
                  +91 98765 43210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-400">
                  hello@aurava.in
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {currentYear} Aurava Travels. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer