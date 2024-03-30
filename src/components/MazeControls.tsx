import { Button } from '@nextui-org/react'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  isObstacle: (row: number, col: number) => boolean
  setAgent: Dispatch<SetStateAction<number[]>>
  setObservations: Dispatch<SetStateAction<string[]>>
  getObservation: (row: number, col: number) => string
  row: number
  col: number
}

export function MazeControls({
  isObstacle,
  setAgent,
  setObservations,
  getObservation,
  row,
  col,
}: Props) {
  const setObservation = (row: number, col: number) => {
    if (isObstacle(row, col)) return
    setAgent([row, col])
    const observation = getObservation(row, col)
    setObservations((s) => [...s, observation])
  }

  const moveAgent = (direction: string) => {
    switch (direction) {
      case 'up':
        setObservation(row - 1, col)
        break
      case 'down':
        setObservation(row + 1, col)
        break
      case 'left':
        setObservation(row, col - 1)
        break
      case 'right':
        setObservation(row, col + 1)
        break
    }
  }
  return (
    <section className='flex flex-col justify-center items-center gap-1 mt-5'>
      <div>
        <Button
          onClick={() => moveAgent('up')}
          className='bg-primary text-white text-2xl'
        >
          ⬆️
        </Button>
      </div>
      <div className='flex gap-5'>
        <Button
          onClick={() => moveAgent('left')}
          className='bg-primary text-white text-2xl'
        >
          ⬅️
        </Button>
        <Button
          onClick={() => moveAgent('right')}
          className='bg-primary text-white text-2xl'
        >
          ➡️
        </Button>
      </div>
      <div>
        <Button
          onClick={() => moveAgent('down')}
          className='bg-primary text-white text-2xl'
        >
          ⬇️
        </Button>
      </div>
    </section>
  )
}
