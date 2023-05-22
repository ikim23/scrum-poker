import Pusher, { type PresenceChannel } from 'pusher-js'
import { useEffect, useState } from 'react'

import { env } from '~/env.mjs'
import { Events, getRoomChannelName } from '~/utils/events'
import { trpc } from '~/utils/trpc'
import { z, type zod } from '~/utils/zod'

const userSchema = z.object({
  name: z.string(),
  userId: z.string(),
})

const membersSchema = z.record(userSchema)

type User = zod.infer<typeof userSchema>

type UseRoomProps = {
  roomId: string | undefined
}

export function useRoom({ roomId }: UseRoomProps) {
  const [users, setUsers] = useState<User[]>([])
  const { mutate: authorizeChannel } = trpc.pusher.auth.useMutation()

  useEffect(() => {
    if (!roomId) {
      return
    }

    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      channelAuthorization: {
        customHandler: (params, callback) => {
          authorizeChannel(params, {
            onSettled(data, error) {
              callback(error ? new Error(error.message) : null, data ?? null)
            },
          })
        },
        endpoint: null as unknown as string,
        transport: 'ajax',
      },
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })
    const channel = pusher.subscribe(getRoomChannelName(roomId)) as PresenceChannel

    function updateUsers() {
      const members = membersSchema.parse(channel.members.members)
      setUsers(Object.values(members))
    }

    channel.bind(Events.SubscriptionSucceeded, () => {
      console.log('Successfully subscribed to the channel')

      updateUsers()
    })
    channel.bind(Events.MemberAdded, updateUsers)
    channel.bind(Events.MemberRemoved, updateUsers)
    channel.bind(Events.UserVoted, (data) => {
      console.log(data)
    })

    return () => {
      channel.unbind()
      channel.disconnect()
    }
  }, [roomId, authorizeChannel, setUsers])

  return { users }
}