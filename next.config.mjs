import { withSentryConfig } from '@sentry/nextjs'
// @ts-check
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'))

/**
 * @param {import('next').NextConfig} nextConfig
 */
function withSentry(nextConfig) {
  if (!process.env.VERCEL_ENV) {
    return nextConfig
  }

  return withSentryConfig(nextConfig, undefined, {
    disableLogger: true,
    hideSourceMaps: true,
    transpileClientSDK: false,
  })
}

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
}

export default withSentry(config)
