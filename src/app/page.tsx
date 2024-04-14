'use client'
import Maze from '@/components/Maze'
import Sidebar from '@/components/Sidebar'
import { Button } from '@nextui-org/react'
import SidebarIcon from '@/components/SidebarIcon'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

function useWindowSize() {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

export default function Home() {
  const ERROR = 0.02
  const [hidden, setHidden] = useState(true)
  const [agent, setAgent] = useState([0, 0])
  const [error, setError] = useState(ERROR)
  const [observations, setObservations] = useState([] as string[])
  const [reposition, setReposition] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)
  const mainRef = useRef<HTMLDivElement>(null)
  const [windowWidth, windowHeight] = useWindowSize()

  useLayoutEffect(() => {
    setScreenWidth(mainRef.current ? mainRef.current?.offsetWidth : 0)
    setScreenHeight(mainRef.current ? mainRef.current?.offsetHeight : 0)
  }, [windowWidth, windowHeight])

  useEffect(() => {
    window.addEventListener('orientationchange', () => {
      window.location.reload()
      })
    return () => {
      window.removeEventListener('orientationchange', () => {
        window.location.reload()
      })
    }
  }, [])

  return (
    <main className='h-screen w-screen' ref={mainRef}>
      <Maze
        dimensions={[screenWidth, screenHeight]}
        agent={agent}
        setAgent={setAgent}
        error={error}
        observations={observations}
        setObservations={setObservations}
        reposition={reposition}
        setReposition={setReposition}
      />
      {hidden && (
        <Button
          isIconOnly
          color='secondary'
          variant='solid'
          className='absolute top-0 right-0 mr-4 mt-4 p-1'
          onClick={() => setHidden(!hidden)}
        >
          <SidebarIcon color={'#fff'} />
        </Button>
      )}
      <Sidebar
        observations={observations}
        hidden={hidden}
        setHidden={setHidden}
        setAgent={setAgent}
        setReposition={setReposition}
        error={error}
        setError={setError}
      />
    </main>
  )
}
