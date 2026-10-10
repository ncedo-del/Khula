import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react'

export const Onboarding: React.FC = () => {
  const { user, refreshBusiness } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [businessType, setBusinessType] = useState('Catering')
  const [location, setLocation] = useState('Soweto, Gauteng')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [registrationStatus, setRegistrationStatus] = useState<'Unregistered' | 'In Progress' | 'Registered (CIPC)'>('Unregistered')
  const [cipcNumber, setCipcNumber] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Demo prefill helper for hackathon pitch
  const handlePrefillDemo = () => {
    setName("Thandi's Catering")
    setBusinessType('Catering')
    setLocation('Soweto, Gauteng')
    setDescription('Community catering providing freshly cooked daily platters, event dining, and corporate lunchboxes across Soweto.')
    setPhone('082 555 4921')
    setRegistrationStatus('In Progress')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('You must be signed in to create a business profile')
      return
    }

    if (!name.trim()) {
      setError('Please provide a business name')
      return
    }

    setLoading(true)

    try {
      const { error: insertError } = await supabase
        .from('businesses')
        .insert([
          {
            owner_id: user.id,
            name: name.trim(),
            business_type: businessType,
            location: location.trim(),
            description: description.trim(),
            phone: phone.trim() || null,
            email: user.email,
            registration_status: registrationStatus,
            cipc_number: cipcNumber.trim() || null,
          },
        ])
        .select()
        .single()

      if (insertError) throw insertError

      await refreshBusiness()
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Onboarding error:', err)
      setError(err.message || 'Failed to save business details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Step 1 of 3: Business Setup
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Build Your Business Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            This forms the foundation of your digital Business Passport.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrefillDemo}
          className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pre-fill "Thandi's Catering"</span>
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Business Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Thandi's Catering or Soweto Fresh Supplies"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Industry / Business Type *
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-white"
            >
              <option value="Catering">Catering & Food</option>
              <option value="Retail / Spaza">Retail & Spaza</option>
              <option value="Car Wash & Auto">Car Wash & Auto Services</option>
              <option value="Agriculture & Fresh Produce">Agriculture & Farming</option>
              <option value="Hair, Beauty & Wellness">Hair & Beauty</option>
              <option value="Construction & Maintenance">Trades & Construction</option>
              <option value="Services & Logistics">Services & Delivery</option>
              <option value="Other">Other Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Township / Rural Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Soweto, Gauteng"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Brief Description of What You Sell / Do
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your day-to-day operations and products/services..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-normal"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Contact Phone / WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="082 123 4567"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Registration Status
            </label>
            <select
              value={registrationStatus}
              onChange={(e) => setRegistrationStatus(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-white"
            >
              <option value="Unregistered">Informal / Unregistered</option>
              <option value="In Progress">In Progress (CIPC filing)</option>
              <option value="Registered (CIPC)">Registered Company (CIPC)</option>
            </select>
          </div>
        </div>

        {registrationStatus === 'Registered (CIPC)' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              CIPC Enterprise Number
            </label>
            <input
              type="text"
              value={cipcNumber}
              onChange={(e) => setCipcNumber(e.target.value)}
              placeholder="2024/123456/07"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition disabled:opacity-50"
          >
            <span>{loading ? 'Creating Passport...' : 'Save & Launch Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
