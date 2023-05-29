import createRoomRepository from '~/repository/roomRepository'
import { db } from '~/server/db'
import { pusher } from '~/server/pusher'
import { getRoomIdFromChannelName } from '~/utils/events'
import { z } from '~/utils/zod'

const eventsSchema = z
  .object({
    channel: z.string().min(1),
    name: z.enum(['member_added', 'member_removed']),
    user_id: z.string().min(1),
  })
  .array()
  .min(1)

function response(body: object, status: 200 | 400) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status,
  })
}

export async function POST(req: Request) {
  const webhook = pusher.webhook({
    headers: {
      'content-type': req.headers.get('content-type') ?? '',
      'x-pusher-key': req.headers.get('x-pusher-key') ?? '',
      'x-pusher-signature': req.headers.get('x-pusher-signature') ?? '',
    },
    rawBody: await req.text(),
  })

  if (!(await webhook.isValid())) {
    return response({ reason: 'Request is invalid' }, 400)
  }

  const parsedEvents = eventsSchema.safeParse(webhook.getEvents())

  if (!parsedEvents.success) {
    return response({ reason: parsedEvents.error }, 400)
  }

  const repository = createRoomRepository(db)

  for (const event of parsedEvents.data) {
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

  return response({ message: 'ok' }, 200)
}

export const runtime = 'edge'
export const preferredRegion = 'fra1'
