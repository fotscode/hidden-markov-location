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
  if (isObstacle) {
    return (
      <div className='w-8 bg-gray-600 h-8 inline-block border border-black/50'>
        {number}
      </div>
    )
  }
  let style = {
    background: `hsl(100 40% ${100 - prob}%)`,
    color: 'red',
  }
  if (isAgent) {
    style = {
      ...style,
      color: 'blue',
    }
  }
  return (
    <div
      className='w-8 bg-emerald-600 h-8 inline-block border border-black/50 p-0'
      style={style}
    >
      {number}
    </div>
  )
}
