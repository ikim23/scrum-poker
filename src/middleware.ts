import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
  afterAuth(auth, req) {
    if (auth.isPublicRoute && auth.sessionId) {
      const { basePath, origin } = req.nextUrl

      return NextResponse.redirect(new URL(`${basePath}/rooms`, origin))
    }
  },
  publicRoutes: ['/'],
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
