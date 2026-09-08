import { Canvas } from '@react-three/fiber'
import { Suspense, lazy, useEffect } from 'react'
import { bindInput } from './input'

const PhysicsWorld = lazy(() => import('./PhysicsWorld').then((m) => ({ default: m.PhysicsWorld })))

export function GameCanvas({ onReady }: { onReady: () => void }) {
  useEffect(() => bindInput(), [])
  useEffect(() => {
    onReady()
  }, [onReady])

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 40, position: [1.4, 2.8, 6.2], near: 0.12, far: 80 }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.08
        gl.setClearColor('#1c1428')
        onReady()
      }}
      gl={{ antialias: true, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
    >
      <Suspense fallback={null}>
        <PhysicsWorld />
      </Suspense>
    </Canvas>
  )
}
