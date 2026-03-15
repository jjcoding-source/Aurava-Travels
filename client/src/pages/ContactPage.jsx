import { useState } from 'react'
import {
  MapPin, Phone, Mail, Clock,
  Send, Loader2, CheckCircle,
  Instagram, Facebook, Twitter,
  MessageCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: 'Visit us',
    lines: ['42, Travel Street, MG Road', 'Kochi, Kerala — 682001', 'India'],
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    icon: Phone,
    title: 'Call us',
    lines: ['+91 98765 43210', '+91 98765 43211', 'Mon-Sat, 9am to 7pm'],
    bg: 'bg-green-50',
    color: 'text-green-600',
  },
  {
    icon: Mail,
    title: 'Email us',
    lines: ['hello@aurava.in', 'bookings@aurava.in', 'We reply within 2 hours'],
    bg: 'bg-amber-50',
    color: 'text-amber-600',
  },
  {
    icon: Clock,
    title: 'Office hours',
    lines: ['Mon — Sat: 9am to 7pm', 'Sunday: 10am to 4pm', 'Holidays: 10am to 2pm'],
    bg: 'bg-purple-50',
    color: 'text-purple-600',
  },
]

const ENQUIRY_TYPES = [
  'General enquiry',
  'New booking',
  'Existing booking',
  'Group tour',
  'Custom itinerary',
  'Complaint or feedback',
]

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  enquiryType: 'General enquiry',
  destination: '',
  message: '',
}

const ContactPage = () => {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    toast.success('Message sent! We will get back to you within 2 hours.')
  }

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="bg-brand-800 py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-medium text-white mb-3">
            Get in touch
          </h1>
          <p className="text-white/60 text-sm">
            Our travel experts are ready to help you plan your dream trip.
            Reach out and we will get back to you within 2 hours.
          </p>
        </div>
      </div>

      {/* ── Contact info cards ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_INFO.map((info) => {
            const Icon = info.icon
            return (
              <div
                key={info.title}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
              >
                <div className={`w-9 h-9 ${info.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${info.color}`} />
                </div>
                <h3 className="text-sm font-medium text-slate-800 mb-2">
                  {info.title}
                </h3>
                {info.lines.map((line, i) => (
                  <p key={i} className={`text-xs ${i === 2 ? 'text-slate-400 mt-1' : 'text-slate-600'}`}>
                    {line}
                  </p>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Contact form ────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-1">
                Send us a message
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Fill in the form and a travel expert will contact you shortly
              </p>

              {/* Success state */}
              {isSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="text-base font-medium text-slate-800 mb-2">
                    Message sent!
                  </h3>
                  <p className="text-sm text-slate-500 mb-5">
                    Thank you for reaching out. Our team will contact you within 2 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData(EMPTY_FORM)
                    }}
                    className="text-sm text-brand-700 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Full name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Rahul Sharma"
                        className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-colors ${
                          errors.name
                            ? 'border-red-400'
                            : 'border-slate-200 focus:border-brand-700'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Email address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rahul@email.com"
                        className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-colors ${
                          errors.email
                            ? 'border-red-400'
                            : 'border-slate-200 focus:border-brand-700'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone + Enquiry type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Phone number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-colors ${
                          errors.phone
                            ? 'border-red-400'
                            : 'border-slate-200 focus:border-brand-700'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Enquiry type
                      </label>
                      <select
                        name="enquiryType"
                        value={formData.enquiryType}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-700"
                      >
                        {ENQUIRY_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Destination of interest
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Europe, Bali, Dubai... (optional)"
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-700"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your travel plans, budget, number of travellers and any special requirements..."
                      rows={5}
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-colors resize-none ${
                        errors.message
                          ? 'border-red-400'
                          : 'border-slate-200 focus:border-brand-700'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* WhatsApp CTA */}
            <div className="bg-green-500 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Chat on WhatsApp</p>
                  <p className="text-xs text-white/70">Instant replies</p>
                </div>
              </div>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                For quick queries, chat directly with our travel experts on WhatsApp.
                Available Mon-Sat, 9am to 7pm.
              </p>
              <button className="w-full bg-white text-green-600 py-2.5 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors">
                Chat now — +91 98765 43210
              </button>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-sm font-medium text-slate-800 mb-4">
                Frequently asked
              </h3>
              <div className="space-y-3">
                {[
                  {
                    q: 'How far in advance should I book?',
                    a: 'We recommend booking at least 4-6 weeks in advance, especially for peak season travel.',
                  },
                  {
                    q: 'Do you handle visa applications?',
                    a: 'Yes — we provide complete visa assistance for all destinations we offer.',
                  },
                  {
                    q: 'What is your cancellation policy?',
                    a: 'Free cancellation up to 30 days before departure. Partial refund for 15-30 days.',
                  },
                  {
                    q: 'Are flights included in packages?',
                    a: 'Yes — all our standard packages include return flights from major Indian cities.',
                  },
                ].map((faq, i) => (
                  <div key={i} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <p className="text-xs font-medium text-slate-700 mb-1">
                      {faq.q}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-sm font-medium text-slate-800 mb-4">
                Follow us
              </h3>
              <div className="space-y-2">
                {[
                  { icon: Instagram, label: '@aurava.travels', color: 'text-pink-500 bg-pink-50' },
                  { icon: Facebook, label: 'Aurava Travels', color: 'text-blue-600 bg-blue-50' },
                  { icon: Twitter, label: '@AuravaTravel', color: 'text-sky-500 bg-sky-50' },
                ].map((social) => {
                  const Icon = social.icon
                  return (
                    <div
                      key={social.label}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${social.color.split(' ')[1]}`}>
                        <Icon className={`w-4 h-4 ${social.color.split(' ')[0]}`} />
                      </div>
                      <span className="text-sm text-slate-700">{social.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage