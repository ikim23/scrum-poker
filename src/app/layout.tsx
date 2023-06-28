import '~/styles/globals.css'

import { ClerkProvider, UserButton } from '@clerk/nextjs'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Link from 'next/link'
import Script from 'next/script'
import { type PropsWithChildren } from 'react'

import { env } from '~/env.mjs'
import { Routes } from '~/routes'

import { TrpcProvider } from './TrpcProvider'

export const metadata = {
  title: 'Scrum Poker',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ClerkProvider>
      <TrpcProvider>
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
            {env.NODE_ENV === 'production' && (
              <Script
                data-id="30cbe9bf-51ff-4725-92cd-33f83c4640bb"
                data-utcoffset="2"
                src="https://cdn.counter.dev/script.js"
                strategy="lazyOnload"
              />
            )}
            <ReactQueryDevtools initialIsOpen={false} />
          </body>
        </html>
      </TrpcProvider>
    </ClerkProvider>
  )
}
