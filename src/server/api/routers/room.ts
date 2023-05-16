import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid/async'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { z } from '~/utils/zod'

export const roomRouter = createTRPCRouter({
  createRoom: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(64),
      })
    )
    .mutation(async ({ input: { name }, ctx: { user, prisma } }) => {
      const newRoom = await prisma.room.create({
        data: {
          roomId: await nanoid(),
          name,
          createdBy: user.email,
        },
      })

      return newRoom
    }),
  getRooms: protectedProcedure.query(async ({ ctx: { user, prisma } }) => {
    const rooms = await prisma.room.findMany({
      where: { createdBy: user.email },
    })

    return rooms
  }),
  deleteRoom: protectedProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(async ({ input: { roomId }, ctx: { user, prisma } }) => {
      const { count } = await prisma.room.deleteMany({
        where: { AND: [{ createdBy: user.email }, { roomId }] },
      })

      return count > 0
    }),
  connectToRoom: protectedProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(async ({ input: { roomId }, ctx: { user, prisma } }) => {
      await prisma.roomUser.upsert({
        where: { roomId_user: { roomId, user: user.email } },
        create: {
          roomId,
          user: user.email,
        },
        update: {},
      })
    }),
  // createVoteRound
  // getVoteRound
  // vote
})
