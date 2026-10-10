import React, { useState } from 'react'
import { MinusCircle, X, AlertTriangle } from 'lucide-react'
import type { Expense } from '../../types/database'

interface QuickExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onAddExpense: (expense: {
    amount: number
    category: Expense['category']
    description: string
    expense_date: string
  }) => Promise<any>
}

export const QuickExpenseModal: React.FC<QuickExpenseModalProps> = ({ isOpen, onClose, onAddExpense }) => {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Expense['category']>('Stock')
  const [description, setDescription] = useState('')
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const parsedAmount = parseFloat(amount) || 0
  const isHighValue = parsedAmount >= 15000

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (parsedAmount <= 0) {
      setError('Please enter a valid expense amount greater than zero')
      return
    }

    if (!description.trim()) {
      setError('Please provide a description')
      return
    }

    setLoading(true)
    try {
      await onAddExpense({
        amount: parsedAmount,
        category,
        description: description.trim(),
        expense_date: expenseDate,
      })
      setAmount('')
      setDescription('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to record expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <MinusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Record Expense</h2>
              <p className="text-xs text-slate-500">Track costs, supplies & bills</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {isHighValue && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Unusual transaction detected.</span>
              <p className="mt-0.5">Please verify the amount (R{parsedAmount.toLocaleString()}) before submitting.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Amount (ZAR R) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">R</span>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250.00"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-lg font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
            >
              <option value="Stock">Stock & Raw Materials</option>
              <option value="Transport">Transport & Petrol</option>
              <option value="Equipment">Equipment & Tools</option>
              <option value="Marketing">Marketing & Airtime</option>
              <option value="Rent">Stall / Space Rent</option>
              <option value="Utilities">Electricity & Water</option>
              <option value="Other">Other Expenses</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Cooking oil, Meat stock, Car shampoo, Taxi fare"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Date
            </label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
