import { Dispatch, SetStateAction } from 'react'
import Observations from './Observations'
import { Button, Input } from '@nextui-org/react'
import { CloseIcon } from './CloseIcon'

type SidebarProps = {
  observations: string[]
  hidden: boolean
  setAgent: Dispatch<SetStateAction<number[]>>
  setHidden: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<number>>
  getRandomAgent: () => [number, number]
  error: number
}
export default function Sidebar({
  observations,
  hidden,
  error,
  setError,
  setAgent,
  setHidden,
  getRandomAgent,
}: SidebarProps) {
  const handleErrorChange = (e: any) => {
    if (e.target.value === '') {
      setError(0)
      return
    }
    if (isNaN(parseInt(e.target.value)) || parseInt(e.target.value) > 99) return
    setError(parseInt(e.target.value) / 100)
  }
  return (
    <div hidden={hidden}>
      <section className='absolute inset-y-0 right-0 max-w-full flex m-0'>
        <div className='w-screen max-w-md'>
          <div className='h-full flex flex-col pt-4 bg-gray-500 bg-opacity-50 backdrop-blur-sm shadow-xl px-4 justify-between'>
            <div className='flex items-center justify-end'>
              <Button
                isIconOnly
                variant='light'
                onClick={() => setHidden(true)}
              >
                <span className='sr-only'>Close</span>
                <CloseIcon color={'#fff'}/>
              </Button>
            </div>
            <section className='flex flex-col justify-center items-center gap-1 mt-3'>
              <div className='flex justify-between w-full gap-3'>
                <Button
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
                  onClick={() => {
                    window.location.reload()
                  }}
                >
                  Reset
                </Button>
                <Button
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
                  onClick={() => {
                    setAgent(getRandomAgent())
                  }}
                >
                  Kidnap
                </Button>
              </div>
              <Input
                type='number'
                min='0'
                max='99'
                label='Error'
                value={error * 100}
                onChange={handleErrorChange}
                endContent={
                  <div className='pointer-events-none flex items-center'>
                    <span className='text-default-700 '>%</span>
                  </div>
                }
              />
            </section>
            <Observations observations={observations} />
          </div>
        </div>
      </section>
    </div>
  )
}
