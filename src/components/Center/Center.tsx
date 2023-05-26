import { type PropsWithChildren } from 'react'

export function Center({ children }: PropsWithChildren) {
  return <div className="flex h-[100%] flex-col items-center justify-center">{children}</div>
}
