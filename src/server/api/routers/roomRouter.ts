import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid/async'

import Room from '~/core/Room'
import { ALLOWED_VOTES } from '~/core/Vote'
import { createRouter, userProcedure } from '~/server/api/trpc'
import { type UserInfo } from '~/utils/events'
import { z } from '~/utils/zod'

export const roomRouter = createRouter({
  auth: userProcedure
    .input(
      z.object({
        channelName: z.string().min(1).max(164),
        socketId: z.string().min(1),
      })
    )
    .mutation(({ ctx: { pusher, user }, input: { channelName, socketId } }) => {
      const userInfo: UserInfo = user

      const authResponse = pusher.authorizeChannel(socketId, channelName, {
        user_id: user.userId,
        user_info: userInfo,
      })

      return authResponse
    }),
  createRoom: userProcedure
    .input(
      z.object({
        name: z.string().min(1).max(64),
      })
    )
    .mutation(async ({ ctx: { repository, user }, input: { name } }) => {
      const roomId = await nanoid()
      const room = Room.create({ name, ownerId: user.userId, roomId })

      await repository.room.create(room)

      return room
    }),
  deleteRoom: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(async ({ ctx: { repository, user }, input: { roomId } }) => {
      const room = await repository.room.find(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      if (room.ownerId !== user.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      await repository.room.delete(roomId)
    }),
  finishVoting: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(async ({ ctx: { events, repository, user }, input: { roomId } }) => {
      const room = await repository.room.find(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      room.finish(user.userId)

      await repository.room.save(room)
      await events.roomUpdated(roomId)
    }),
  getRoom: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .query(async ({ ctx: { repository, user }, input: { roomId } }) => {
      const room = await repository.room.find(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const result = room.getResult()

      return {
        myVote: room.getVotes()[user.userId] ?? false,
        name: room.name,
        ownerId: room.ownerId,
        result,
        votes: result
          ? room.getVotes()
          : Object.fromEntries(Object.entries(room.getVotes()).map(([userId, vote]) => [userId, Boolean(vote)])),
      }
    }),
  getRooms: userProcedure.query(async ({ ctx: { repository, user } }) => {
    const rooms = await repository.room.findMany(user)

    return rooms.map((room) => ({
      name: room.name,
      roomId: room.roomId,
    }))
  }),
  resetVoting: userProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(async ({ ctx: { events, repository, user }, input: { roomId } }) => {
      const room = await repository.room.find(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      room.reset(user.userId)

      await repository.room.save(room)
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
      const room = await repository.room.find(roomId)

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      room.vote(user.userId, vote)

      await repository.room.save(room)
      await events.roomUpdated(roomId)

      return vote
    }),
})
