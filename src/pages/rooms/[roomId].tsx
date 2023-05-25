import classNames from 'classnames'
import { type GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { FiCheck } from 'react-icons/fi'

import { Button } from '~/components/Button/Button'
import { Card } from '~/components/Card/Card'
import { Layout } from '~/components/Layout/Layout'
import { ALLOWED_VOTES } from '~/core/Vote'
import { useRoom } from '~/hooks/useRoom'
import { createSsrHelper } from '~/server/api/ssrHelper'
import { z } from '~/utils/zod'

type RoomProps = {
  roomId: string
}

export default function Room({ roomId }: RoomProps) {
  const session = useSession()
  const {
    actions: { finishVoting, resetVoting, vote },
    room,
  } = useRoom({ roomId })

  if (!room) {
    return null
  }

  const { myVote, name, ownerId, result, users } = room

  const isOwner = ownerId === session.data?.user.id

  return (
    <Layout>
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h2 className="mb-4 text-3xl">{name}</h2>
          <div className="relative">
            <div className="inline-grid grid-cols-3 gap-4">
              {ALLOWED_VOTES.map((value) => (
                <Card
                  isChecked={value === myVote}
                  key={value}
                  onClick={() => {
                    vote({ roomId, vote: value })
                  }}
                  value={value}
                />
              ))}
            </div>

            <div
              className={classNames(
                'absolute inset-0 flex scale-105 flex-col items-center justify-center rounded bg-slate-500/[.9] transition-opacity duration-300',
                {
                  '-z-10 opacity-0': !result,
                  'opacity-1 z-0': result,
                }
              )}
            >
              <div className="mb-2 text-4xl">Result</div>
              <div className="text-3xl">{result}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-3xl">Connected Users</h2>
            <ul>
              {users.map((user) => (
                <li className="flex items-center justify-between gap-2" key={user.userId}>
                  <span>{user.name}</span>
                  {typeof user.vote === 'boolean' ? user.vote && <FiCheck /> : user.vote}
                </li>
              ))}
            </ul>
          </div>
          {isOwner && (
            <div className=" mt-4 flex gap-4">
              <Button
                onClick={() => {
                  finishVoting({ roomId })
                }}
              >
                Finish Voting
              </Button>
              <Button
                onClick={() => {
                  resetVoting({ roomId })
                }}
              >
                Reset Voting
              </Button>
            </div>
          )}
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
