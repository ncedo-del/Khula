import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtimeStatus() {
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const channel = supabase.channel('heartbeat-status')
    
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setIsLive(true)
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setIsLive(false)
      }
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return isLive
}
