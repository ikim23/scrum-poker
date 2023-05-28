import { UserButton } from '@clerk/nextjs'
import { type PropsWithChildren } from 'react'

export function Layout({ children }: PropsWithChildren) {
  return (
    <main className="grid min-h-screen grid-rows-[auto_1fr] bg-gray-900">
      <header className=" flex items-center border-b-2 border-solid border-gray-700 bg-gray-800 px-10 py-6">
        <span className="mr-auto text-2xl">Scrum Poker</span>
        <UserButton afterSignOutUrl="/" />
      </header>
      <div className="container mx-auto p-10">{children}</div>
    </main>
  )
}
