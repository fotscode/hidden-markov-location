type CloseIconProps = {
  color: string
}

export const CloseIcon = ({ color }: CloseIconProps) => {
  return (
    <svg
      className='h-6 w-6'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke={color}
      aria-hidden='true'
    >
      <path
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='2'
        d='M6 18L18 6M6 6l12 12'
      ></path>
    </svg>
  )
}
