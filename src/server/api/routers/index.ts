import { pusherRouter } from '~/server/api/routers/pusher'
import { roomRouter } from '~/server/api/routers/room'
import { createRouter } from '~/server/api/trpc'

export const appRouter = createRouter({
  pusher: pusherRouter,
  room: roomRouter,
})

export type AppRouter = typeof appRouter
