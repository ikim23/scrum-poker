import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiCheck } from 'react-icons/fi'

import { Button } from '~/components/Button/Button'
import { Card } from '~/components/Card/Card'
import { Center } from '~/components/Center/Center'
import { Layout } from '~/components/Layout/Layout'
import { Spinner } from '~/components/Spinner/Spinner'
import { ALLOWED_VOTES } from '~/core/Vote'
import { useRoom } from '~/hooks/useRoom'
import { trpc } from '~/utils/trpc'

type RoomProps = {
  roomId: string
}

function Room({ roomId }: RoomProps) {
  const {
    actions: { finishVoting, resetVoting, vote },
    room,
  } = useRoom({ roomId })

  // This will never be `true`. It is here just for the TypeScript.
  if (!room) {
    return null
  }

  const { isOwner, myVote, name, result, users } = room

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
              <h3 className="mb-2 text-4xl">Result</h3>
              <p className="text-3xl">{result}</p>
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

export default function RoomWrapper() {
  const router = useRouter()
  const roomId = router.query.roomId as string
  const isValidRoomId = typeof roomId === 'string' && /^[\w-]{21}$/.test(roomId)

  const { isError, isLoading } = trpc.room.getRoom.useQuery(
    { roomId },
    {
      enabled: isValidRoomId,
      retry: false,
    }
  )

  if (!isValidRoomId || isError) {
    return (
      <Layout>
        <Center>
          <h2 className="mb-8 text-4xl">Room does not exist</h2>
          <Link href="/rooms">
            <Button>Go back to your Rooms</Button>
          </Link>
        </Center>
      </Layout>
    )
  }

  if (isLoading) {
    return (
      <Layout>
        <Center>
          <Spinner size="lg" />
        </Center>
      </Layout>
    )
  }

  return <Room roomId={roomId} />
}
