import { z as zod } from 'zod'

export type { z as zod } from 'zod'

export const z = {
  ...zod,
  nanoId: () => zod.string().regex(/^[\w-]{21}$/),
}
