import React from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Building2 
} from 'lucide-react'

export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
        <Sparkles className="w-4 h-4 text-emerald-600" />
        <span>Built for Young Township & Rural Entrepreneurs</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight text-center max-w-4xl leading-[1.1] mb-6">
        Build your business. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
          Prove your progress.
        </span> <br />
        Access opportunities.
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-slate-600 text-center max-w-2xl mb-10 leading-relaxed">
        Many small businesses trade every day but struggle to prove financial viability. 
        <strong className="text-slate-900 font-semibold"> Business Passport</strong> turns your daily sales, expenses, and track record into a verifiable digital business identity and readiness score.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
        <Link
          to="/register"
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all transform hover:-translate-y-0.5"
        >
          <span>Create Business Passport</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/login"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-200 shadow-sm transition"
        >
          Sign In
        </Link>
      </div>

      {/* Core Loop: MANAGE -> PROVE -> GROW */}
      <div className="w-full max-w-5xl mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            The Core Product Loop
          </h2>
          <p className="text-slate-500 mt-2">
            A simple 3-step cycle designed to move businesses into the formal economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: Manage */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 font-bold text-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Step 1</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">MANAGE</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Effortlessly log daily cash, card, and EFT sales, keep track of expenses, and understand your real cash flow in seconds.
            </p>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Live Revenue & Profit metrics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Real-time transaction tracking
              </li>
            </ul>
          </div>

          {/* Step 2: Prove */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 font-bold text-xl">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 2</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">PROVE</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Your daily activity builds a verified Business Passport with an objective 0–100 Readiness Score to showcase credibility.
            </p>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Shareable Digital Passport card
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Readiness score breakdown
              </li>
            </ul>
          </div>

          {/* Step 3: Grow */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 font-bold text-xl">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Step 3</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">GROW</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Unlock targeted youth grants, supply chain procurement contracts, and market access opportunities tailored for you.
            </p>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                Township grant matching
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                1-Click Passport application
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Problem & Solution Feature Section */}
      <div className="w-full max-w-4xl bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Formal Economy Inclusion</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
            Making township & rural enterprise visible to the formal economy.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
            "We don't just help entrepreneurs keep records. We turn everyday economic activity into a digital business identity that unlocks real funding and procurement contracts."
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
