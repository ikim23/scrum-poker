import { type NextRequest, NextResponse } from 'next/server'

import { env } from '~/env.mjs'
import createRoomRepository from '~/repository/roomRepository'
import { db } from '~/server/db'
import { getRoomIdFromChannelName } from '~/utils/events'
import { z } from '~/utils/zod'

async function isBodySignatureValid(body: string, signature: unknown) {
  if (typeof signature !== 'string') {
    return false
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.PUSHER_SECRET),
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['verify']
  )

  return await crypto.subtle.verify('HMAC', key, Buffer.from(signature, 'hex'), new TextEncoder().encode(body))
}

const bodySchema = z.object({
  events: z
    .object({
      channel: z.string().min(1),
      name: z.enum(['member_added', 'member_removed']),
      user_id: z.string().min(1),
    })
    .array()
    .min(1),
})

export default async function handler(req: NextRequest) {
  if (req.headers.get('x-pusher-key') !== env.NEXT_PUBLIC_PUSHER_KEY) {
    return NextResponse.json({ reason: 'Key does not match' }, { status: 400 })
  }

  const body = await req.text()
  const isValid = await isBodySignatureValid(body, req.headers.get('x-pusher-signature'))

  if (!isValid) {
    return NextResponse.json({ reason: 'Signature does not match' }, { status: 400 })
  }

  const parsedBody = bodySchema.safeParse(JSON.parse(body))

  if (!parsedBody.success) {
    return NextResponse.json({ reason: parsedBody.error }, { status: 400 })
  }

  const { events } = parsedBody.data
  const repository = createRoomRepository(db)

  for (const event of events) {
    const room = await repository.find(getRoomIdFromChannelName(event.channel))

    switch (event.name) {
      case 'member_added':
        if (room.canConnect(event.user_id)) {
          room.connect(event.user_id)
          await repository.save(room)
        }
        break

      case 'member_removed':
        if (room.canDisconnect(event.user_id)) {
          room.disconnect(event.user_id)
          await repository.save(room)
        }
        break
    }
  }

  return NextResponse.next({ status: 200 })
}

export const config = {
  api: {
    bodyParser: false,
  },
  regions: ['fra1'],
  runtime: 'edge',
}
