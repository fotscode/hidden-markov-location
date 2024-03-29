import { useEffect, useState } from 'react'
import MazeCell from './MazeCell'
import { MazeControls } from './MazeControls'

export default function Maze() {
  const WIDTH = 16
  const HEIGHT = 4
  const ERROR = 0.2
  const [prob, setProb] = useState(0.0)
  const [obstacles, setObstacles] = useState([
    4, 10, 14, 16, 17, 20, 22, 23, 25, 27, 29, 30, 31, 32, 36, 38, 39, 45, 46,
    50, 54, 59,
  ])
  const [agent, setAgent] = useState([0, 0])
  const [observations, setObservations] = useState([] as string[])
  // make a maze
  // obstacles map with height and width

  const isObstacle = (row: number, col: number) => {
    return (
      obstacles.some((pos) => row * WIDTH + col === pos) ||
      isOutOfBounds(row, col)
    )
  }

  const isOutOfBounds = (row: number, col: number) => {
    return row < 0 || row >= HEIGHT || col < 0 || col >= WIDTH
  }

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

  const getObservation = (row: number, col: number): string => {
    let observation = ['0', '0', '0', '0']
    if (row > 0 && !isObstacle(row - 1, col)) {
      observation[0] = '1'
    }
    if (col < WIDTH - 1 && !isObstacle(row, col + 1)) {
      observation[1] = '1'
    }
    if (row < HEIGHT - 1 && !isObstacle(row + 1, col)) {
      observation[2] = '1'
    }
    if (col > 0 && !isObstacle(row, col - 1)) {
      observation[3] = '1'
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

  useEffect(() => {
    setProb(1 / (WIDTH * HEIGHT - obstacles.length))
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

  return (
    <div>
      <div className='not-content text-center mt-[1.5rem]  w-max mx-auto border border-gray-600 border-4 border-solid rounded-md'>
        {Array.from({ length: HEIGHT }, (_, i) => i).map((row) => (
          <div className='h-8' key={row}>
            {Array.from({ length: WIDTH }, (_, i) => i).map((col) => (
              <MazeCell
                isObstacle={isObstacle(row, col)}
                isAgent={agent[0] === row && agent[1] === col}
                row={row}
                col={col}
                //prob={(row * WIDTH + col) / (WIDTH * HEIGHT - 1)}
                prob={prob}
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
        <ul className="mt-2 w-full text-center rounded-lg bg-gray-800">
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
