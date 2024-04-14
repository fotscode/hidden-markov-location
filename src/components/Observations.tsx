import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/react'

type ObservationsProps = {
  observations: string[]
}
const gridToObsMap = {
  1: 0,
  5: 1,
  7: 2,
  3: 3,
}

const checkObstacle = (observation: string, i: number) => {
  if (observation[gridToObsMap[i]] == '1') {
    return 'bg-secondary text-white'
  } else if (observation[gridToObsMap[i]] == '0') {
    return 'bg-gray-700 text-white'
  } else if (i == 4) {
    return 'bg-gray-900 text-white'
  }
  return 'bg-transparent text-white border-transparent'
}

const makeRepresentationGrid = (observation: string) => {
  return (
    <div className=' text-center text-black grid grid-cols-3 grid-rows-3 rounded-md w-full'>
      {Array.from({ length: 9 }, (_, i) => i).map((i) => {
        return (
          <div
            key={i}
            className={`h-fit border border-secondary rounded-md ${checkObstacle(observation, i)} `}
          >
            {observation[gridToObsMap[i]]}
            {i === 4 ? '🤖' : ''}
          </div>
        )
      })}
    </div>
  )
}

const makeObservation = (observation: string) => {
  return (
    <p className='bg-gray-900 text-white p-2 mx-auto w-max rounded-md'>
      {observation}
    </p>
  )
}

export default function Observations({ observations }: ObservationsProps) {
  const rows = observations.map((obs, i) => ({
    key: i,
    observation: makeObservation(obs),
    representation: makeRepresentationGrid(obs),
  }))

  const columns = [
    {
      key: 'observation',
      label: 'Observación',
    },
    {
      key: 'representation',
      label: 'Representación',
    },
  ]
  const classNames = {
    table: 'bg-gray-900 text-white rounded-md text-center',
    th: 'bg-gray-900 text-white text-center text-md pt-1',
    tbody: 'bg-gray-800 text-white',
  }
  return (
    <div
      className='overflow-y-auto mt-2 mb-2'
      style={{
        height: 'calc(100vh - 150px)',
      }}
    >
      {observations.length > 0 && (
        <Table
          aria-label='Example table with dynamic content'
          removeWrapper
          color='secondary'
          classNames={classNames}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(row, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
