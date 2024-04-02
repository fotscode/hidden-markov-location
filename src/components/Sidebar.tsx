import { Dispatch, SetStateAction } from 'react'
import Observations from './Observations'
import { Button, Input, Slider } from '@nextui-org/react'
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
        <div className='w-screen max-w-md bg-gray-500 bg-opacity-50 backdrop-blur-sm shadow-xl'>
          <div className='h-full flex flex-col pt-4 px-4 justify-between'>
            <div>
              <div className='flex items-center justify-end'>
                <Button
                  isIconOnly
                  variant='light'
                  onClick={() => setHidden(true)}
                >
                  <span className='sr-only'>Close</span>
                  <CloseIcon color={'#fff'} />
                </Button>
              </div>
              <section className='flex flex-col justify-center items-center gap-1 mt-3'>
                <div className='flex justify-between w-full gap-3'>
                  <Button
                    className='w-full'
                    color='secondary'
                    onClick={() => {
                      window.location.reload()
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    className='w-full'
                    color='secondary'
                    onClick={() => {
                      setAgent(getRandomAgent())
                    }}
                  >
                    Reposicionar
                  </Button>
                </div>
                <div className="flex flex-col gap-6 w-full max-w-md">
                  <Slider
                    key={"danger"}
                    color={"danger"}
                    step={0.01}
                    maxValue={0.99}
                    minValue={0}
                    defaultValue={0.7}
                    aria-label="Error"
                    className="max-w-md"
                    value={error}
                    onChange={setError}
                  />
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
            </div>
            <Observations observations={observations} />
          </div>
        </div>
      </section>
    </div>
  )
}
