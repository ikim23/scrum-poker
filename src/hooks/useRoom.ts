import { useUser } from '@clerk/nextjs'
import { type PresenceChannel } from 'pusher-js'
import { useEffect, useMemo, useState } from 'react'

import { env } from '~/env.mjs'
import { Events, getRoomChannelName, type UserInfo } from '~/utils/events'
import ResolveLater from '~/utils/ResolveLater'
import { trpc } from '~/utils/trpc'

type Members = Record<string, UserInfo>

type UseRoomProps = {
  roomId: string
}

export function useRoom({ roomId }: UseRoomProps) {
  const user = useUser()
  const trpcContext = trpc.useContext()
  const { data: room, refetch } = trpc.room.getRoom.useQuery({ roomId }, { enabled: false })
  const { mutate: vote } = trpc.room.vote.useMutation({
    onMutate(userVote) {
      trpcContext.room.getRoom.setData({ roomId }, (prevRoom) =>
        prevRoom
          ? {
              ...prevRoom,
              myVote: userVote.vote,
            }
          : undefined
      )
    },
  })
  const { mutate: finishVoting } = trpc.room.finishVoting.useMutation()
  const { mutate: resetVoting } = trpc.room.resetVoting.useMutation()

  const { mutate: authorizeChannel } = trpc.room.auth.useMutation()

  const [members, setMembers] = useState<Members>({})

  useEffect(() => {
    const resolveLaterChannel = new ResolveLater<PresenceChannel>()

    async function initPusher() {
      const Pusher = (await import('pusher-js')).default

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

      function updateMembers() {
        // Destructure, because `members` variable does not change it's reference which does not trigger the `useMemo`.
        setMembers({ ...(channel.members.members as Members) })
      }

      channel.bind(Events.SubscriptionSucceeded, updateMembers)
      channel.bind(Events.MemberAdded, updateMembers)
      channel.bind(Events.MemberRemoved, updateMembers)
      channel.bind(Events.RoomUpdated, () => {
        void refetch()
      })

      resolveLaterChannel.setOnce(channel)
    }

    void initPusher()

    return () => {
      resolveLaterChannel.resolve((channel) => {
        channel.unbind()
        channel.disconnect()
      })
    }
  }, [roomId, authorizeChannel, setMembers, refetch])

  const users = useMemo(() => {
    const userVotes = room?.votes ?? {}

    return Object.values(members).map((user) => ({
      ...user,
      vote: userVotes[user.userId] ?? false,
    }))
  }, [room?.votes, members])

  return {
    actions: {
      finishVoting,
      resetVoting,
      vote,
    },
    room: room
      ? {
          isOwner: room.ownerId === user.user?.id,
          myVote: room.myVote,
          name: room.name,
          result: room.result,
          users,
        }
      : null,
  }
}
