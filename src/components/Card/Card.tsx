import { Button } from 'flowbite-react'

type CardProps = {
  value: string
  onClick: () => void
}

export function Card({ value, onClick }: CardProps) {
  return (
    <Button className="h-[8rem] w-[8rem]" onClick={onClick}>
      <span className=" text-5xl">{value}</span>
    </Button>
  )
}
