import classNames from 'classnames'

import { Button } from '~/components/Button'

type CardProps = {
  isChecked?: boolean
  onClick: () => void
  value: string
}

export function Card({ isChecked, onClick, value }: CardProps) {
  return (
    <Button
      className={classNames('h-[8rem] w-[8rem]', {
        'bg-blue-600 outline outline-2 outline-offset-1 outline-blue-600': isChecked,
      })}
      onClick={onClick}
    >
      <span className=" text-5xl">{value}</span>
    </Button>
  )
}
