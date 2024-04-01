import { Tooltip } from "@nextui-org/react";
interface Props {
  isObstacle: boolean
  isAgent: boolean
  row: number
  col: number
  prob: number
  number: number
}
export default function MazeCell({
  isAgent,
  isObstacle,
  row,
  col,
  prob,
  number,
}: Props) {
  let content = "‎ "
  if (isObstacle) {
    return (
      <div className='w-12 bg-gray-600 h-12 inline-block border border-black/50'>
        {content}
      </div>
    )
  }
  let style = {
    background: `hsl(100 70% ${100 - 90 * prob}%)`,
    color: 'red',
  }
  if (isAgent) {
    content = '🤖'
    style = {
      ...style,
      color: 'blue',
    }
  }

  return (
    <Tooltip offset={-20} color="warning" showArrow={true} content={prob.toFixed(2)} delay={100}>
      <div
        className='w-12 bg-emerald-600 h-12 inline-block border border-black/50 p-0'
        style={style}
      >
        {content}
      </div>
    </Tooltip>

  )
}
