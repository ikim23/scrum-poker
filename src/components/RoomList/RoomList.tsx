import Link from "next/link";
import { RouterOutputs } from "~/utils/trpc";
import { FiExternalLink } from "react-icons/fi";

type RoomListProps = {
  rooms: RouterOutputs["room"]["getRooms"];
};

export function RoomList({ rooms }: RoomListProps) {
  if (rooms.length === 0) {
    return <div>No rooms yet!</div>;
  }

  return (
    <ul className="list-inside list-disc">
      {rooms.map((room) => (
        <li key={room.roomId} className="my-2 ">
          <Link className="inline-block" href={`/rooms/${room.roomId}`}>
            <div className="flex items-center gap-1">
              <span>{room.name}</span>
              <FiExternalLink />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
