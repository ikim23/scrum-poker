import { roomRouter } from '~/server/api/routers/roomRouter'
import { createRouter } from '~/server/api/trpc'

export const appRouter = createRouter({
  room: roomRouter,
})

export type AppRouter = typeof appRouter
