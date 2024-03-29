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
  console.log(row, col, isObstacle(row, col))
  const moveAgent = (direction: string) => {
    console.log(direction)
    switch (direction) {
      case 'up':
        if (!isObstacle(row - 1, col)) {
          setAgent([row - 1, col])
          setObservations((s) => [...s, getObservation(row - 1, col)])
          break
        }
        setObservations((s) => [...s, getObservation(row, col)])
        break
      case 'down':
        if (!isObstacle(row + 1, col)) {
          setAgent([row + 1, col])
          setObservations((s) => [...s, getObservation(row + 1, col)])
          break
        }
        setObservations((s) => [...s, getObservation(row, col)])
        break
      case 'left':
        if (!isObstacle(row, col - 1)) {
          setAgent([row, col - 1])
          setObservations((s) => [...s, getObservation(row, col - 1)])
          break
        }
        setObservations((s) => [...s, getObservation(row, col)])
        break
      case 'right':
        if (!isObstacle(row, col + 1)) {
          setAgent([row, col + 1])
          setObservations((s) => [...s, getObservation(row, col + 1)])
          break
        }
        setObservations((s) => [...s, getObservation(row, col)])
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
