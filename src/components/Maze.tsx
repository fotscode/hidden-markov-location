'use client'
import { useEffect, useState, useLayoutEffect, useRef } from 'react'
import MazeCell from './MazeCell'
import { MazeControls } from './MazeControls'

const WIDTH = 16
const HEIGHT = 4

const makeNxNMatrix = (n: number, value: number = 0) => {
  return Array.from({ length: n }, (_, i) => i).map(() =>
    Array.from({ length: n }, (_, i) => i).map(() => {
      return value
    }),
  )
}

const isOutOfBounds = (row: number, col: number) => {
  return row < 0 || row >= HEIGHT || col < 0 || col >= WIDTH
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

function useWindowSize() {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

export default function Maze({
  agent,
  setAgent,
  error,
  observations,
  setObservations,
  reposition,
  setReposition,
  dimensions,
}) {
  const [dragging, setDragging] = useState(false)
  const [position, setPosition] = useState({ x: -1, y: -1 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [obstacles, setObstacles] = useState(obstacleArray)
  const [transitionMatrix, setTransitionMatrix] = useState(
    makeNxNMatrix(HEIGHT * WIDTH, 0),
  )
  const [observationMatrices, setObservationMatrices] = useState(
    {} as { [key: string]: number[][] },
  )

  const DIRECTIONS = [
    { row: -1, col: 0 }, // Up
    { row: 0, col: 1 }, // Right
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
  ]

  useEffect(() => {
    fillTransitionMatrix(transitionMatrix)
    fillObservationMatrices(obs)
    setAgent(getRandomAgent(WIDTH, HEIGHT))
  }, [])

  useEffect(() => {
    fillObservationMatrices(obs)
  }, [error])

  useEffect(() => {
    if (observations.length === 0) return
    const obs = observations[0]
    const newBeliefState = multiplyMatrixByArray(
      observationMatrices[obs],
      multiplyMatrixByArray(transitionMatrix, beliefState),
    )
    const sum = newBeliefState.reduce((acc, curr) => acc + curr, 0)
    const newBeliefStateNormalized = newBeliefState.map((prob) => prob / sum)

    setBeliefState(newBeliefStateNormalized)
  }, [observations])

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
    return DIRECTIONS.map((direction) => [
      row + direction.row,
      col + direction.col,
    ]).filter(
      ([newRow, newCol]) =>
        !isOutOfBounds(newRow, newCol) && !isObstacle(newRow, newCol),
    )
  }

  const fillTransitionMatrix = (transitionMatrix: number[][]) => {
    const PROB = 0.25
    for (let row = 0; row < HEIGHT; row++) {
      for (let col = 0; col < WIDTH; col++) {
        if (isObstacle(row, col)) continue
        const neighbours = getNeighbours(row, col)
        const currentCellIndex = row * WIDTH + col
        neighbours.forEach(([i, j]) => {
          const neighbourIndex = i * WIDTH + j
          transitionMatrix[neighbourIndex][currentCellIndex] = PROB
        })
        const remainingProb = 1 - PROB * neighbours.length
        transitionMatrix[currentCellIndex][currentCellIndex] = remainingProb
      }
    }
    setTransitionMatrix(transitionMatrix)
  }

  const fillObservationMatrix = (
    observationMatrix: number[][],
    discrepancies: number[],
  ): number[][] => {
    const sensorList: number[] = discrepancies.map(
      (num) => (1 - error) ** (4 - num) * error ** num,
    )

    return observationMatrix.map((row, rowIndex) =>
      row.map((_, colIndex) =>
        rowIndex === colIndex ? sensorList[rowIndex] : 0,
      ),
    )
  }

  const getObservation = (row: number, col: number): string => {
    return DIRECTIONS.map(({ row: dRow, col: dCol }, i) => {
      return isObstacle(row + dRow, col + dCol) ? '1' : '0'
    }).join('')
  }

  const getDiscrepancyOfCell = (
    row: number,
    col: number,
    observation: string,
  ): number => {
    let count = 0
    observation.split('').forEach((obs, i) => {
      const { row: dRow, col: dCol } = DIRECTIONS[i]
      const isNeighborObstacle = isObstacle(row + dRow, col + dCol)
      if (
        (obs === '0' && isNeighborObstacle) ||
        (obs === '1' && !isNeighborObstacle)
      ) {
        count++
      }
    })
    return count
  }

  const getDiscrepancies = (observation: string): number[] => {
    return Array.from({ length: HEIGHT * WIDTH }, (_, i) => i).map((cell) => {
      return getDiscrepancyOfCell(
        Math.floor(cell / WIDTH),
        cell % WIDTH,
        observation,
      )
    })
  }
  const obs = {} as { [key: string]: number[][] }

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

  const getRandomAgent = (width: number, height: number): [number, number] => {
    const pos = Math.floor(Math.random() * (width * height))
    const x = Math.floor(pos / width)
    const y = pos % width
    if (isObstacle(x, y)) {
      return getRandomAgent(width, height)
    }
    return [Math.floor(pos / width), pos % width]
  }
  useEffect(() => {
    if (reposition) {
      setAgent(getRandomAgent(WIDTH, HEIGHT))
      setReposition(false)
    }
  }, [reposition])

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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(true)
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
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
  const [ogWidth, setOgWidth] = useState(0)
  const [ogHeight, setOgHeight] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setOgWidth(ref.current ? ref.current?.offsetWidth : 0)
    setOgHeight(ref.current ? ref.current?.offsetHeight : 0)
  }, [ref.current])

  const getMazeWidth = (elemWidth: number | undefined, windowWidth: number): number | undefined=> {
    return ogWidth > windowWidth ? windowWidth : elemWidth
  }

  const getMazeHeight = (elemHeight: number | undefined, windowHeight: number): number | undefined => {
    return ogHeight > windowHeight ? windowHeight : elemHeight
  }

  return (
    <>
      <div
        className='text-center h-max w-max border border-gray-600 border-4 border-solid rounded-md absolute z-index-50'
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        ref={ref}
        style={{
          left: (ref.current) ? (ref.current?.offsetWidth + position.x < dimensions[0]) ? position.x : dimensions[0] - ref.current?.offsetWidth : 0, 
          top: position.y,
          width: getMazeWidth(ref.current?.offsetWidth, dimensions[0]),
          height: getMazeHeight(ref.current?.offsetHeight, dimensions[1]),
        }}
      >
        {Array.from({ length: HEIGHT }, (_, i) => i).map((row) => (
          <div className='h-12 flex' key={row}>
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
    </>
  )
}
