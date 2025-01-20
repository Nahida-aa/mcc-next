'use client'

import { useSocket } from '@/components/providers/socket-provider'
import { Badge } from '@/components/ui/badge'

export const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) return <Badge content="Connecting" className='bg-yellow-600'  >
    Fallback: Polling every 1s
  </Badge>

  return (
    <Badge
      content={isConnected ? 'Connected' : 'Disconnected'}
      className='bg-emerald-600'
    >
      Live: Real-time updates
    </Badge>
  )
}