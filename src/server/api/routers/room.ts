import { nanoid } from 'nanoid/async'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { z } from '~/utils/zod'

export const roomRouter = createTRPCRouter({
  connectToRoom: protectedProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(async ({ ctx: { prisma, user }, input: { roomId } }) => {
      await prisma.roomUser.upsert({
        create: {
          roomId,
          user: user.email,
        },
        update: {},
        where: { roomId_user: { roomId, user: user.email } },
      })
    }),
  createRoom: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(64),
      })
    )
    .mutation(async ({ ctx: { prisma, user }, input: { name } }) => {
      const newRoom = await prisma.room.create({
        data: {
          createdBy: user.email,
          name,
          roomId: await nanoid(),
        },
      })

      return newRoom
    }),
  deleteRoom: protectedProcedure
    .input(
      z.object({
        roomId: z.nanoId(),
      })
    )
    .mutation(async ({ ctx: { prisma, user }, input: { roomId } }) => {
      const { count } = await prisma.room.deleteMany({
        where: { AND: [{ createdBy: user.email }, { roomId }] },
      })

      return count > 0
    }),
  getRooms: protectedProcedure.query(async ({ ctx: { prisma, user } }) => {
    const rooms = await prisma.room.findMany({
      where: { createdBy: user.email },
    })

    return rooms
  }),
  // createVoteRound
  // getVoteRound
  // vote
})
