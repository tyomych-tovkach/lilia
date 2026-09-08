import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { copy } from '../../copy'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { Kit } from '../Kit'
import { SPOTS } from '../layout'

export function DoorStations() {
  const { state, patch } = useInvite()
  const ready = state.letterOpen

  return (
    <>
      <RigidBody type="fixed" colliders={false} position={SPOTS.kubgu}>
        <CuboidCollider args={[0.6, 1.3, 0.2]} position={[0, 1.2, 0]} />
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={SPOTS.vkusno}>
        <CuboidCollider args={[0.6, 1.3, 0.2]} position={[0, 1.2, 0]} />
      </RigidBody>
      <Kit file="wall-door-rotate.glb" position={SPOTS.kubgu} scale={1.7} rotation={[0, Math.PI / 2, 0]} />
      <Kit file="wall-door-rotate.glb" position={SPOTS.vkusno} scale={1.7} rotation={[0, -Math.PI / 2, 0]} />

      <Interactable
        id="door-kubgu"
        position={SPOTS.kubgu}
        color="#c9b48a"
        enabled={ready}
        onInteract={() => patch({ toast: copy.easterKubsu })}
      >
        <mesh />
      </Interactable>
      <Interactable
        id="door-vkusno"
        position={SPOTS.vkusno}
        color="#c9b48a"
        enabled={ready}
        onInteract={() => patch({ toast: copy.easterVkusno })}
      >
        <mesh />
      </Interactable>
    </>
  )
}
