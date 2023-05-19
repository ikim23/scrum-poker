import { z as zod } from 'zod'

export type { z as zod } from 'zod'

export const z = {
  ...zod,
  nanoId: () =>
    zod
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9_-]+$/),
}
