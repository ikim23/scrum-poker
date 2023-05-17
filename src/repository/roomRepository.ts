import type Room from '~/core/Room'
import type User from '~/core/User'
import { env } from '~/env.mjs'

const globalForRooms = globalThis as unknown as { rooms: Record<string, Room> }

const roomMap = globalForRooms.rooms ?? {}

if (env.NODE_ENV !== 'production') globalForRooms.rooms = roomMap

export default function createRoomRepository() {
  const { rooms } = globalForRooms

  return {
    createRoom(room: Room) {
      rooms[room.roomId] = room

      return room
    },
    deleteRoom(roomId: string) {
      delete rooms[roomId]
    },
    getRoom(roomId: string) {
      return rooms[roomId]
    },
    getUserRooms(user: User) {
      return Object.values(rooms).filter((room) => room.owner.userId === user.userId)
    },
    updateRoom(room: Room) {
      return this.createRoom(room)
    },
  }
}
