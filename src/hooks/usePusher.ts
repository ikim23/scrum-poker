import Pusher, { type Channel } from 'pusher-js'
import { useEffect, useRef } from 'react'

import { env } from '~/env.mjs'
import { Events } from '~/utils/events'

type UsePusherProps = {
  onDisconnect: () => void
  onReconnect: () => void
  roomId: string | undefined
}

export function usePusher({ onDisconnect, onReconnect: onReconnect, roomId }: UsePusherProps) {
  const channel = useRef<Channel | null>(null)

  useEffect(() => {
    if (!roomId) {
      return
    }

    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })
    channel.current = pusher.subscribe(roomId)

    channel.current.bind(Events.reconnect, onReconnect)
    channel.current.bind(Events.disconnect, onDisconnect)

    return () => {
      channel.current?.disconnect()
    }
  }, [roomId, onReconnect, onDisconnect])
}
