import { type GetServerSidePropsContext } from 'next'
import { getServerSession, type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import { env } from '~/env.mjs'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/',
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
}

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
