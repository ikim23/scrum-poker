import { type PrismaClient, type Room as RoomEntity } from '@prisma/client'

import Room from '~/core/Room'
import type User from '~/core/User'
import { ALLOWED_VOTES } from '~/core/Vote'
import { z } from '~/utils/zod'

function mapRoomEntityToModel(room: RoomEntity): Room {
  const roomModel = Room.create({ name: room.name, ownerId: room.ownerId, roomId: room.roomId })

  room.users.forEach((userId) => {
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

export default function createRoomRepository(prisma: PrismaClient) {
  return {
    async createRoom(room: Room) {
      await prisma.room.create({
        data: {
          name: room.name,
          ownerId: room.ownerId,
          result: room.getResult(),
          roomId: room.roomId,
          users: room.getUsers(),
          votes: room.getVotes(),
        },
      })

      return room
    },
    async deleteRoom(roomId: string) {
      await prisma.room.delete({
        where: {
          roomId,
        },
      })
    },
    async getRoom(roomId: string) {
      const room = await prisma.room.findUniqueOrThrow({
        where: {
          roomId,
        },
      })

      return mapRoomEntityToModel(room)
    },
    async getUserRooms(user: User) {
      const rooms = await prisma.room.findMany({
        where: {
          ownerId: user.userId,
        },
      })

      return rooms.map(mapRoomEntityToModel)
    },
    async updateRoom(room: Room) {
      await prisma.room.update({
        data: {
          name: room.name,
          ownerId: room.ownerId,
          result: room.getResult(),
          roomId: room.roomId,
          users: room.getUsers(),
          votes: room.getVotes(),
        },
        where: {
          roomId: room.roomId,
        },
      })
    },
  }
}
