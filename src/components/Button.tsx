import classNames from 'classnames'
import { type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  className?: string
  isDisabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

export function Button({ children, className, isDisabled, ...props }: ButtonProps) {
  return (
    <button
      className={classNames('rounded bg-sky-500 px-6 py-3 hover:bg-sky-600', className)}
      disabled={isDisabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
