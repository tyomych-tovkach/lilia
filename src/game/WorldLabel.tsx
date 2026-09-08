import { Html } from '@react-three/drei'
import type { CSSProperties, ReactNode } from 'react'

export function WorldLabel({
  children,
  position = [0, 0, 0],
  color = '#fff4dc',
  maxWidth = 150,
  wrap = false,
}: {
  children: ReactNode
  position?: [number, number, number]
  color?: string
  maxWidth?: number
  wrap?: boolean
}) {
  const style: CSSProperties = {
    maxWidth,
    maxHeight: wrap ? 72 : 22,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: wrap ? 'normal' : 'nowrap',
    color,
    fontFamily: "Manrope, 'Noto Sans JP', sans-serif",
    fontSize: 13,
    fontWeight: 650,
    lineHeight: 1.2,
    pointerEvents: 'none',
    textAlign: 'center',
    textShadow: '0 1px 6px #050414',
    userSelect: 'none',
  }
  return (
    <Html position={position} center distanceFactor={7} style={style} sprite wrapperClass="world-label">
      {children}
    </Html>
  )
}

export function FramedHtml({
  children,
  position,
  className,
  width,
  height,
}: {
  children: ReactNode
  position: [number, number, number]
  className: string
  width: number
  height: number
}) {
  return (
    <Html
      transform
      occlude={false}
      position={position}
      distanceFactor={1.45}
      style={{ width, height, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <div className={className}>{children}</div>
    </Html>
  )
}
