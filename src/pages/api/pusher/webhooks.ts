import { sha256 } from 'js-sha256'
import { type NextApiRequest, type NextApiResponse } from 'next'

import { env } from '~/env.mjs'
import { createContext } from '~/server/api/createContext'
import { getRoomFromChannel } from '~/utils/events'
import { z } from '~/utils/zod'

function readBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve) => {
    let data = ''

    req
      .on('data', (chunk) => {
        data += chunk
      })
      .on('end', () => {
        resolve(Buffer.from(data).toString())
      })
  })
}

const bodySchema = z
  .object({
    events: z
      .object({
        channel: z.string().min(1),
        name: z.enum(['member_added', 'member_removed']),
        user_id: z.string().min(1),
      })
      .array(),
  })
  .passthrough()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers['x-pusher-key'] !== env.NEXT_PUBLIC_PUSHER_KEY) {
    return res.status(400).send({ reason: 'Key does not match' })
  }

  const body = await readBody(req)
  const signature = sha256.hmac(env.PUSHER_SECRET, body)

  if (req.headers['x-pusher-signature'] !== signature) {
    return res.status(400).send({ reason: 'Signature does not match' })
  }

  const parsedBody = bodySchema.safeParse(JSON.parse(body))

  if (!parsedBody.success) {
    return res.status(400).send({ reason: parsedBody.error })
  }

  const { events } = parsedBody.data
  const { repository } = await createContext({ req, res })

  for (const event of events) {
    const room = await repository.room.getRoom(getRoomFromChannel(event.channel))

    switch (event.name) {
      case 'member_added':
        room.connect(event.user_id)
        break
      case 'member_removed':
        room.disconnect(event.user_id)
        break
    }

    await repository.room.updateRoom(room)
  }

  res.status(200).end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}
