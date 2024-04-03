'use client'
import Maze from '@/components/Maze'
import Sidebar from '@/components/Sidebar'
import { Button } from '@nextui-org/react'
import SidebarIcon from '@/components/SidebarIcon'
import { useEffect, useState } from 'react'

export default function Home() {
  const ERROR = 0.02
  const [hidden, setHidden] = useState(true)
  const [agent, setAgent] = useState([0, 0])
  const [error, setError] = useState(ERROR)
  const [observations, setObservations] = useState([] as string[])
  const [reposition, setReposition] = useState(false)

  return (
    <main className='min-h-screen'>
      <Maze agent={agent} setAgent={setAgent} error={error} setError={setError} observations={observations} setObservations={setObservations} reposition={reposition} setReposition={setReposition}/>
      {hidden && (
        <Button
          isIconOnly
          variant='light'
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
