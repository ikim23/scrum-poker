import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { env } from '~/env.mjs'
import { createContext } from '~/server/api/createContext'
import { appRouter } from '~/server/api/routers'

function handler(req: Request) {
  return fetchRequestHandler({
    createContext,
    endpoint: '/api/trpc',
    onError:
      env.NODE_ENV === 'development'
        ? ({ error, path }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
            console.log(error)
          }
        : undefined,
    req,
    router: appRouter,
  })
}

export const GET = handler
export const POST = handler

export const runtime = 'edge'
export const preferredRegion = 'fra1'
