import React, { useEffect } from 'react'

import { ReactChildComponent } from './ReactChildComponent'

interface ReactComponentProps {
  title: string
  onClick: () => void
  children: any
}

export const ReactComponent = (props: ReactComponentProps) => {
  const { children, title, onClick } = props
  useEffect(() => {
    console.log('test')
    const timeoutId = setTimeout(() => {
      console.log('timeout')
    }, 5000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    console.log('title changed')
  }, [title])

  return (
    <div>
      <button onClick={onClick}>{title}</button>
      {children}
      <ReactChildComponent title="REACT CHILD" onClick={() => console.log('child click')} />
    </div>
  )
}
