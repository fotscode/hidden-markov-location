type ObservationsProps = {
  observations: string[]
}
export default function Observations({ observations }: ObservationsProps) {
  return (
    <div className='flex flex-col justify-center my-5 items-center overflow-y-hidden h-2/6'>
      <p  hidden={observations.length === 0} className='text-3xl font-bold'>Observations</p>
      <ul className='mt-2 w-full text-center rounded-lg bg-gray-800 overflow-y-auto'>
        {observations.map((obs, i) => (
          <li key={i} className='text-lg p-2 border rounded-md'>
            {obs}
          </li>
        )).toReversed()}
      </ul>
    </div>
  )
}
