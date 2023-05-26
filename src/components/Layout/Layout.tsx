import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/react'
import { type PropsWithChildren } from 'react'

import { Button } from '~/components/Button/Button'

export function Layout({ children }: PropsWithChildren) {
  const router = useRouter()
  const session = useSession()

  const callbackUrl = (router.query.callback as string | undefined) ?? '/rooms'

  return (
    <main className="grid min-h-screen grid-rows-[auto_1fr] bg-gray-900">
      <header className=" flex items-center border-b-2 border-solid border-gray-700 bg-gray-800 px-10 py-6">
        <span className="mr-auto text-2xl">Scrum Poker</span>
        {session.status === 'authenticated' ? (
          <div className="flex items-center gap-6">
            <span>{session.data.user?.email}</span>
            <Button
              className="min-w-[180px]"
              onClick={() => {
                void signOut({ callbackUrl: '/' })
              }}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <Button
            className="min-w-[180px]"
            onClick={() => {
              void signIn('google', { callbackUrl })
            }}
          >
            Sign in with Google
          </Button>
        )}
      </header>
      <div className="container mx-auto p-10">{children}</div>
    </main>
  )
}
