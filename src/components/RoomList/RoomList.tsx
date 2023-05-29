import Link from 'next/link'
import { FiExternalLink } from 'react-icons/fi'

import { Routes } from '~/routes'
import { type RouterOutputs } from '~/utils/trpc'

type RoomListProps = {
  rooms: RouterOutputs['room']['getRooms']
}

export function RoomList({ rooms }: RoomListProps) {
  if (rooms.length === 0) {
    return <div>No rooms yet!</div>
  }

  return (
    <ul className="list-inside list-disc">
      {rooms.map((room) => (
        <li className="my-2" key={room.roomId}>
          <Link className="inline-block" href={Routes.room(room.roomId)}>
            <div className="flex items-center gap-1">
              <span>{room.name}</span>
              <FiExternalLink />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
