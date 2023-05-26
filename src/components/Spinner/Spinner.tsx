import classNames from 'classnames'

type SpinnerProps = {
  size?: 'md' | 'lg'
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      className={classNames(
        'inline-block animate-spin rounded-full  border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        {
          'h-12 w-12 border-[4px]': size === 'lg',
          'h-8 w-8 border-[3px]': size === 'md',
        }
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  )
}
