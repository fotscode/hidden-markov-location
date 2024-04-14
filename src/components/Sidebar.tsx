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
  setReposition,
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
      <section className='fixed inset-y-0 right-0 max-w-full flex m-0'>
        <div className='w-screen max-w-md bg-gray-500 bg-opacity-50 backdrop-blur-sm shadow-xl'>
          <div className='h-full flex flex-col pt-4 px-4 justify-between'>
            <div className="max-h-full">
              <div className='flex items-center justify-end gap-3'>
                  <Button
                    className='w-full'
                    color='secondary'
                    onClick={() => {
                      window.location.reload()
                    }}
                  >
                    Reiniciar
                  </Button>
                  <Button
                    className='w-full'
                    color='secondary'
                    onClick={() => {
                      setReposition(true)
                    }}
                  >
                    Reposicionar
                  </Button>
                <Button
                  isIconOnly
                  variant='solid'
                  color='secondary'
                  onClick={() => setHidden(true)}
                >
                  <span className='sr-only'>Close</span>
                  <CloseIcon color={'#fff'} />
                </Button>
              </div>
              <section className='flex flex-col justify-center items-center gap-1 mt-3 mx-1'>
                <div className='flex w-full gap-3 justify-center items-center'>

                <div className="flex flex-col gap-6 w-full max-w-md">
                  <Slider
                    key={"secondary"}
                    color={"secondary"}
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
                  value={parseFloat(error * 100).toFixed(0)}
                  onChange={handleErrorChange}
                  className='w-fit'
                  endContent={
                    <div className='pointer-events-none flex items-center'>
                      <span className='text-default-700 '>%</span>
                    </div>
                  }
                />
                </div>
              </section>
              <Observations observations={observations} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
