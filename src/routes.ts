export const Routes = {
  home: '/',
  room: (roomId: string) => `/rooms/${roomId}`,
  rooms: '/rooms',
  signIn: '/sign-in',
  signUp: '/sign-up',
} as const
