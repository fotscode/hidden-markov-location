import { Tooltip } from '@nextui-org/react'
interface Props {
  isObstacle: boolean
  isAgent: boolean
  row: number
  col: number
  prob: number
  number: number
}

const calculateHeatmapColor = (prob: number) => {
  let backgroundColor
  if (prob < 0.125) {
    backgroundColor = `hsl(240, 70%, ${120 - 250 * prob}%)` // Blue to Purple
  } else if (prob < 0.25) {
    backgroundColor = `hsl(200, 70%, ${120 - 200 * prob}%)` // Purple to Blue
  } else if (prob < 0.375) {
    backgroundColor = `hsl(160, 70%, ${110 - 170 * prob}%)` // Blue to Cyan
  } else if (prob < 0.5) {
    backgroundColor = `hsl(120, 70%, ${100 - 100 * prob}%)` // Cyan to Green
  } else if (prob < 0.625) {
    backgroundColor = `hsl(80, 70%, ${100 - 85 * prob}%)` // Green to Yellow
  } else if (prob < 0.75) {
    backgroundColor = `hsl(40, 70%, ${100 - 60 * prob}%)` // Yellow to Orange
  } else if (prob < 0.875) {
    backgroundColor = `hsl(20, 70%, ${100 - 50 * prob}%)` // Orange to Red
  } else {
    backgroundColor = `hsl(0, 70%, ${100 - 35 * prob}%)` // Red 
  }
  return backgroundColor
}
export default function MazeCell({
  isAgent,
  isObstacle,
  row,
  col,
  prob,
  number,
}: Props) {
  let content = '‎ '
  if (isObstacle) {
    return (
      <div className='w-12 bg-gray-600 h-12 inline-block border border-black/50'>
        {content}
      </div>
    )
  }
  let backgroundColor = calculateHeatmapColor(prob)
  let style = {
    background: backgroundColor,
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
    <Tooltip
      offset={-20}
      color='warning'
      showArrow={true}
      content={prob.toFixed(2)}
      delay={100}
    >
      <div
        className='w-12 bg-emerald-600 h-12 inline-block border border-black/50 p-0'
        style={style}
      >
        {content}
      </div>
    </Tooltip>
  )
}
