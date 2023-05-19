export const Events = {
  MemberAdded: 'pusher:member_added',
  MemberRemoved: 'pusher:member_removed',
  SubscriptionSucceeded: 'pusher:subscription_succeeded',
  UserVoted: 'user_voted',
} as const

export function getRoomChannelName(roomId: string) {
  return `presence-${roomId}`
}
