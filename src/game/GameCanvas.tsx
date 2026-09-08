import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense, useEffect } from 'react'
import { bindInput } from './input'
import { InteractionDriver } from './Interactable'
import { Player } from './Player'
import { World } from './World'

export function GameCanvas({ onReady }: { onReady: () => void }) {
  useEffect(() => bindInput(), [])

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ fov: 40, position: [1.4, 2.8, 6.2], near: 0.12, far: 80 }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.08
        gl.setClearColor('#1c1428')
        onReady()
      }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <Physics gravity={[0, -22, 0]}>
          <World />
          <Player />
        </Physics>
        <InteractionDriver />
      </Suspense>
    </Canvas>
  )
}
