import { Button } from '~/components/Button/Button'

type CardProps = {
  onClick: () => void
  value: string
}

export function Card({ onClick, value }: CardProps) {
  return (
    <Button className="h-[8rem] w-[8rem]" onClick={onClick}>
      <span className=" text-5xl">{value}</span>
    </Button>
  )
}
