import { createRouter, userProcedure } from '~/server/api/trpc'
import { z } from '~/utils/zod'

export const pusherRouter = createRouter({
  auth: userProcedure
    .input(
      z.object({
        channelName: z.string().min(1).max(164),
        socketId: z.string().min(1),
      })
    )
    .mutation(({ ctx: { pusher, user }, input: { channelName, socketId } }) => {
      const authResponse = pusher.authorizeChannel(socketId, channelName, {
        user_id: user.userId,
        user_info: user,
      })

      return authResponse
    }),
})
