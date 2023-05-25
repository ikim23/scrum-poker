import { Kysely } from 'kysely'
import { NeonDialect } from 'kysely-neon'

import { type DB } from '~/db/types'
import { env } from '~/env.mjs'

const globalForDb = globalThis as unknown as { db: Kysely<DB> }

export const db =
  globalForDb.db ||
  new Kysely<DB>({
    dialect: new NeonDialect({
      connectionString: env.DATABASE_URL,
    }),
  })

if (env.NODE_ENV !== 'production') globalForDb.db = db
