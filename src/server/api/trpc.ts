import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

import User from '~/core/User'
import { type createContext } from '~/server/api/createContext'

const trpc = initTRPC.context<typeof createContext>().create({
  errorFormatter({ shape }) {
    return shape
  },
  transformer: superjson,
})

const enforceIsAuthorized = trpc.middleware(({ ctx, next }) => {
  const id = ctx.auth.userId
  const email = ctx.auth.sessionClaims?.email

  if (!id || typeof email !== 'string') {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      user: User.create({ id, name: email }),
    },
  })
})

export const createRouter = trpc.router
export const publicProcedure = trpc.procedure
export const userProcedure = trpc.procedure.use(enforceIsAuthorized)
