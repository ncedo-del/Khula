import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSales } from '../hooks/useSales'
import { useExpenses } from '../hooks/useExpenses'
import { formatZAR, calculateFinancials } from '../lib/calculations'
import { QuickSaleModal } from '../components/dashboard/QuickSaleModal'
import { QuickExpenseModal } from '../components/dashboard/QuickExpenseModal'
import { 
  PlusCircle, 
  MinusCircle, 
  Trash2, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  Search
} from 'lucide-react'

export const Transactions: React.FC = () => {
  const { business } = useAuth()
  const { sales, addSale, deleteSale } = useSales(business?.id)
  const { expenses, addExpense, deleteExpense } = useExpenses(business?.id)

  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'expenses'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  const financials = calculateFinancials(sales, expenses)

  // Seed Thandi's exact demo story from Section 23 of Hackathon plan:
  // Sales: R450, R800, R1,200, R600
  // Expenses: Ingredients R600, Transport R250, Packaging R300
  const handleSeedDemoData = async () => {
    if (!business?.id) return
    setIsSeeding(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      // Add sales
      await addSale({ amount: 450, description: 'Platter: 5x Vetkoek & Savory Mince', payment_method: 'Cash', sale_date: today })
      await addSale({ amount: 800, description: 'Lunch Catering: Community Workshop', payment_method: 'EFT', sale_date: today })
      await addSale({ amount: 1200, description: 'Weekend Buffet Delivery', payment_method: 'EFT', sale_date: today })
      await addSale({ amount: 600, description: 'Afternoon Tea & Pastries', payment_method: 'Card', sale_date: today })

      // Add expenses
      await addExpense({ amount: 600, category: 'Stock', description: 'Fresh Meat, Flour & Ingredients', expense_date: today })
      await addExpense({ amount: 250, category: 'Transport', description: 'Petrol for Delivery Taxi', expense_date: today })
      await addExpense({ amount: 300, category: 'Stock', description: 'Eco-friendly Takeaway Packaging', expense_date: today })
    } catch (err) {
      console.error('Seeding error:', err)
    } finally {
      setIsSeeding(false)
    }
  }

  // Combine & filter
  const allList = [
    ...sales.map(s => ({ ...s, txType: 'sale' as const, date: s.sale_date })),
    ...expenses.map(e => ({ ...e, txType: 'expense' as const, date: e.expense_date })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const filteredList = allList.filter(item => {
    if (activeTab === 'sales' && item.txType !== 'sale') return false
    if (activeTab === 'expenses' && item.txType !== 'expense') return false
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const descMatch = item.description.toLowerCase().includes(term)
      const methodMatch = (item as any).payment_method?.toLowerCase().includes(term)
      const catMatch = (item as any).category?.toLowerCase().includes(term)
      return descMatch || methodMatch || catMatch
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Cash Flow & Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Every recorded transaction proves your business trade and powers your Business Passport.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Pitch Demo Auto-Seed */}
          <button
            onClick={handleSeedDemoData}
            disabled={isSeeding}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isSeeding ? 'Seeding...' : "Seed Pitch Demo (Thandi's)"}</span>
          </button>

          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Record Sale</span>
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <MinusCircle className="w-4 h-4" />
            <span>+ Record Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Revenue</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {formatZAR(financials.revenue)}
          </div>
          <span className="text-[11px] text-slate-400">{sales.length} transactions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Expenses</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {formatZAR(financials.expenses)}
          </div>
          <span className="text-[11px] text-slate-400">{expenses.length} transactions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Net Cash Position</span>
          <div className={`text-2xl font-black mt-1 ${financials.netProfit >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            {formatZAR(financials.netProfit)}
          </div>
          <span className="text-[11px] text-slate-400">Profit margin: {financials.profitMargin}%</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All ({allList.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'sales' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Sales ({sales.length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'expenses' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Expenses ({expenses.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search description, category..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-base font-semibold text-slate-700">No records found</p>
            <p className="text-xs text-slate-400 mt-1">
              Start logging your sales and expenses or click "Seed Pitch Demo" above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 sm:px-6">Type</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Category / Method</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${item.txType === 'sale' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {item.txType === 'sale' ? (
                          <>
                            <ArrowUpRight className="w-3 h-3" /> Sale
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="w-3 h-3" /> Expense
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {item.description}
                    </td>

                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {item.txType === 'sale'
                        ? (item as any).payment_method
                        : (item as any).category}
                    </td>

                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {item.date}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap font-bold">
                      <span className={item.txType === 'sale' ? 'text-emerald-700' : 'text-slate-900'}>
                        {item.txType === 'sale' ? '+' : '-'}{formatZAR(item.amount)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          if (confirm('Delete this record?')) {
                            if (item.txType === 'sale') deleteSale(item.id)
                            else deleteExpense(item.id)
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <QuickSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onAddSale={addSale}
      />

      <QuickExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onAddExpense={addExpense}
      />
    </div>
  )
}
