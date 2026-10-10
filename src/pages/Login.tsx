import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck, LogIn, AlertCircle, Sparkles } from 'lucide-react'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refreshBusiness } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        const biz = await refreshBusiness()
        if (biz) {
          navigate('/dashboard')
        } else {
          navigate('/onboarding')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Quick Demo Login for instant hackathon showcase
  const handleDemoLogin = async () => {
    setEmail('demo@businesspassport.co.za')
    setPassword('DemoPass2026!')
    setError(null)
    setLoading(true)

    try {
      // Try sign in
      let res = await supabase.auth.signInWithPassword({
        email: 'demo@businesspassport.co.za',
        password: 'DemoPass2026!',
      })

      // If user doesn't exist yet, automatically register demo user
      if (res.error) {
        const signUpRes = await supabase.auth.signUp({
          email: 'demo@businesspassport.co.za',
          password: 'DemoPass2026!',
        })
        if (signUpRes.error) throw signUpRes.error
        res = await supabase.auth.signInWithPassword({
          email: 'demo@businesspassport.co.za',
          password: 'DemoPass2026!',
        })
      }

      if (res.data.user) {
        const biz = await refreshBusiness()
        if (biz) {
          navigate('/dashboard')
        } else {
          navigate('/onboarding')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Demo login error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In</h1>
        <p className="text-sm text-slate-500 mt-1">
          Access your digital Business Passport & live dashboard
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. thandi@catering.co.za"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Signing in...' : 'Sign In'}</span>
        </button>
      </form>

      {/* Demo Quick Button */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Quick Demo Login (Thandi's Catering)</span>
        </button>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
          Register here
        </Link>
      </div>
    </div>
  )
}
