import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Card } from '~/components/Card/Card'
import { Layout } from '~/components/Layout/Layout'
import { trpc } from '~/utils/trpc'

const VALUES = ['1', '2', '3', '5', '8', '13', '20', '40', '100']

export default function Room() {
  const router = useRouter()
  const roomId = router.query.roomId as string | undefined

  const room = trpc.room.getRoom.useQuery({ roomId: roomId ?? '' }, { enabled: Boolean(roomId) })
  const { mutate: reconnect } = trpc.room.reconnect.useMutation({
    onSuccess: () => {
      void room.refetch()
    },
  })
  const { mutate: disconnect } = trpc.room.disconnect.useMutation()

  useEffect(() => {
    if (roomId) {
      reconnect({ roomId })
    }

    return () => {
      if (roomId) {
        disconnect({ roomId })
      }
    }
  }, [reconnect, disconnect, roomId])

  const connectedUsers = room.data?.connectedUsers ?? []

  return (
    <Layout>
      <div className="flex">
        <div className="inline-grid grid-cols-3 gap-4">
          {VALUES.map((value) => (
            <Card
              key={value}
              onClick={() => {
                console.log('Voting', value)
              }}
              value={value}
            />
          ))}
        </div>
        <div className="ml-auto">
          <h2 className="mb-4 text-3xl">Connected Users</h2>

          <ul>
            {connectedUsers.map((user) => (
              <li key={user.userId}>{user.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}
