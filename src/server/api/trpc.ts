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
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const { user } = ctx.session

  return next({
    ctx: {
      user: User.create({ id: user.id, name: user.email }),
    },
  })
})

export const createRouter = trpc.router
export const publicProcedure = trpc.procedure
export const userProcedure = trpc.procedure.use(enforceIsAuthorized)
