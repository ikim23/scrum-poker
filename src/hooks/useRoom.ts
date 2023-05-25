import { map } from 'lodash'
import { useSession } from 'next-auth/react'
import Pusher, { type PresenceChannel } from 'pusher-js'
import { useEffect, useMemo, useState } from 'react'

import { env } from '~/env.mjs'
import { Events, getRoomChannelName } from '~/utils/events'
import { trpc } from '~/utils/trpc'
import { z, type zod } from '~/utils/zod'

const membersSchema = z.record(
  z.object({
    name: z.string(),
    userId: z.string(),
  })
)

type UseRoomProps = {
  roomId: string
}

export function useRoom({ roomId }: UseRoomProps) {
  const session = useSession()
  const trpcContext = trpc.useContext()
  const { data: room, refetch } = trpc.room.getRoom.useQuery({ roomId }, { enabled: false })
  const { mutate: vote } = trpc.room.vote.useMutation({
    onMutate(variables) {
      trpcContext.room.getRoom.setData({ roomId }, (prevRoom) =>
        prevRoom
          ? {
              ...prevRoom,
              myVote: variables.vote,
            }
          : undefined
      )
    },
  })
  const { mutate: finishVoting } = trpc.room.finishVoting.useMutation()
  const { mutate: resetVoting } = trpc.room.resetVoting.useMutation()

  const { mutate: authorizeChannel } = trpc.pusher.auth.useMutation()

  const [users, setUsers] = useState<zod.infer<typeof membersSchema>>({})

  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      channelAuthorization: {
        customHandler: (params, callback) => {
          authorizeChannel(params, {
            onSettled(data, error) {
              callback(error ? new Error(error.message) : null, data ?? null)
            },
          })
        },
        // These properties are required by TypeScript, but they are not used since we use `customHandler`.
        endpoint: '',
        transport: 'ajax',
      },
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })
    const channel = pusher.subscribe(getRoomChannelName(roomId)) as PresenceChannel

    function updateUsers() {
      setUsers(membersSchema.parse(channel.members.members))
    }

    channel.bind(Events.SubscriptionSucceeded, updateUsers)
    channel.bind(Events.MemberAdded, updateUsers)
    channel.bind(Events.MemberRemoved, updateUsers)
    channel.bind(Events.RoomUpdated, () => {
      void refetch()
    })

    return () => {
      channel.unbind()
      channel.disconnect()
    }
  }, [roomId, authorizeChannel, setUsers, refetch])

  const usersList = useMemo(() => {
    const userVotes = room?.votes ?? {}

    return map(users, (user) => ({
      ...user,
      vote: userVotes[user.userId] ?? false,
    }))
  }, [room?.votes, users])

  return {
    actions: {
      finishVoting,
      resetVoting,
      vote,
    },
    room: room
      ? {
          isOwner: room.ownerUserId === session.data?.user.id,
          myVote: room.myVote,
          name: room.name,
          result: room.result,
          users: usersList,
        }
      : null,
  }
}
