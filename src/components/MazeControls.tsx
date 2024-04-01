import { Button, Input } from '@nextui-org/react'
import { Dispatch, SetStateAction } from 'react'
import { Arrow } from './arrows/Arrow'



interface Props {
  isObstacle: (row: number, col: number) => boolean
  setAgent: Dispatch<SetStateAction<number[]>>
  setObservations: Dispatch<SetStateAction<string[]>>
  getObservation: (row: number, col: number) => string
  getRandomAgent: () => [number, number]
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
  const setObservation = (row: number, col: number): boolean => {
    if (isObstacle(row, col)) return false
    setAgent([row, col])
    const observation = getObservation(row, col)
    setObservations((s) => [observation,...s ])
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

  const handleErrorChange = (e) => {
    if (e.target.value === '') { setError(0); return }
    if (isNaN(parseInt(e.target.value)) || parseInt(e.target.value) > 99) return
    setError(parseInt(e.target.value) / 100)
  }

  return (
    <section className='flex flex-row justify-center items-center mt-5'>
      <section className='flex flex-col justify-center items-center mt-5'>
        <div className='flex'>
          <Button isIconOnly variant="ghost" aria-label="Up arrow"
            onClick={() => moveAgent('up')}>
            <Arrow direction="up" />
          </Button>
        </div>
        <div className='flex gap-7'>
          <Button isIconOnly variant="ghost" aria-label="Left arrow"
            onClick={() => moveAgent('left')}>
            <Arrow direction="left" />
          </Button>
          <Button isIconOnly variant="ghost" aria-label="Right arrow"
            onClick={() => moveAgent('right')}>
            <Arrow direction="right" />
          </Button>
        </div>
        <div className='flex'>
          <Button isIconOnly variant="ghost" aria-label="Down arrow"
            onClick={() => moveAgent('down')}>
            <Arrow direction="down" />
          </Button>
        </div>

      </section>
      <section className='flex flex-col justify-center items-center gap-1 mt-5 ml-5'>
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
        <Input type="number" min="0" max="99" label="Error" value={error * 100} onChange={handleErrorChange} endContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-700 ">%</span>
          </div>
        } />
      </section>

    </section>
  )
}
