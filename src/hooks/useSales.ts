import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Sale } from '../types/database'

export function useSales(businessId?: string) {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSales = useCallback(async () => {
    if (!businessId) {
      setSales([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('business_id', businessId)
        .order('sale_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setSales(data || [])
    } catch (err: any) {
      console.error('Error fetching sales:', err)
      setError(err.message || 'Failed to fetch sales')
    } finally {
      setLoading(false)
    }
  }, [businessId])

  useEffect(() => {
    fetchSales()

    if (!businessId) return

    // Supabase Realtime Subscription for instant updates
    const channel = supabase
      .channel(`sales-${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales',
          filter: `business_id=eq.${businessId}`,
        },
        () => {
          fetchSales()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [businessId, fetchSales])

  const addSale = async (newSale: {
    amount: number
    description: string
    payment_method: 'Cash' | 'EFT' | 'Card' | 'Other'
    sale_date?: string
  }) => {
    if (!businessId) throw new Error('No active business found')

    const { data, error } = await supabase
      .from('sales')
      .insert([
        {
          business_id: businessId,
          amount: newSale.amount,
          description: newSale.description,
          payment_method: newSale.payment_method,
          sale_date: newSale.sale_date || new Date().toISOString().split('T')[0],
        },
      ])
      .select()
      .single()

    if (error) throw error
    // Optimistically update
    if (data) {
      setSales(prev => [data, ...prev])
    }
    return data
  }

  const deleteSale = async (saleId: string) => {
    const { error } = await supabase.from('sales').delete().eq('id', saleId)
    if (error) throw error
    setSales(prev => prev.filter(s => s.id !== saleId))
  }

  return { sales, loading, error, refetch: fetchSales, addSale, deleteSale }
}
