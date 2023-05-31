import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { createContext } from '~/server/api/createContext'
import { appRouter } from '~/server/api/routers'

function handler(req: Request) {
  return fetchRequestHandler({
    createContext,
    endpoint: '/api/trpc',
    onError: ({ error }) => {
      console.log(error)
    },
    req,
    router: appRouter,
  })
}

export const GET = handler
export const POST = handler

export const runtime = 'edge'
export const preferredRegion = 'fra1'
