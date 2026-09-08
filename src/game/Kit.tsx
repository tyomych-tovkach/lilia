import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'

const BASE = './models'

export function Kit({
  file,
  position,
  rotation,
  scale = 1.7,
  castShadow = false,
}: {
  file: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  castShadow?: boolean
}) {
  const { scene } = useGLTF(`${BASE}/${file}`)
  const clone = useMemo(() => scene.clone(true), [scene])
  return (
    <primitive
      object={clone}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow={castShadow}
    />
  )
}

;[
  'arcade-machine.glb',
  'claw-machine.glb',
  'dance-machine.glb',
  'gambling-machine.glb',
  'basketball-game.glb',
  'vending-machine.glb',
  'prize-wheel.glb',
  'column.glb',
  'wall.glb',
  'wall-door-rotate.glb',
  'character-gamer.glb',
  'character-employee.glb',
  'prizes.glb',
  'pinball.glb',
  'air-hockey.glb',
  'ticket-machine.glb',
].forEach((f) => useGLTF.preload(`${BASE}/${f}`))
