import { createRouter, userProcedure } from '~/server/api/trpc'
import { type UserInfo } from '~/utils/events'
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
      const userInfo: UserInfo = user

      const authResponse = pusher.authorizeChannel(socketId, channelName, {
        user_id: user.userId,
        user_info: userInfo,
      })

      return authResponse
    }),
})
