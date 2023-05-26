import { type GetServerSidePropsContext } from 'next'
import { getServerSession, type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import { env } from '~/env.mjs'

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      }
    },
  },
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

export const getServerAuthSession = (req: GetServerSidePropsContext['req'], res: GetServerSidePropsContext['res']) => {
  return getServerSession(req, res, authOptions)
}
