import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Eye, EyeOff, Plane, Mail, Lock,
  User, Phone, Loader2,
} from 'lucide-react'
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice'
import { registerUser } from '../api/authApi'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading } = useSelector((state) => state.auth)

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    dispatch(loginStart())
    try {
      const { confirmPassword, ...submitData } = formData
      const data = await registerUser(submitData)
      dispatch(loginSuccess({ user: data.user, token: data.token }))
      toast.success(`Welcome to Aurava, ${data.user.name}!`)
      navigate('/')
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.'
      dispatch(loginFailure(message))
      toast.error(message)
    }
  }

  const InputField = ({
    label, name, type = 'text', placeholder,
    icon: Icon, rightElement,
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-10 ${rightElement ? 'pr-10' : 'pr-4'} py-2.5 text-sm rounded-xl border bg-white outline-none transition-colors ${
            errors[name]
              ? 'border-red-400 focus:border-red-500'
              : 'border-slate-200 focus:border-brand-700'
          }`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {errors[name] && (
        <p className="mt-1.5 text-xs text-red-500">{errors[name]}</p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">

      <div className="hidden lg:flex lg:w-1/2 bg-brand-800 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-lg font-medium text-white">Aurava Travels</span>
        </Link>

        <div>
          <h2 className="text-3xl font-medium text-white leading-snug mb-4">
            Join 12,000+<br />happy travellers
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Create your free account and get access to exclusive tour deals,
            booking history, and personalised travel recommendations.
          </p>

          <div className="mt-10 space-y-4">
            {[
              'Browse 500+ curated tour packages',
              'Book and manage trips in one place',
              'Exclusive member-only discounts',
              'Dedicated travel agent support',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-white/60 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} Aurava Travels
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-brand-700 rounded-lg flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-white" strokeWidth={2} />
            </div>
            <span className="text-base font-medium text-brand-700">
              Aurava Travels
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-medium text-slate-800 mb-1">
              Create your account
            </h1>
            <p className="text-sm text-slate-500">
              Start planning your dream trip today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <InputField
              label="Full name"
              name="name"
              placeholder="Rahul Sharma"
              icon={User}
            />

            <InputField
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
            />

            <InputField
              label="Mobile number"
              name="phone"
              type="tel"
              placeholder="10-digit mobile number"
              icon={Phone}
            />

            <InputField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              }
            />

            <InputField
              label="Confirm password"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your password"
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showConfirm
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              }
            />

            <p className="text-xs text-slate-400 leading-relaxed">
              By creating an account you agree to our{' '}
              <Link to="/terms" className="text-brand-700 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-brand-700 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-brand-700 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage