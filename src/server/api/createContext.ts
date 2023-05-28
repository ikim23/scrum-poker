import { auth as getAuth } from '@clerk/nextjs'

import createRoomRepository from '~/repository/roomRepository'
import { db } from '~/server/db'
import { events, pusher } from '~/server/pusher'

export function createContext() {
  const auth = getAuth()

  return {
    auth,
    events,
    pusher,
    repository: {
      room: createRoomRepository(db),
    },
  }
}
