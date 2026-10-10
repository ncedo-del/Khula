import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Business } from '../types/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  business: Business | null
  loading: boolean
  businessLoading: boolean
  refreshBusiness: () => Promise<Business | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  business: null,
  loading: true,
  businessLoading: false,
  refreshBusiness: async () => null,
  signOut: async () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [businessLoading, setBusinessLoading] = useState(false)

  const fetchBusiness = async (userId: string) => {
    try {
      setBusinessLoading(true)
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching business:', error)
      }
      setBusiness(data || null)
      return data || null
    } catch (err) {
      console.error('Unexpected error fetching business:', err)
      return null
    } finally {
      setBusinessLoading(false)
    }
  }

  const refreshBusiness = async () => {
    if (user?.id) {
      return await fetchBusiness(user.id)
    }
    return null
  }

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchBusiness(session.user.id)
      }
      setLoading(false)
    })

    // 2. Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchBusiness(session.user.id)
      } else {
        setBusiness(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setBusiness(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        business,
        loading,
        businessLoading,
        refreshBusiness,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
