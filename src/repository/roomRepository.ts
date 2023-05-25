import { type Kysely } from 'kysely'

import Room from '~/core/Room'
import type User from '~/core/User'
import { ALLOWED_VOTES } from '~/core/Vote'
import { type DB, type Room as RoomEntity } from '~/db/types'
import { z } from '~/utils/zod'

function mapRoomEntityToModel(room: RoomEntity): Room {
  const roomModel = Room.create({ name: room.name, ownerId: room.ownerId, roomId: room.roomId })

  room.connectedUsers.forEach((userId) => {
    roomModel.connect(userId)
  })

  const parsedVotes = z.record(z.string(), z.enum(ALLOWED_VOTES)).parse(room.votes ?? {})
  Object.entries(parsedVotes).forEach(([userId, vote]) => {
    roomModel.vote(userId, vote)
  })

  if (room.result !== null) {
    roomModel.finish(room.ownerId)
  }

  return roomModel
}

export default function createRoomRepository(db: Kysely<DB>) {
  return {
    async createRoom(room: Room) {
      await db
        .insertInto('Room')
        .values({
          connectedUsers: room.getUsers(),
          name: room.name,
          ownerId: room.ownerId,
          result: room.getResult(),
          roomId: room.roomId,
          votes: room.getVotes(),
        })
        .execute()

      return room
    },
    async deleteRoom(roomId: string) {
      await db.deleteFrom('Room').where('Room.roomId', '=', roomId).execute()
    },
    async getRoom(roomId: string) {
      const room = await db.selectFrom('Room').selectAll().where('Room.roomId', '=', roomId).executeTakeFirstOrThrow()

      return mapRoomEntityToModel(room)
    },
    async getUserRooms(user: User) {
      const rooms = await db.selectFrom('Room').selectAll().where('Room.ownerId', '=', user.userId).execute()

      return rooms.map(mapRoomEntityToModel)
    },
    async updateRoom(room: Room) {
      await db
        .updateTable('Room')
        .set({
          connectedUsers: room.getUsers(),
          name: room.name,
          ownerId: room.ownerId,
          result: room.getResult(),
          roomId: room.roomId,
          votes: room.getVotes(),
        })
        .where('Room.roomId', '=', room.roomId)
        .execute()
    },
  }
}
