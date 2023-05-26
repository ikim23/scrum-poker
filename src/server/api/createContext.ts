import { type GetServerSidePropsContext } from 'next'

import createRoomRepository from '~/repository/roomRepository'
import { getServerAuthSession } from '~/server/auth'
import { db } from '~/server/db'
import { events, pusher } from '~/server/pusher'

export const createContext = async (req: GetServerSidePropsContext['req'], res: GetServerSidePropsContext['res']) => {
  const session = await getServerAuthSession(req, res)

  return {
    events,
    pusher,
    repository: {
      room: createRoomRepository(db),
    },
    session,
  }
}
