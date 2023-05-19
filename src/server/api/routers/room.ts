import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid/async'

import Room from '~/core/Room'
import { createRouter, userProcedure } from '~/server/api/trpc'
import { Events } from '~/utils/events'
import { z } from '~/utils/zod'

export const roomRouter = createRouter({
  createRoom: userProcedure
    .input(
      z.object({
        name: z.string().min(1).max(64),
      })
    )
    .mutation(async ({ ctx: { repository, user }, input: { name } }) => {
      const roomId = await nanoid()
      const room = Room.create({ name, owner: user, roomId })

      await repository.room.createRoom(room)

      return room
    }),
  deleteRoom: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(async ({ ctx: { repository, user }, input: { roomId } }) => {
      const room = await repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (room.owner.userId !== user.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      await repository.room.deleteRoom(roomId)
    }),
  disconnect: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(async ({ ctx: { pusher, repository, user }, input: { roomId } }) => {
      const room = await repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (!room.canDisconnect(user)) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      room.disconnect(user)

      await repository.room.updateRoom(room)
      await pusher.trigger(roomId, Events.disconnect, { user })
    }),
  getRoom: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .query(async ({ ctx: { repository }, input: { roomId } }) => {
      const room = await repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return {
        connectedUsers: room.connectedUsers.map((user) => ({
          name: user.name,
          userId: user.userId,
        })),
        name: room.name,
      }
    }),
  getRooms: userProcedure.query(async ({ ctx: { repository, user } }) => {
    const rooms = await repository.room.getUserRooms(user)

    return rooms
  }),
  reconnect: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(async ({ ctx: { pusher, repository, user }, input: { roomId } }) => {
      const room = await repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (!room.canConnect(user)) {
        return
      }

      room.connect(user)

      await repository.room.updateRoom(room)
      await pusher.trigger(roomId, Events.reconnect, { user })
    }),
})
