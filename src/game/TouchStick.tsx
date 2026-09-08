import { useEffect, useState, type PointerEvent } from 'react'
import { stick } from './input'

export function TouchStick() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(true)
    window.addEventListener('touchstart', on, { once: true })
    return () => window.removeEventListener('touchstart', on)
  }, [])
  if (!show) return null
  return <StickPad />
}

function StickPad() {
  const aim = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 2 - 1
    const y = ((e.clientY - r.top) / r.height) * 2 - 1
    stick.set(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, -y)))
  }

  return (
    <div
      className="stick"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        aim(e)
      }}
      onPointerMove={(e) => {
        if (e.buttons) aim(e)
      }}
      onPointerUp={() => stick.end()}
    />
  )
}
