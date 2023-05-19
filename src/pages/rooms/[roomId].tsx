import { useRouter } from 'next/router'

import { Card } from '~/components/Card/Card'
import { Layout } from '~/components/Layout/Layout'
import { usePusher } from '~/hooks/usePusher'
import { trpc } from '~/utils/trpc'

const VALUES = ['1', '2', '3', '5', '8', '13', '20', '40', '100']

export default function Room() {
  const router = useRouter()
  const roomId = router.query.roomId as string | undefined

  const { data: room } = trpc.room.getRoom.useQuery({ roomId: roomId ?? '' }, { enabled: Boolean(roomId) })

  const { users } = usePusher({ roomId })

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
            {users.map((user) => (
              <li key={user.userId}>{user.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}
