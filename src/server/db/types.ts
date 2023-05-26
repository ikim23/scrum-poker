import type { ColumnType, GeneratedAlways } from 'kysely'
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Room = {
  roomId: string
  ownerId: string
  name: string
  connectedUsers: string[]
  votes: unknown
  result: number | null
}
export type DB = {
  Room: Room
}
