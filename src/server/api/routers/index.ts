import { pusherRouter } from '~/server/api/routers/pusherRouter'
import { roomRouter } from '~/server/api/routers/roomRouter'
import { createRouter } from '~/server/api/trpc'

export const appRouter = createRouter({
  pusher: pusherRouter,
  room: roomRouter,
})

export type AppRouter = typeof appRouter
