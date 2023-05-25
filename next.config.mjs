// @ts-check
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'))

/** @type {import("next").NextConfig} */
const config = {
  // https://nextjs.org/docs/advanced-features/compiler#modularize-imports
  modularizeImports: {
    // Transform `import { map } from 'lodash'` to `import map from 'lodash/map'`
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  reactStrictMode: true,
}

export default config
