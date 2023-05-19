import { useRouter } from 'next/router'

import { Card } from '~/components/Card/Card'
import { Layout } from '~/components/Layout/Layout'
import { ALLOWED_VOTES } from '~/core/Vote'
import { usePusher } from '~/hooks/usePusher'
import { trpc } from '~/utils/trpc'

export default function Room() {
  const router = useRouter()
  const roomId = router.query.roomId as string | undefined

  const { data: room, isError } = trpc.room.getRoom.useQuery(
    { roomId: roomId ?? '' },
    { enabled: Boolean(roomId), retry: false }
  )
  const { mutate: vote } = trpc.room.vote.useMutation()

  const { users } = usePusher({ roomId })

  if (!roomId || isError) {
    return null
  }

  return (
    <Layout>
      <div className="flex">
        <div className="inline-grid grid-cols-3 gap-4">
          {ALLOWED_VOTES.map((value) => (
            <Card
              key={value}
              onClick={() => {
                vote({ roomId, vote: value })
              }}
              value={value}
            />
          ))}
        </div>
        <div className="ml-auto">
          <h2 className="mb-4 text-3xl">Connected Users</h2>

          <ul>
            {users.map((user) => (
              <li key={user.userId}>{user.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}
