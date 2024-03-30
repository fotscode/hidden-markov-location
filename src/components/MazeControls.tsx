import { Button } from '@nextui-org/react'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  isObstacle: (row: number, col: number) => boolean
  setAgent: Dispatch<SetStateAction<number[]>>
  setObservations: Dispatch<SetStateAction<string[]>>
  getObservation: (row: number, col: number) => string
  getRandomAgent: () => [number,number]
  setError: Dispatch<SetStateAction<number>>
  error: number
  row: number
  col: number
}

export function MazeControls({
  isObstacle,
  setAgent,
  setObservations,
  getObservation,
  getRandomAgent,
  setError,
  error,
  row,
  col,
}: Props) {
  const setObservation = (row: number, col: number):boolean => {
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
    if (isObstacle(rowDest, colDest)){
      setObservations((s) => [...s, getObservation(row, col)])
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
      <Button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={() => {
          window.location.reload()
        }}
        > Reset
      </Button>
      <Button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={() => {
          setAgent(getRandomAgent())
        }}
        > Kidnap
      </Button>

    </section>
  )
}
