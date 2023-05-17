import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid/async'

import Room from '~/core/Room'
import { createRouter, userProcedure } from '~/server/api/trpc'
import { z } from '~/utils/zod'

export const roomRouter = createRouter({
  connectToRoom: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(({ ctx: { repository, user }, input: { roomId } }) => {
      const room = repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (!room.canConnect(user)) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      room.connect(user)
    }),
  createRoom: userProcedure
    .input(
      z.object({
        name: z.string().min(1).max(64),
      })
    )
    .mutation(async ({ ctx: { repository, user }, input: { name } }) => {
      const roomId = await nanoid()
      const room = Room.create({ name, owner: user, roomId })

      repository.room.createRoom(room)

      return room
    }),
  deleteRoom: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(({ ctx: { repository, user }, input: { roomId } }) => {
      const room = repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (room.owner.userId !== user.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      repository.room.deleteRoom(roomId)
    }),
  getRooms: userProcedure.query(({ ctx: { repository, user } }) => {
    return repository.room.getUserRooms(user)
  }),
  // createVoteRound
  // getVoteRound
  // vote
})
