import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Building, CheckCircle2, Save } from 'lucide-react'

export const Profile: React.FC = () => {
  const { business, user, refreshBusiness } = useAuth()

  const [name, setName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [registrationStatus, setRegistrationStatus] = useState<any>('Unregistered')
  const [cipcNumber, setCipcNumber] = useState('')

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (business) {
      setName(business.name || '')
      setBusinessType(business.business_type || 'Catering')
      setLocation(business.location || '')
      setDescription(business.description || '')
      setPhone(business.phone || '')
      setEmail(business.email || user?.email || '')
      setRegistrationStatus(business.registration_status || 'Unregistered')
      setCipcNumber(business.cipc_number || '')
    }
  }, [business, user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business?.id) return
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: name.trim(),
          business_type: businessType,
          location: location.trim(),
          description: description.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          registration_status: registrationStatus,
          cipc_number: cipcNumber.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', business.id)

      if (error) throw error
      await refreshBusiness()
      setMessage('Profile and Passport details updated successfully!')
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage(`Error: ${err.message || 'Failed to update'}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Building className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Business Profile</h1>
            <p className="text-xs text-slate-500">
              Manage your verified enterprise records and legal documentation.
            </p>
          </div>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${message.startsWith('Error') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Enterprise Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Business Type / Industry
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Catering">Catering & Food</option>
                <option value="Retail / Spaza">Retail & Spaza</option>
                <option value="Car Wash & Auto">Car Wash & Auto</option>
                <option value="Agriculture & Fresh Produce">Agriculture & Fresh Produce</option>
                <option value="Hair, Beauty & Wellness">Hair & Beauty</option>
                <option value="Construction & Maintenance">Construction & Trades</option>
                <option value="Services & Logistics">Services & Delivery</option>
                <option value="Other">Other Enterprise</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Township / Area Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Business Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Formal Compliance & CIPC
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Registration Status
                </label>
                <select
                  value={registrationStatus}
                  onChange={(e) => setRegistrationStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Unregistered">Informal / Unregistered</option>
                  <option value="In Progress">In Progress (CIPC Application)</option>
                  <option value="Registered (CIPC)">Registered Company (CIPC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  CIPC Registration No.
                </label>
                <input
                  type="text"
                  value={cipcNumber}
                  onChange={(e) => setCipcNumber(e.target.value)}
                  placeholder="2024/123456/07"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
