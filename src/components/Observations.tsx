type ObservationsProps = {
  observations: string[]
}
export default function Observations({ observations }: ObservationsProps) {
  console.log(observations.length === 0)
  return (
    <div className='flex flex-col justify-center mt-5 items-center'>
      <p  hidden={observations.length === 0} className='text-4xl font-bold text-black'>Observations:</p>
      <ul className='mt-2 w-full text-center rounded-lg bg-gray-800'>
        {observations.map((obs, i) => (
          <li key={i} className='text-lg p-2 border rounded-md'>
            {obs}
          </li>
        )).toReversed()}
      </ul>
    </div>
  )
}
