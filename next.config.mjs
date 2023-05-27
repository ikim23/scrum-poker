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
const nextConfig = {
  reactStrictMode: true,
  webpack(webpackConfig, options) {
    // Ignore `cloudflare:sockets` because they break the Edge runtime.
    // https://github.com/brianc/node-postgres/issues/2975#issuecomment-1550268806
    webpackConfig.plugins.push(
      new options.webpack.IgnorePlugin({
        resourceRegExp: /^cloudflare:sockets$/,
      })
    )

    return webpackConfig
  },
}

export default withSentry(nextConfig)
