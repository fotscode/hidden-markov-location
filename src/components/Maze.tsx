import { useEffect, useState } from 'react'
import MazeCell from './MazeCell'
import { MazeControls } from './MazeControls'
import Sidebar from './Sidebar'
import { Button } from '@nextui-org/react'
import SidebarIcon from './SidebarIcon'

const WIDTH = 16
const HEIGHT = 4

const makeNxNMatrix = (n: number, value: number = 0) => {
  return Array.from({ length: n }, (_, i) => i).map(() =>
    Array.from({ length: n }, (_, i) => i).map(() => {
      return value
    }),
  )
}

const getRandomNumbers = (size: number) => {
  return Array.from({ length: Math.floor(0.4 * size) }, () => {
    return Math.floor(Math.random() * size)
  })
}
/*

[
    4, 10, 14, 16, 17, 20, 22, 23, 25, 27, 29, 30, 31, 32, 36, 38, 39, 45, 46,
    50, 54, 59,
  ]
  getRandomNumbers(WIDTH * HEIGHT)
*/
const obstacleArray = [
  4, 10, 14, 16, 17, 20, 22, 23, 25, 27, 29, 30, 31, 32, 36, 38, 39, 45, 46, 50,
  54, 59,
]
export default function Maze() {
  const [dragging, setDragging] = useState(false)
  const [position, setPosition] = useState({ x: -1, y: -1 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })

  const ERROR = 0.02
  const [hidden, setHidden] = useState(true)
  const [error, setError] = useState(ERROR)
  const [obstacles, setObstacles] = useState(obstacleArray)
  const [agent, setAgent] = useState([0, 0])
  const [observations, setObservations] = useState([] as string[])
  const [transitionMatrix, setTransitionMatrix] = useState(
    makeNxNMatrix(HEIGHT * WIDTH, 0),
  )
  const [observationMatrices, setObservationMatrices] = useState(
    {} as { [key: string]: number[][] },
  )

  const isOutOfBounds = (row: number, col: number) => {
    return row < 0 || row >= HEIGHT || col < 0 || col >= WIDTH
  }

  const isObstacle = (row: number, col: number) => {
    return (
      obstacles.some((pos) => row * WIDTH + col === pos) ||
      isOutOfBounds(row, col)
    )
  }

  const [beliefState, setBeliefState] = useState(
    Array.from({ length: HEIGHT * WIDTH }, (_, i) => i).map((row, j) => {
      if (isObstacle(Math.floor(j / WIDTH), j % WIDTH)) return 0
      return 1 / (HEIGHT * WIDTH - obstacles.length)
    }),
  )

  const getNeighbours = (row: number, col: number) => {
    const neighbours = []
    if (row > 0 && !isObstacle(row - 1, col)) {
      neighbours.push([row - 1, col])
    }
    if (col < WIDTH - 1 && !isObstacle(row, col + 1)) {
      neighbours.push([row, col + 1])
    }
    if (row < HEIGHT - 1 && !isObstacle(row + 1, col)) {
      neighbours.push([row + 1, col])
    }
    if (col > 0 && !isObstacle(row, col - 1)) {
      neighbours.push([row, col - 1])
    }

    return neighbours
  }

  const fillTransitionMatrix = (transitionMatrix: number[][]) => {
    for (let row = 0; row < HEIGHT; row++) {
      for (let col = 0; col < WIDTH; col++) {
        const neighbours = getNeighbours(row, col)
        const numNeighbours = neighbours.length
        const PROB = 0.25
        neighbours.forEach(([i, j]) => {
          transitionMatrix[i * WIDTH + j][row * WIDTH + col] = PROB
        })
        transitionMatrix[row * WIDTH + col][row * WIDTH + col] =
          1 - PROB * numNeighbours
      }
    }
    setTransitionMatrix(transitionMatrix)
    
  }

  const fillObservationMatrix = (
    observationMatrix: number[][],
    discrepancies: number[],
  ): number[][] => {
    let sensorList = []
    for (let num of discrepancies) {
      let prob = (1 - error) ** (4 - num) * error ** num
      sensorList.push(prob)
    }
    for (let row = 0; row < observationMatrix.length; row++) {
      for (let col = 0; col < observationMatrix[0].length; col++) {
        if (row !== col) {
          observationMatrix[row][col] = 0
        } else {
          observationMatrix[row][col] = sensorList[row]
        }
      }
    }
    return observationMatrix
  }

  useEffect(() => {
    fillObservationMatrices(obs)
  }, [error])

  const getObservation = (row: number, col: number): string => {
    let observation = ['1', '1', '1', '1']
    if (row > 0 && !isObstacle(row - 1, col)) {
      observation[0] = '0'
    }
    if (col < WIDTH - 1 && !isObstacle(row, col + 1)) {
      observation[1] = '0'
    }
    if (row < HEIGHT - 1 && !isObstacle(row + 1, col)) {
      observation[2] = '0'
    }
    if (col > 0 && !isObstacle(row, col - 1)) {
      observation[3] = '0'
    }
    return observation.join('')
  }

  const getDiscrepancieOfCell = (
    row: number,
    col: number,
    observation: string,
  ): number => {
    let count = 0
    const neighbours = getNeighbours(row, col)
    observation.split('').forEach((obs, i) => {
      switch (obs) {
        case '0':
          switch (i) {
            case 0:
              if (isObstacle(row - 1, col)) {
                count++
              }
              break
            case 1:
              if (isObstacle(row, col + 1)) {
                count++
              }
              break
            case 2:
              if (isObstacle(row + 1, col)) {
                count++
              }
              break
            case 3:
              if (isObstacle(row, col - 1)) {
                count++
              }
              break
          }

          break
        case '1':
          switch (i) {
            case 0:
              if (!isObstacle(row - 1, col)) {
                count++
              }
              break
            case 1:
              if (!isObstacle(row, col + 1)) {
                count++
              }
              break
            case 2:
              if (!isObstacle(row + 1, col)) {
                count++
              }
              break
            case 3:
              if (!isObstacle(row, col - 1)) {
                count++
              }
              break
          }

          break
      }
    })
    return count
  }

  const getDiscrepancies = (observation: string): number[] => {
    return Array.from({ length: HEIGHT * WIDTH }, (_, i) => i).map((cell) => {
      return getDiscrepancieOfCell(
        Math.floor(cell / WIDTH),
        cell % WIDTH,
        observation,
      )
    })
  }
  const fillObservationMatrices = (obs: { [key: string]: number[][] }) => {
    for (let i = 0; i < 16; i++) {
      const binaryString = i.toString(2).padStart(4, '0')
      obs[binaryString] = fillObservationMatrix(
        makeNxNMatrix(HEIGHT * WIDTH, 0),
        getDiscrepancies(binaryString),
      )
    }
    setObservationMatrices(obs)
  }

  const obs = {} as { [key: string]: number[][] }
  useEffect(() => {
    fillTransitionMatrix(transitionMatrix)
    fillObservationMatrices(obs)
    setAgent(getRandomAgent())
  }, [])

  const getRandomAgent = (): [number, number] => {
    const pos = Math.floor(Math.random() * (WIDTH * HEIGHT))
    const x = Math.floor(pos / WIDTH)
    const y = pos % WIDTH
    if (isObstacle(x, y)) {
      return getRandomAgent()
    }
    return [Math.floor(pos / WIDTH), pos % WIDTH]
  }

  const multiplyMatrixByArray = (
    matrixA: number[][],
    arrayB: number[],
  ): number[] => {
    return arrayB.map((_, i) => {
      return matrixA[i].reduce((acc, curr, j) => {
        return acc + curr * arrayB[j]
      }, 0)
    })
  }

  useEffect(() => {
    if (observations.length === 0) return
    const obs = observations[0]
    let newBeliefState = multiplyMatrixByArray(
      observationMatrices[obs],
      multiplyMatrixByArray(transitionMatrix, beliefState),
    )
    let sum = newBeliefState.reduce((acc, curr) => acc + curr, 0)
    let newBeliefStateNormalized = newBeliefState.map((prob) => {
      return prob / sum
    })
    setBeliefState(newBeliefStateNormalized)
  }, [observations])
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(true)
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement> ) => {
    if (dragging) {
      let bounded = boundXY(e)
      setPosition({
        x: bounded[0],
        y: bounded[1],
      })
    }
  }
  const boundXY = (e: any): [number, number] => {
    const newX = e.clientX - startPosition.x
    const newY = e.clientY - startPosition.y

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const elementWidth = e.target.offsetWidth
    const elementHeight = e.target.offsetHeight

    const maxX = windowWidth - elementWidth
    const maxY = windowHeight - elementHeight

    const boundedX = Math.max(0, Math.min(newX, maxX))
    const boundedY = Math.max(0, Math.min(newY, maxY))

    return [boundedX, boundedY]
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(false)
    let bounded = boundXY(e)
    setPosition({
      x: bounded[0],
      y: bounded[1],
    })
  }
  console.log(position)
  return (
    <>
      <div
        className='text-center h-max w-max border border-gray-600 border-4 border-solid rounded-md absolute z-index-50'
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          left: position.x === -1 ? window.innerWidth / 4 : position.x,
          top: position.y === -1 ? window.innerHeight / 4 : position.y,
        }}
      >
        {Array.from({ length: HEIGHT }, (_, i) => i).map((row) => (
          <div className='h-12' key={row}>
            {Array.from({ length: WIDTH }, (_, i) => i).map((col) => (
              <MazeCell
                isObstacle={isObstacle(row, col)}
                isAgent={agent[0] === row && agent[1] === col}
                row={row}
                col={col}
                prob={beliefState[row * WIDTH + col]}
                key={row * WIDTH + col}
                number={row * WIDTH + col}
              />
            ))}
          </div>
        ))}
      </div>
      <MazeControls
        isObstacle={isObstacle}
        setAgent={setAgent}
        setObservations={setObservations}
        getObservation={getObservation}
        row={agent[0]}
        col={agent[1]}
      />
      {hidden && (
        <Button
          isIconOnly
          variant='light'
          className='absolute top-0 right-0 mr-4 mt-4 p-1'
          onClick={() => setHidden(!hidden)}
        >
          <SidebarIcon color={'#fff'} />
        </Button>
      )}
      <Sidebar
        observations={observations}
        hidden={hidden}
        setHidden={setHidden}
        setAgent={setAgent}
        getRandomAgent={getRandomAgent}
        error={error}
        setError={setError}
      />
    </>
  )
}
