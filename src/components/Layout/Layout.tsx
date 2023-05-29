import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { type PropsWithChildren } from 'react'

import { Routes } from '~/routes'

export function Layout({ children }: PropsWithChildren) {
  return (
    <main className="grid min-h-screen grid-rows-[auto_1fr] bg-gray-900">
      <header className="flex items-center justify-between border-b-2 border-solid border-gray-700 bg-gray-800 px-10 py-6">
        <Link href={Routes.home}>
          <span className="text-2xl">Scrum Poker</span>
        </Link>
        <UserButton afterSignOutUrl={Routes.home} />
      </header>
      <div className="container mx-auto p-10">{children}</div>
    </main>
  )
}
