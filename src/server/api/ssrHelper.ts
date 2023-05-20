import { createServerSideHelpers } from '@trpc/react-query/server'
import { type GetServerSidePropsContext } from 'next'
import superjson from 'superjson'

import { createContext } from './createContext'
import { appRouter } from './routers'

export async function createSsrHelper(context: Pick<GetServerSidePropsContext, 'req' | 'res'>) {
  return createServerSideHelpers({
    ctx: await createContext(context),
    router: appRouter,
    transformer: superjson,
  })
}
