import { useEffect, useState } from 'react'
import MazeCell from './MazeCell'
import { MazeControls } from './MazeControls'
const makeNxNMatrix = (n: number, value: number = 0) => {
  return Array.from({ length: n }, (_, i) => i).map(() =>
    Array.from({ length: n }, (_, i) => i).map(() => {
      return value
    }),
  )
}

export default function Maze() {
  const WIDTH = 16
  const HEIGHT = 4
  const ERROR = 0.2
  const [obstacles, setObstacles] = useState([
    4, 10, 14, 16, 17, 20, 22, 23, 25, 27, 29, 30, 31, 32, 36, 38, 39, 45, 46,
    50, 54, 59,
  ])
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
        const prob = numNeighbours > 0 ? 1 / numNeighbours : 0
        neighbours.forEach(([i, j]) => {
          transitionMatrix[i * WIDTH + j][row * WIDTH + col] = prob
        })
      }
    }
    setTransitionMatrix(transitionMatrix)
    console.log('fill,', transitionMatrix)
  }

  const fillObservationMatrix = (
    observationMatrix: number[][],
    discrepancies: number[],
  ): number[][] => {
    let sensorList = []
    for (let num of discrepancies) {
      let prob = (1 - ERROR) ** (4 - num) * ERROR ** num
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

  //const transitionMatrix: number[] = Array.from({ length: HEIGHT * WIDTH })
  //const fillTranstionMatrix = (transitionMatrix: number[]) => {
  //  for (let row = 0; row < HEIGHT; row++) {
  //    for (let col = 0; col < WIDTH; col++) {
  //      const neighbours = getNeighbours(row, col)
  //      const numNeighbours = neighbours.length
  //      prob = numNeighbours > 0 ? 1 / numNeighbours : 0
  //      transitionMatrix[row * WIDTH + col] = prob
  //    }
  //  }
  //}
  //fillTranstionMatrix(transitionMatrix)
  const getDiscrepancieOfCell = (
    row: number,
    col: number,
    observation: string,
  ): number => {
    let count = 0
    const neighbours = getNeighbours(row, col)
    //count += 4 - neighbours.length
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
    const obs = observations[observations.length - 1]
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

  return (
    <div>
      <div className='not-content text-center mt-[1.5rem]  w-max mx-auto border border-gray-600 border-4 border-solid rounded-md'>
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
      <div className='flex flex-col justify-center mt-5 items-center'>
        <p className='text-4xl font-bold'>Observations:</p>
        <ul className='mt-2 w-full text-center rounded-lg bg-gray-800'>
          {observations.map((obs, i) => (
            <li key={i} className='text-lg p-2 border rounded-md'>
              {obs}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
