import { type GetServerSidePropsContext } from 'next'

import createRoomRepository from '~/repository/roomRepository'
import { getServerAuthSession } from '~/server/auth'
import { prisma } from '~/server/db'
import { pusher } from '~/server/pusher'

export const createContext = async (context: Pick<GetServerSidePropsContext, 'req' | 'res'>) => {
  const session = await getServerAuthSession(context)

  return {
    pusher,
    repository: {
      room: createRoomRepository(prisma),
    },
    session,
  }
}
