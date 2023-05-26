// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  if (!process.env.VERCEL_ENV) {
    return
  }

  Sentry.init({
    debug: false,
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.VERCEL_ENV,
    tracesSampleRate: 1,
  })
}
