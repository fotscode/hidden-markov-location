import { Dispatch, SetStateAction } from 'react'
import Observations from './Observations'

type SidebarProps = {
  observations: string[]
  hidden: boolean
  setHidden: Dispatch<SetStateAction<boolean>>
}
export default function Sidebar({
  observations,
  hidden,
  setHidden,
}: SidebarProps) {
  return (
    <>
      <div hidden={hidden}>
        <section className='absolute inset-y-0 right-0 pl-10 max-w-full flex'>
          <div className='w-screen max-w-md'>
            <div className='h-full flex flex-col py-6 bg-white shadow-xl p-5'>
              <div className='flex items-center justify-end px-4'>
                <button
                  className='text-gray-500 hover:text-gray-700 '
                  onClick={() => setHidden(true)}
                >
                  <span className='sr-only'>Close</span>
                  <svg
                    className='h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M6 18L18 6M6 6l12 12'
                    ></path>
                  </svg>
                </button>
              </div>
              <Observations observations={observations} />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
