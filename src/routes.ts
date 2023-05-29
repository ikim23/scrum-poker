export const Routes = {
  home: '/',
  room: (roomId: string) => `/rooms/${roomId}`,
  rooms: '/rooms',
  signUp: '/sign-up',
} as const
