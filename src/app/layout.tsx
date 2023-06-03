import '~/styles/globals.css'

import { ClerkProvider, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { type PropsWithChildren } from 'react'

import { Routes } from '~/routes'

export const metadata = {
  title: 'Scrum Poker',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ClerkProvider>
      <html className="dark text-white" lang="en">
        <body>
          <main className="grid min-h-screen grid-rows-[auto_1fr] bg-gray-900">
            <header className="flex items-center justify-between border-b-2 border-solid border-gray-700 bg-gray-800 px-10 py-6">
              <Link href={Routes.home}>
                <span className="text-2xl">Scrum Poker</span>
              </Link>
              <UserButton afterSignOutUrl={Routes.home} />
            </header>
            <div className="container mx-auto p-10">{children}</div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
