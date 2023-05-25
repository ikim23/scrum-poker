import { type GetServerSidePropsContext } from 'next'

import createRoomRepository from '~/repository/roomRepository'
import { getServerAuthSession } from '~/server/auth'
import { db } from '~/server/db'
import { events, pusher } from '~/server/pusher'

export const createContext = async (context: Pick<GetServerSidePropsContext, 'req' | 'res'>) => {
  const session = await getServerAuthSession(context)

  return {
    events,
    pusher,
    repository: {
      room: createRoomRepository(db),
    },
    session,
  }
}
