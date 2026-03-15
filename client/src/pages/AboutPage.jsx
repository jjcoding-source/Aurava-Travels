import { useNavigate } from 'react-router-dom'
import {
  Shield, Award, Users, Globe,
  Heart, Star, ChevronRight, Plane,
} from 'lucide-react'

const STATS = [
  { value: '15+', label: 'Years of experience' },
  { value: '12,400+', label: 'Happy travellers' },
  { value: '60+', label: 'Countries covered' },
  { value: '500+', label: 'Tour packages' },
]

const VALUES = [
  {
    icon: Shield,
    title: 'Trust and transparency',
    desc: 'No hidden charges, no surprises. Every rupee you pay goes towards creating the best possible experience for you.',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    icon: Heart,
    title: 'Customer first',
    desc: 'Your satisfaction is our mission. Our dedicated travel managers are available 24/7 throughout your journey.',
    bg: 'bg-red-50',
    color: 'text-red-500',
  },
  {
    icon: Globe,
    title: 'Local expertise',
    desc: 'Our destination experts have personally visited every location we offer — so you get genuine insider knowledge.',
    bg: 'bg-green-50',
    color: 'text-green-600',
  },
  {
    icon: Award,
    title: 'Quality assurance',
    desc: 'Every hotel, transport and activity is personally vetted by our team to meet our high standards.',
    bg: 'bg-amber-50',
    color: 'text-amber-600',
  },
]

const TEAM = [
  {
    name: 'Arjun Menon',
    role: 'Founder & CEO',
    initials: 'AM',
    bio: '15 years in travel industry. Personally visited 45+ countries. Passionate about making world-class travel accessible to Indian families.',
    color: 'bg-brand-50 text-brand-700',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Operations',
    initials: 'PS',
    bio: 'Former airline operations manager. Ensures every booking runs perfectly from planning to homecoming.',
    color: 'bg-green-50 text-green-700',
  },
  {
    name: 'Ravi Kumar',
    role: 'Lead Travel Consultant',
    initials: 'RK',
    bio: 'Europe specialist with 10 years experience. Has designed over 500 custom itineraries for Indian travellers.',
    color: 'bg-purple-50 text-purple-700',
  },
  {
    name: 'Sneha Iyer',
    role: 'Asia Destinations Expert',
    initials: 'SI',
    bio: 'Bali, Japan and Southeast Asia specialist. Fluent in Japanese and deeply knowledgeable about Asian cultures.',
    color: 'bg-amber-50 text-amber-700',
  },
]

const MILESTONES = [
  { year: '2009', event: 'Aurava Travels founded in Kochi, Kerala' },
  { year: '2012', event: 'Reached 1000 happy travellers milestone' },
  { year: '2015', event: 'Expanded to 30+ international destinations' },
  { year: '2018', event: 'Launched online booking platform' },
  { year: '2021', event: 'Crossed 10,000 bookings — despite the pandemic' },
  { year: '2024', event: 'Launched AI-powered trip personalisation' },
]

const AboutPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <div className="bg-brand-800 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Plane className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium text-white mb-4">
            About Aurava Travels
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl mx-auto">
            We are a Kerala-based travel agency with over 15 years of experience
            crafting unforgettable journeys for Indian travellers across the globe.
            Our mission is simple — to make world-class travel accessible,
            affordable and absolutely stress-free.
          </p>
        </div>
      </div>

      {/* Stats  */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-medium text-brand-700 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our story  */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-medium text-slate-800 mb-4">
              Our story
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Aurava Travels was founded in 2009 in Kochi, Kerala by Arjun Menon —
                a passionate traveller who believed that every Indian family deserved
                the chance to explore the world without the stress, confusion and
                hidden costs that were common in the travel industry at the time.
              </p>
              <p>
                What started as a small office with two desks and a big dream has
                grown into one of South India's most trusted travel agencies —
                with over 12,000 happy travellers, 500+ curated tour packages and
                a team of dedicated destination experts.
              </p>
              <p>
                We are proud to be IATA-certified and have partnerships with leading
                airlines, hotel chains and ground operators across 60+ countries.
                Every itinerary we design is the result of years of on-ground
                experience and genuine passion for travel.
              </p>
            </div>
            <button
              onClick={() => navigate('/tours')}
              className="mt-6 flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Explore our tours
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Milestones timeline */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-5 uppercase tracking-wider">
              Our journey
            </h3>
            <div className="space-y-4">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {m.year.slice(2)}
                      </span>
                    </div>
                    {i < MILESTONES.length - 1 && (
                      <div className="w-px h-6 bg-slate-200 mt-1" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <span className="text-xs font-medium text-brand-700">
                      {m.year}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Our values  */}
      <div className="bg-slate-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-slate-800 mb-2">
              What we stand for
            </h2>
            <p className="text-sm text-slate-500">
              The values that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((val) => {
              const Icon = val.icon
              return (
                <div
                  key={val.title}
                  className="bg-white rounded-2xl p-5 border border-slate-100"
                >
                  <div className={`w-10 h-10 ${val.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${val.color}`} />
                  </div>
                  <h3 className="text-sm font-medium text-slate-800 mb-2">
                    {val.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Meet the team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-medium text-slate-800 mb-2">
            Meet our team
          </h2>
          <p className="text-sm text-slate-500">
            The travel experts behind every great trip
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-slate-100 p-5 text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 ${member.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <span className="text-lg font-medium">{member.initials}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-800 mb-0.5">
                {member.name}
              </h3>
              <p className="text-xs text-brand-700 font-medium mb-3">
                {member.role}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-slate-50 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-lg font-medium text-slate-800 mb-6">
            Trusted and certified
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Shield, label: 'IATA Certified' },
              { icon: Award, label: 'ISO 9001:2015' },
              { icon: Star, label: '4.9 Google Rating' },
              { icon: Users, label: '12,400+ Travellers' },
            ].map((cert) => {
              const Icon = cert.icon
              return (
                <div
                  key={cert.label}
                  className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm"
                >
                  <Icon className="w-4 h-4 text-brand-700" />
                  <span className="text-sm font-medium text-slate-700">
                    {cert.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-700 py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-medium text-white mb-3">
            Let's plan your dream trip
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Get in touch with our travel experts for a free personalised itinerary
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/tours')}
              className="bg-white text-brand-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              Browse tours
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border border-white/30 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              Contact us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage