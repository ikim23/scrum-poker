export type UserInfo = {
  name: string
  userId: string
}

export const Events = {
  MemberAdded: 'pusher:member_added',
  MemberRemoved: 'pusher:member_removed',
  RoomUpdated: 'room_updated',
  SubscriptionSucceeded: 'pusher:subscription_succeeded',
} as const

export function getRoomChannelName(roomId: string) {
  return `presence-${roomId}`
}

export function getRoomIdFromChannelName(channelName: string) {
  return channelName.replace('presence-', '')
}
