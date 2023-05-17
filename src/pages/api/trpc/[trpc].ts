import { createNextApiHandler } from '@trpc/server/adapters/next'

import { env } from '~/env.mjs'
import { createContext } from '~/server/api/createContext'
import { appRouter } from '~/server/api/routers'

// export API handler
export default createNextApiHandler({
  createContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ error, path }) => {
          console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
          console.log(error)
        }
      : undefined,
  router: appRouter,
})
