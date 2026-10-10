import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cjoevunnztsdkmobwcvr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqb2V2dW5uenRzZGttb2J3Y3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NDkzNjEsImV4cCI6MjEwNzAyNTM2MX0.rgjre5CaRFzbxImAvnUxSbZAK4RYgVSFIVupsSJd1wE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})
