import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useSales } from '../hooks/useSales'
import { useExpenses } from '../hooks/useExpenses'
import type { Opportunity, Application } from '../types/database'
import { calculateReadinessScore } from '../lib/calculations'
import { MapPin, Calendar, CheckCircle2, X, ArrowRight, ShieldCheck, Send } from 'lucide-react'

export const Opportunities: React.FC = () => {
  const { business } = useAuth()
  const { sales } = useSales(business?.id)
  const { expenses } = useExpenses(business?.id)

  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [filterType, setFilterType] = useState<string>('All')

  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const readiness = calculateReadinessScore(business, sales, expenses)

  const fetchOpportunities = async () => {
    try {
      const { data } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      setOpportunities(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchApplications = async () => {
    if (!business?.id) return
    try {
      const { data } = await supabase
        .from('applications')
        .select('*, opportunity:opportunities(*)')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
      setApplications(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchOpportunities()
    fetchApplications()
  }, [business?.id])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business?.id || !selectedOpp) return

    setSubmitting(true)
    setError(null)
    try {
      const { error: insertErr } = await supabase.from('applications').insert([
        {
          business_id: business.id,
          opportunity_id: selectedOpp.id,
          status: 'Submitted',
          notes: notes.trim() || 'Applied using verified Business Passport profile.',
          submitted_at: new Date().toISOString(),
        },
      ])
      if (insertErr) throw insertErr
      setSubmitSuccess(true)
      fetchApplications()
      setTimeout(() => {
        setSubmitSuccess(false)
        setSelectedOpp(null)
        setNotes('')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredOpportunities = opportunities.filter((opp) => {
    if (filterType === 'All') return true
    return opp.type === filterType
  })

  const isApplied = (oppId: string) => applications.some((app) => app.opportunity_id === oppId)

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Grow Your Business</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Grants, Procurement & Market Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Apply to verified opportunities with 1-click using your digital Business Passport.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            {readiness.total}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Passport Score</span>
            <span className="text-xs font-bold text-slate-800">{readiness.tier}</span>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2">
        {['All', 'Funding', 'Procurement', 'Market Access', 'Business Support'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filterType === tab ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.map((opp) => {
          const applied = isApplied(opp.id)
          return (
            <div key={opp.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                    {opp.type}
                  </span>
                  {opp.amount && (
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {opp.amount}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 leading-snug">{opp.title}</h2>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{opp.description}</p>

                <div className="flex flex-wrap gap-4 text-xs text-slate-400 my-4 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{opp.location}</span>
                  {opp.deadline && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Closes: {opp.deadline}</span>}
                </div>

                {opp.requirements && opp.requirements.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Criteria:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.requirements.map((req, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">✓ {req}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                {applied ? (
                  <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Application Submitted</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedOpp(opp)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Check Eligibility & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {applications.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            My Submitted Applications ({applications.length})
          </h2>
          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">
                    {app.opportunity?.title || 'Grant Application'}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Application Review</span>
              <button onClick={() => setSelectedOpp(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900 mt-3">{selectedOpp.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{selectedOpp.amount} • {selectedOpp.location}</p>

            <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Business Passport Attached</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Your application includes verified sales history ({sales.length} logs), current readiness score ({readiness.total}/100), and business identity automatically.
              </p>
            </div>

            {error && <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{error}</div>}

            {submitSuccess ? (
              <div className="mt-6 py-6 text-center text-emerald-700">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-base">Application Submitted!</h4>
                <p className="text-xs text-slate-500 mt-1">Your Business Passport has been transmitted.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Application Notes / Intent (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe how this opportunity will expand your business capacity..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpp(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
