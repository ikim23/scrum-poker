import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid/async'

import Room from '~/core/Room'
import { ALLOWED_VOTES } from '~/core/Vote'
import { createRouter, userProcedure } from '~/server/api/trpc'
import { Events, getRoomChannelName } from '~/utils/events'
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
  finishVoting: userProcedure
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

      const average = room.finish(user)

      await repository.room.updateRoom(room)

      return average
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
        ownerUserId: room.owner.userId,
      }
    }),
  getRooms: userProcedure.query(async ({ ctx: { repository, user } }) => {
    const rooms = await repository.room.getUserRooms(user)

    return rooms
  }),
  resetVoting: userProcedure
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

      room.reset(user)

      await repository.room.updateRoom(room)
    }),
  vote: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
        vote: z.enum(ALLOWED_VOTES),
      })
    )
    .mutation(async ({ ctx: { pusher, repository, user }, input: { roomId, vote } }) => {
      const room = await repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      room.vote(user, vote)

      await repository.room.updateRoom(room)
      await pusher.trigger(getRoomChannelName(roomId), Events.UserVoted, {
        userId: user.userId,
        vote,
      })
    }),
})
