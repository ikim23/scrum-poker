import Link from 'next/link'
import { FiExternalLink, FiTrash2 } from 'react-icons/fi'

import { Routes } from '~/routes'
import { type RouterOutputs, trpc } from '~/utils/trpc'

export const TEMP_PREFIX = 'temp'

type RoomListProps = {
  rooms: RouterOutputs['room']['getRooms']
}

export function RoomList({ rooms }: RoomListProps) {
  const trpcContext = trpc.useContext()
  const { mutate: deleteRoom } = trpc.room.deleteRoom.useMutation({
    onMutate({ roomId }) {
      trpcContext.room.getRooms.setData(undefined, (prevRooms) =>
        prevRooms ? prevRooms.filter((room) => room.roomId !== roomId) : undefined
      )
    },
    onSuccess() {
      void trpcContext.room.getRooms.invalidate()
    },
  })

  if (rooms.length === 0) {
    return <div>No rooms yet!</div>
  }

  return (
    <ul className="list-inside list-disc">
      {rooms.map((room) => (
        <li className="my-2 text-lg" key={room.roomId}>
          <div className="group inline-flex items-center gap-2">
            {!room.roomId.startsWith(TEMP_PREFIX) ? (
              <>
                <Link className="flex items-center gap-[inherit] hover:underline" href={Routes.room(room.roomId)}>
                  <span>{room.name}</span>
                  <FiExternalLink className="inline-block" />
                </Link>
                <button
                  className="invisible rounded p-1 hover:bg-red-500 group-hover:visible"
                  onClick={() => {
                    deleteRoom({ roomId: room.roomId })
                  }}
                  type="button"
                >
                  <FiTrash2 />
                </button>
              </>
            ) : (
              <span>{room.name}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
