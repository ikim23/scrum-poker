import { type GetServerSideProps } from 'next'

import { Card } from '~/components/Card/Card'
import { Layout } from '~/components/Layout/Layout'
import { ALLOWED_VOTES } from '~/core/Vote'
import { usePusher } from '~/hooks/usePusher'
import { createSsrHelper } from '~/server/api/ssrHelper'
import { trpc } from '~/utils/trpc'
import { z } from '~/utils/zod'

type RoomProps = {
  roomId: string
}

export default function Room({ roomId }: RoomProps) {
  const { data: room } = trpc.room.getRoom.useQuery({ roomId })
  const { mutate: vote } = trpc.room.vote.useMutation()

  const { users } = usePusher({ roomId })

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const parsedRoomId = z.nanoId().safeParse(context.query.roomId)

  if (!parsedRoomId.success) {
    return { notFound: true }
  }

  const ssrHelper = await createSsrHelper(context)
  try {
    const roomId = parsedRoomId.data

    await ssrHelper.room.getRoom.fetch({ roomId })

    return {
      props: {
        roomId,
        trpcState: ssrHelper.dehydrate(),
      },
    }
  } catch {
    return { notFound: true }
  }
}
