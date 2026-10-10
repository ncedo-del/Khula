import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSales } from '../hooks/useSales'
import { useExpenses } from '../hooks/useExpenses'
import { useRealtimeStatus } from '../hooks/useRealtime'
import { 
  calculateFinancials, 
  calculateReadinessScore, 
  formatZAR 
} from '../lib/calculations'
import { QuickSaleModal } from '../components/dashboard/QuickSaleModal'
import { QuickExpenseModal } from '../components/dashboard/QuickExpenseModal'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PlusCircle, 
  MinusCircle, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  Layers,
  CheckCircle2
} from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { business, user } = useAuth()

  const { sales, addSale } = useSales(business?.id)
  const { expenses, addExpense } = useExpenses(business?.id)
  const isLive = useRealtimeStatus()

  const [saleModalOpen, setSaleModalOpen] = useState(false)
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)

  // Redirect to onboarding if user has no business yet
  if (!business && user) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Set Up Your Business Passport</h2>
        <p className="text-slate-600 mt-2 text-sm leading-relaxed">
          Create your business profile to begin tracking live revenue, generating your readiness score, and accessing market opportunities.
        </p>
        <Link
          to="/onboarding"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition"
        >
          <span>Complete Business Setup</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  const financials = calculateFinancials(sales, expenses)
  const readiness = calculateReadinessScore(business, sales, expenses)

  // Combined recent activities (top 5)
  const combinedTransactions = [
    ...sales.map(s => ({ ...s, txType: 'sale' as const, date: s.sale_date })),
    ...expenses.map(e => ({ ...e, txType: 'expense' as const, date: e.expense_date })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  // Determine greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'GOOD MORNING'
    if (hour < 18) return 'GOOD AFTERNOON'
    return 'GOOD EVENING'
  }

  // Calculate cash flow bar widths
  const maxCash = Math.max(financials.revenue, financials.expenses, 1)
  const revPct = Math.min(Math.round((financials.revenue / maxCash) * 100), 100)
  const expPct = Math.min(Math.round((financials.expenses / maxCash) * 100), 100)

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header & Live Indicator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-wider">
            <span>{getGreeting()} 👋</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">{business?.location}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {business?.name || 'My Business'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {business?.business_type} • Status: <span className="text-slate-800 font-medium">{business?.registration_status}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span>{isLive ? 'LIVE REALTIME SYNC' : 'CONNECTED'}</span>
          </div>
          <Link
            to="/passport"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital Passport</span>
          </Link>
        </div>
      </div>

      {/* 2. Fraud / Anomaly Detection Banner (Section 18) */}
      {financials.recentAnomalies.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 text-sm flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">⚠ Unusual transaction detected.</span>
            <p className="text-xs text-amber-800 mt-0.5">
              A high transaction of {formatZAR(financials.recentAnomalies[0].amount)} was recently recorded ({financials.recentAnomalies[0].description}). Please verify this transaction to ensure records remain accurate for formal market evaluation.
            </p>
          </div>
        </div>
      )}

      {/* 3. Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatZAR(financials.revenue)}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
            <span>{sales.length} sale{sales.length === 1 ? '' : 's'} recorded</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatZAR(financials.expenses)}
          </div>
          <div className="text-xs text-rose-700 font-semibold mt-2 flex items-center gap-1">
            <span>{expenses.length} expense{expenses.length === 1 ? '' : 's'} logged</span>
          </div>
        </div>

        {/* Estimated Profit */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Profit</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${financials.netProfit >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            {formatZAR(financials.netProfit)}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span>Profit Margin: </span>
            <span className="font-bold text-slate-700">{financials.profitMargin}%</span>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Quick Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setSaleModalOpen(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Sale</span>
          </button>

          <button
            onClick={() => setExpenseModalOpen(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition transform active:scale-95"
          >
            <MinusCircle className="w-4 h-4" />
            <span>+ Expense</span>
          </button>

          <Link
            to="/transactions"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            <Layers className="w-4 h-4 text-slate-600" />
            <span>All Cash Flow</span>
          </Link>

          <Link
            to="/passport"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Business Passport</span>
          </Link>
        </div>
      </div>

      {/* 5. Cash Flow & Business Readiness Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Visualizer */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Cash Flow Visualizer</h3>
                <p className="text-xs text-slate-500">Live comparison of money in vs money out</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                Net: {formatZAR(financials.netProfit)}
              </span>
            </div>

            {/* Horizontal comparison bars */}
            <div className="space-y-4 my-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                    Revenue
                  </span>
                  <span className="font-bold text-slate-900">{formatZAR(financials.revenue)}</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${financials.revenue > 0 ? revPct : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                    Expense
                  </span>
                  <span className="font-bold text-slate-900">{formatZAR(financials.expenses)}</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${financials.expenses > 0 ? expPct : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Updates automatically as sales/expenses are recorded</span>
            <Link to="/transactions" className="font-semibold text-emerald-600 hover:underline">
              Detailed breakdown →
            </Link>
          </div>
        </div>

        {/* Business Readiness Score Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Business Readiness</h3>
                <p className="text-xs text-slate-500">Credibility score for funding and contracts</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${readiness.badgeColor}`}>
                {readiness.tier}
              </span>
            </div>

            {/* Score Big Display */}
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900">
                {readiness.total}
              </span>
              <span className="text-lg font-bold text-slate-400">/ 100</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden my-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${readiness.total}%` }}
              ></div>
            </div>

            {/* Score summary highlights */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${readiness.breakdown.salesActivity.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span>Sales Track: {readiness.breakdown.salesActivity.score}/{readiness.breakdown.salesActivity.max}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${readiness.breakdown.expenseRecords.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span>Expense Track: {readiness.breakdown.expenseRecords.score}/{readiness.breakdown.expenseRecords.max}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Log activity to unlock higher tiers</span>
            <Link
              to="/passport"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition"
            >
              Improve my score →
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Opportunities & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunities Quick Access */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OPPORTUNITIES MATCHED</span>
              </div>
              <span className="text-xs text-slate-400">4 Grants & Contracts</span>
            </div>

            <h3 className="text-xl font-bold text-white mt-2">
              Youth Grants & Corporate Procurement
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Based on your business type (<strong className="text-white">{business?.business_type}</strong>) and current readiness score (<strong className="text-white">{readiness.total}/100</strong>), you qualify for local procurement and township growth funds.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">Up to R80,000 in funding available</span>
            <Link
              to="/opportunities"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">Recent Transactions</h3>
              <Link to="/transactions" className="text-xs font-semibold text-emerald-600 hover:underline">
                View all ({sales.length + expenses.length})
              </Link>
            </div>

            {combinedTransactions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No transactions recorded yet. Tap <strong>+ Sale</strong> or <strong>+ Expense</strong> above!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {combinedTransactions.map((tx: any) => (
                  <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${tx.txType === 'sale' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {tx.txType === 'sale' ? '+' : '-'}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block truncate max-w-[150px] sm:max-w-[200px]">
                          {tx.description}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {tx.date} • {tx.txType === 'sale' ? tx.payment_method : tx.category}
                        </span>
                      </div>
                    </div>

                    <div className={`font-bold ${tx.txType === 'sale' ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {tx.txType === 'sale' ? '+' : '-'}{formatZAR(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Transactions build your formal financial history
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickSaleModal
        isOpen={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        onAddSale={addSale}
      />

      <QuickExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onAddExpense={addExpense}
      />
    </div>
  )
}
