import { TRPCError } from '@trpc/server'
import { mapValues } from 'lodash'
import { nanoid } from 'nanoid/async'

import Room from '~/core/Room'
import { ALLOWED_VOTES } from '~/core/Vote'
import { createRouter, userProcedure } from '~/server/api/trpc'
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
      const room = Room.create({ name, ownerId: user.userId, roomId })

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

      if (room.ownerId !== user.userId) {
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
    .mutation(async ({ ctx: { events, repository, user }, input: { roomId } }) => {
      const room = await repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const average = room.finish(user.userId)

      await repository.room.updateRoom(room)

      await events.roomUpdated(roomId)

      return average
    }),
  getRoom: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .query(async ({ ctx: { repository, user }, input: { roomId } }) => {
      const room = await repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const result = room.getResult()

      return {
        myVote: room.getVotes()[user.userId] ?? false,
        name: room.name,
        ownerUserId: room.ownerId,
        result,
        userIdsWithVotes: room.usersWithVotes,
        votes: result ? room.getVotes() : mapValues(room.getVotes(), (value) => Boolean(value)),
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
    .mutation(async ({ ctx: { events, repository, user }, input: { roomId } }) => {
      const room = await repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      room.reset(user.userId)

      await repository.room.updateRoom(room)
      await events.roomUpdated(roomId)
    }),
  vote: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
        vote: z.enum(ALLOWED_VOTES),
      })
    )
    .mutation(async ({ ctx: { events, repository, user }, input: { roomId, vote } }) => {
      const room = await repository.room.getRoom(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      room.vote(user.userId, vote)

      await repository.room.updateRoom(room)

      await events.roomUpdated(roomId)

      return vote
    }),
})
