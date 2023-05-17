export const ALLOWED_VOTES = [1, 2, 3, 5, 8, 13, 20, 40, 100] as const

export type Vote = (typeof ALLOWED_VOTES)[number]
