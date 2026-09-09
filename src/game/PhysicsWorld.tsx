import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import { InteractionDriver } from './Interactable'
import { Player } from './Player'
import { World } from './World'

export function PhysicsWorld() {
  return (
    <Physics gravity={[0, -22, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[48, 0.25, 48]} position={[0, -0.25, 0]} />
      </RigidBody>
      <World />
      <Player />
      <InteractionDriver />
    </Physics>
  )
}
