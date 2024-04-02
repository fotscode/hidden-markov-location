import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";

type ObservationsProps = {
  observations: string[]
}
const gridToObsMap = {
  1: 0,
  5: 1,
  7: 2,
  3: 3
}

const checkObstacle = (observation: string, i: number) => {
    if (observation[gridToObsMap[i]] == '1') {
      return 'bg-blue-500'
    } 
    return 'bg-gray-200'
}


const makeRepresentationGrid = (observation: string) => {
  return (
    <div className=' text-center text-black grid grid-cols-3 grid-rows-3'>
      {Array.from({ length: 9 }, (_, i) => i).map((i) => {
        return (
          <div
            key={i}
            className={`h-5 border border-gray-500 ${checkObstacle(observation, i)}`}
          >{observation[gridToObsMap[i]]}</div>
        )
      })}
    </div>
  )
}
    

export default function Observations({ observations }: ObservationsProps) {
  const rows = observations.map((obs, i) => ({
    key: i,
    observation: obs,
    representation: makeRepresentationGrid(obs)
  }))

  const columns = [
    {
      key: "observation",
      label: "Observación",
    },
    {
      key: "representation",
      label: "Representación",
    }
  ]
  const classNames = {
    table: 'bg-transparent',
    header: 'bg-transparent',
    body: 'bg-transparent',
    row: 'bg-transparent',
    cell: 'bg-transparent'
  }
  return (
    <div className='h-4/6 overflow-y-auto mt-2 mb-2' >
      <Table aria-label="Example table with dynamic content" removeWrapper classNames={classNames}>
        <TableHeader>
          {columns.map((column) =>
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody >
          {rows.map((row) =>
            <TableRow key={row.key}>
              {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
