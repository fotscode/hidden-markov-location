import * as React from 'react'
const SidebarIcon = (props: any) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={800}
    height={800}
    viewBox='0 0 24 24'
    {...props}
  >
    <title />
    <g fill='none' stroke={props.color} strokeMiterlimit={10} strokeWidth={2}>
      <rect
        width={18}
        height={18}
        x={3}
        y={3}
        data-name='Square'
        rx={2}
        ry={2}
      />
      <path d='M15 21V3' />
    </g>
  </svg>
)
export default SidebarIcon
