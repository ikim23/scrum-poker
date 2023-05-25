export const Events = {
  MemberAdded: 'pusher:member_added',
  MemberRemoved: 'pusher:member_removed',
  RoomUpdated: 'room_updated',
  SubscriptionSucceeded: 'pusher:subscription_succeeded',
} as const

export function getRoomChannelName(roomId: string) {
  return `presence-${roomId}`
}

export function getRoomFromChannel(channel: string) {
  return channel.replace('presence-', '')
}
