import React, { useEffect } from 'react'

interface ReactChildComponentProps {
  title: string
  onClick: () => void
}

export const ReactChildComponent = (props: ReactChildComponentProps) => {
  const { title, onClick } = props
  useEffect(() => {
    console.log('react child')
  }, [])

  return (
    <div>
      <button onClick={onClick}>{title}</button>
    </div>
  )
}
