import { type CreateNextContextOptions } from '@trpc/server/adapters/next'

import createRoomRepository from '~/repository/roomRepository'
import { getServerAuthSession } from '~/server/auth'
import { prisma } from '~/server/db'
// import { pusher } from '~/server/pusher'

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await getServerAuthSession({ req, res })

  return {
    repository: {
      room: createRoomRepository(prisma),
    },
    session,
  }
}
