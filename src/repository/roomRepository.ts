import type Room from '~/core/Room'
import type User from '~/core/User'

export default function createRoomRepository() {
  const rooms: Record<string, Room> = {}

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
