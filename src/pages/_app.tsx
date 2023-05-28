import '~/styles/globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type AppType } from 'next/app'
import Head from 'next/head'

import { trpc } from '~/utils/trpc'

const App: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Scrum Poker</title>
      </Head>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default trpc.withTRPC(App)
