import { Button } from '@nextui-org/react'
import { Dispatch, SetStateAction } from 'react'
import { Arrow } from './Arrow'

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
  const setObservation = (row: number, col: number): boolean => {
    if (isObstacle(row, col)) return false
    setAgent([row, col])
    const observation = getObservation(row, col)
    setObservations((s) => [...s, observation])
    return true
  }

  const moveAgent = (direction: string) => {
    let rowDest = row
    let colDest = col
    switch (direction) {
      case 'up':
        rowDest = row - 1
        break
      case 'down':
        rowDest = row + 1
        break
      case 'left':
        colDest = col - 1
        break
      case 'right':
        colDest = col + 1
        break
    }
    setObservation(rowDest, colDest)
    if (isObstacle(rowDest, colDest)) {
      setObservations((s) => [...s, getObservation(row, col)])
    }
  }

  return (
    <section className='absolute w-max left-0 bottom-0 pl-4 pb-4 md:left-6 md:bottom-6'>
      <section className='flex flex-col justify-center items-center'>
        <div className='flex'>
          <Button
            isIconOnly
            variant='ghost'
            aria-label='Up arrow'
            onClick={() => moveAgent('up')}
          >
            <Arrow direction='up' />
          </Button>
        </div>
        <div className='flex gap-7'>
          <Button
            isIconOnly
            variant='ghost'
            aria-label='Left arrow'
            onClick={() => moveAgent('left')}
          >
            <Arrow direction='left' />
          </Button>
          <Button
            isIconOnly
            variant='ghost'
            aria-label='Right arrow'
            onClick={() => moveAgent('right')}
          >
            <Arrow direction='right' />
          </Button>
        </div>
        <div className='flex'>
          <Button
            isIconOnly
            variant='ghost'
            aria-label='Down arrow'
            onClick={() => moveAgent('down')}
          >
            <Arrow direction='down' />
          </Button>
        </div>
      </section>
    </section>
  )
}
