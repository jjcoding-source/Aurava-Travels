import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, Plane, Mail, Lock, Loader2 } from 'lucide-react'
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice'
import { loginUser } from '../api/authApi'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading } = useSelector((state) => state.auth)

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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
      const data = await loginUser(formData)
      dispatch(loginSuccess({ user: data.user, token: data.token }))
      toast.success(`Welcome back, ${data.user.name}!`)

      if (data.user.role === 'admin') {
        navigate('/admin')
      } else if (data.user.role === 'agent') {
        navigate('/agent')
      } else {
        navigate('/')
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.'
      dispatch(loginFailure(message))
      toast.error(message)
    }
  }

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
            Your next great<br />adventure awaits
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Log in to manage your bookings, track your trips, and discover
            new destinations tailored just for you.
          </p>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              "Aurava made our Europe trip absolutely seamless. Everything
              was planned to perfection — highly recommend!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">RS</span>
              </div>
              <div>
                <p className="text-white text-xs font-medium">Rahul Sharma</p>
                <p className="text-white/40 text-xs">Mumbai · Europe Tour</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} Aurava Travels
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <Link
            to="/"
            className="flex items-center gap-2 mb-8 lg:hidden"
          >
            <div className="w-7 h-7 bg-brand-700 rounded-lg flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-white" strokeWidth={2} />
            </div>
            <span className="text-base font-medium text-brand-700">
              Aurava Travels
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-medium text-slate-800 mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500">
              Log in to your Aurava account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white outline-none transition-colors ${
                    errors.email
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-brand-700'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-white outline-none transition-colors ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-brand-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <p className="text-xs font-medium text-slate-600 mb-3">
              Demo accounts — click to fill
            </p>
            <div className="space-y-2">
              {[
                { role: 'Admin', email: 'admin@aurava.in', password: 'admin123' },
                { role: 'Agent', email: 'agent@aurava.in', password: 'agent123' },
                { role: 'Customer', email: 'customer@aurava.in', password: 'customer123' },
              ].map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => {
                    setFormData({ email: demo.email, password: demo.password })
                    setErrors({})
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-brand-700 hover:bg-brand-50 transition-colors group"
                >
                  <span className="text-xs font-medium text-slate-700 group-hover:text-brand-700">
                    {demo.role}
                  </span>
                  <span className="text-xs text-slate-400">{demo.email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-brand-700 font-medium hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage