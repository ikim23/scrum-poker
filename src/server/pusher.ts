import Pusher from 'pusher'

import { env } from '~/env.mjs'
import { Events, getRoomChannelName } from '~/utils/events'

const globalForPusher = globalThis as unknown as { pusher: Pusher }

export const pusher =
  globalForPusher.pusher ||
  new Pusher({
    appId: env.PUSHER_APP_ID,
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    key: env.NEXT_PUBLIC_PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    useTLS: true,
  })

if (env.NODE_ENV !== 'production') globalForPusher.pusher = pusher

export const events = {
  roomUpdated(roomId: string) {
    return pusher.trigger(getRoomChannelName(roomId), Events.RoomUpdated, null)
  },
}
