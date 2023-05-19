import {
  type PrismaClient,
  type Room as RoomEntity,
  type RoomUser as UserEntity,
  type Vote as VoteEntity,
} from '@prisma/client'

import Room from '~/core/Room'
import User from '~/core/User'

function mapRoomEntityToModel(room: RoomEntity & { users: UserEntity[]; votes: VoteEntity[] }): Room {
  const users = room.users.map((user) => User.create({ id: user.userId, name: user.name }))
  const owner = users.find((user) => user.userId === room.ownerId)

  if (!owner) {
    throw new Error()
  }

  const roomModel = Room.create({ name: room.name, owner, roomId: room.roomId })
  users
    .filter((user) => user.userId !== room.ownerId)
    .forEach((user) => {
      roomModel.connect(user)
    })

  return roomModel
}

export default function createRoomRepository(prisma: PrismaClient) {
  return {
    async createRoom(room: Room) {
      await prisma.room.create({
        data: {
          name: room.name,
          ownerId: room.owner.userId,
          roomId: room.roomId,
        },
      })
      await prisma.roomUser.createMany({
        data: room.connectedUsers.map((user) => ({
          name: user.name,
          roomId: room.roomId,
          userId: user.userId,
        })),
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
        include: {
          users: true,
          votes: true,
        },
        where: {
          roomId,
        },
      })

      return mapRoomEntityToModel(room)
    },
    async getUserRooms(user: User) {
      const rooms = await prisma.room.findMany({
        include: {
          users: true,
          votes: true,
        },
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
          ownerId: room.owner.userId,
          roomId: room.roomId,
        },
        where: {
          roomId: room.roomId,
        },
      })
      await prisma.roomUser.deleteMany({
        where: {
          roomId: room.roomId,
        },
      })
      await prisma.roomUser.createMany({
        data: room.connectedUsers.map((user) => ({
          name: user.name,
          roomId: room.roomId,
          userId: user.userId,
        })),
      })
    },
  }
}
