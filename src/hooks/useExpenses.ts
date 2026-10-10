import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Expense } from '../types/database'

export function useExpenses(businessId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = useCallback(async () => {
    if (!businessId) {
      setExpenses([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('business_id', businessId)
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (err: any) {
      console.error('Error fetching expenses:', err)
      setError(err.message || 'Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }, [businessId])

  useEffect(() => {
    fetchExpenses()

    if (!businessId) return

    // Supabase Realtime Subscription
    const channel = supabase
      .channel(`expenses-${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `business_id=eq.${businessId}`,
        },
        () => {
          fetchExpenses()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [businessId, fetchExpenses])

  const addExpense = async (newExpense: {
    amount: number
    category: Expense['category']
    description: string
    expense_date?: string
  }) => {
    if (!businessId) throw new Error('No active business found')

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          business_id: businessId,
          amount: newExpense.amount,
          category: newExpense.category,
          description: newExpense.description,
          expense_date: newExpense.expense_date || new Date().toISOString().split('T')[0],
        },
      ])
      .select()
      .single()

    if (error) throw error
    if (data) {
      setExpenses(prev => [data, ...prev])
    }
    return data
  }

  const deleteExpense = async (expenseId: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId)
    if (error) throw error
    setExpenses(prev => prev.filter(e => e.id !== expenseId))
  }

  return { expenses, loading, error, refetch: fetchExpenses, addExpense, deleteExpense }
}
