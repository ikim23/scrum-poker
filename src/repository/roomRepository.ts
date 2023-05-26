import { type Kysely } from 'kysely'

import Room from '~/core/Room'
import type User from '~/core/User'
import { ALLOWED_VOTES } from '~/core/Vote'
import { type DB, type Room as RoomEntity } from '~/server/db/types'
import { z } from '~/utils/zod'

function mapRoomEntityToModel(entity: RoomEntity): Room {
  const room = Room.create({ name: entity.name, ownerId: entity.ownerId, roomId: entity.roomId })

  entity.connectedUsers.forEach((userId) => {
    room.connect(userId)
  })

  const parsedVotes = z.record(z.string(), z.enum(ALLOWED_VOTES)).parse(entity.votes ?? {})
  Object.entries(parsedVotes).forEach(([userId, vote]) => {
    room.vote(userId, vote)
  })

  if (entity.result !== null) {
    room.finish(entity.ownerId)
  }

  return room
}

export default function createRoomRepository(db: Kysely<DB>) {
  return {
    async create(room: Room) {
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
    async delete(roomId: string) {
      await db.deleteFrom('Room').where('Room.roomId', '=', roomId).execute()
    },
    async find(roomId: string) {
      const room = await db.selectFrom('Room').selectAll().where('Room.roomId', '=', roomId).executeTakeFirstOrThrow()

      return mapRoomEntityToModel(room)
    },
    async findMany(user: User) {
      const rooms = await db.selectFrom('Room').selectAll().where('Room.ownerId', '=', user.userId).execute()

      return rooms.map(mapRoomEntityToModel)
    },
    async save(room: Room) {
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
