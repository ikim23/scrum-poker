import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { env } from '~/env.mjs'

const signInPage = '/'
const skipPaths = ['/_next', '/favicon.ico', '/api']

export default async function middleware(req: NextRequest) {
  const { basePath, origin, pathname, search } = req.nextUrl

  if (skipPaths.some((path) => pathname.startsWith(path))) {
    return
  }

  const token = await getToken({ req, secret: env.NEXTAUTH_SECRET })

  if (pathname === signInPage) {
    if (token) {
      return NextResponse.redirect(new URL(`${basePath}/rooms`, origin))
    }
  } else {
    if (!token) {
      const signInUrl = new URL(`${basePath}${signInPage}`, origin)
      signInUrl.searchParams.append('callback', `${basePath}${pathname}${search}`)

      return NextResponse.redirect(signInUrl)
    }
  }
}
