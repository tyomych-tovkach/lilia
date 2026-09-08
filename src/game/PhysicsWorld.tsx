import { Physics } from '@react-three/rapier'
import { InteractionDriver } from './Interactable'
import { Player } from './Player'
import { World } from './World'

export function PhysicsWorld() {
  return (
    <Physics gravity={[0, -22, 0]}>
      <World />
      <Player />
      <InteractionDriver />
    </Physics>
  )
}
