import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense, useEffect } from 'react'
import { bindInput } from './input'
import { InteractionDriver } from './Interactable'
import { Player } from './Player'
import { Plaza } from './Plaza'
import { ArcadeStations } from './stations/Arcade'
import { BoardStation } from './stations/Board'
import { DoorStations } from './stations/Doors'
import { EnvelopeStation } from './stations/Envelope'
import { MailboxStation } from './stations/Mailbox'
import { PortalStation } from './stations/Portals'

export function GameCanvas({ onReady }: { onReady: () => void }) {
  useEffect(() => bindInput(), [])

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 50, position: [0, 4.2, 18], near: 0.1, far: 90 }}
      onCreated={({ gl }) => {
        gl.setClearColor('#07061a')
        onReady()
      }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <Physics gravity={[0, -16, 0]}>
          <Plaza />
          <Player />
          <EnvelopeStation />
          <ArcadeStations />
          <DoorStations />
          <BoardStation />
          <PortalStation />
          <MailboxStation />
        </Physics>
        <InteractionDriver />
      </Suspense>
    </Canvas>
  )
}

