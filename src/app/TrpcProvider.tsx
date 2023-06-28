'use client'

import { type ComponentType, type PropsWithChildren } from 'react'

import { trpc } from '~/utils/trpc'

export const TrpcProvider = trpc.withTRPC(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ({ children }: PropsWithChildren) => children
) as ComponentType<PropsWithChildren>

export function Providers({ children }: PropsWithChildren) {
  return <TrpcProvider>{children}</TrpcProvider>
}
