import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSales } from '../hooks/useSales'
import { useExpenses } from '../hooks/useExpenses'
import { calculateReadinessScore } from '../lib/calculations'
import { 
  ShieldCheck, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Check, 
  Info 
} from 'lucide-react'

export const BusinessPassport: React.FC = () => {
  const { business } = useAuth()
  const { sales } = useSales(business?.id)
  const { expenses } = useExpenses(business?.id)
  const [copied, setCopied] = useState(false)

  const readiness = calculateReadinessScore(business, sales, expenses)

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const passportNumber = business?.id
    ? `BP-ZA-${business.id.substring(0, 8).toUpperCase()}`
    : 'BP-ZA-UNVERIFIED'

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Business Identity</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Official Business Passport
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Converting everyday trade activity into formal market credibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Passport Link Copied!' : 'Share Passport'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Hero: The Digital Passport Badge Card */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Subtle holographic watermark */}
        <div className="absolute right-[-30px] bottom-[-30px] opacity-5 pointer-events-none">
          <ShieldCheck className="w-96 h-96 text-white" />
        </div>

        {/* Passport Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                REPUBLIC OF SOUTH AFRICA • DIGITAL BIZ ID
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white">
                {business?.name || 'Business Passport'}
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono text-slate-400 block">PASSPORT NO.</span>
            <span className="text-sm font-mono font-bold text-emerald-400 tracking-wider">
              {passportNumber}
            </span>
          </div>
        </div>

        {/* Business Identity Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-slate-800/80">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Enterprise Location</span>
            <span className="text-sm font-bold text-slate-100 mt-1 block">
              {business?.location || 'Soweto, Gauteng'}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">{business?.business_type}</span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Registration Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${business?.registration_status === 'Registered (CIPC)' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="text-sm font-bold text-slate-100">
                {business?.registration_status || 'Unregistered'}
              </span>
            </div>
            {business?.cipc_number && (
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                CIPC: {business.cipc_number}
              </span>
            )}
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Status Flag</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ACTIVE TRADING BUSINESS</span>
            </div>
          </div>
        </div>

        {/* Readiness Score Core Highlight */}
        <div className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">
              FORMAL BUSINESS READINESS
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-white tracking-tight">
                {readiness.total}
              </span>
              <span className="text-2xl font-bold text-slate-400">/ 100</span>
              <span className={`ml-2 text-xs font-bold px-3 py-1 rounded-full border ${readiness.badgeColor}`}>
                {readiness.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-md">
              Score calculated from real transaction logs, customer frequency, compliance, and trading history.
            </p>
          </div>

          {/* Quick Checklist Icons */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              {readiness.breakdown.businessProfile.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className="text-slate-200">Business Profile Structure</span>
            </div>
            <div className="flex items-center gap-2">
              {readiness.breakdown.salesActivity.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className="text-slate-200">Continuous Sales Activity ({sales.length} logs)</span>
            </div>
            <div className="flex items-center gap-2">
              {readiness.breakdown.expenseRecords.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className="text-slate-200">Expense Accountability ({expenses.length} logs)</span>
            </div>
          </div>
        </div>

        {/* Passport Footer */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Digital Passport issued via BizPassport PWA Platform</span>
          <span className="font-mono text-emerald-400">SECURE VERIFIED RECORD</span>
        </div>
      </div>

      {/* Readiness Score Breakdown (Section 15) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Readiness Score Breakdown (0–100)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete the milestones below to advance from <em>Getting Started</em> to <em>Market Ready</em>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(readiness.breakdown).map(([key, item]) => (
            <div
              key={key}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    item.completed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.completed ? <CheckCircle2 className="w-5 h-5" /> : `${item.score}/${item.max}`}
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-xs text-slate-500">{item.label}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-700">
                  {item.score} / {item.max} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mandatory Regulatory Disclaimer from Section 15 */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700">Important Disclaimer:</span>
            <p className="mt-0.5 leading-relaxed">
              This is an application-created readiness score generated from your verified trading activity. It must not be represented as an official bank credit score, a government certification, or a guarantee of funding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
