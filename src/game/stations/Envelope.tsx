import { Text } from '@react-three/drei'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { copy } from '../../copy'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { SPOTS } from '../layout'

export function EnvelopeStation() {
  const { state, patch } = useInvite()
  return (
    <>
      <RigidBody type="fixed" colliders={false} position={SPOTS.envelope}>
        <CuboidCollider args={[0.7, 0.8, 0.25]} position={[0, 0.8, 0]} />
      </RigidBody>
      <Interactable
        id="envelope"
        position={SPOTS.envelope}
        color="#ffd27a"
        enabled={!state.letterOpen}
        onInteract={() => patch({ letterOpen: true, phase: 'explore', toast: '' })}
      >
        <group rotation={[0.15, 0.4, 0.05]}>
          <mesh position={[0, 1.05, 0]}>
            <boxGeometry args={[1.15, 0.72, 0.06]} />
            <meshStandardMaterial color="#f4e4c1" emissive="#c9a227" emissiveIntensity={0.45} />
          </mesh>
          <mesh position={[0, 1.18, 0.04]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.72, 0.72]} />
            <meshStandardMaterial color="#e8c96a" emissive="#aa7a12" emissiveIntensity={0.35} />
          </mesh>
        </group>
      </Interactable>

      {state.letterOpen && (
        <group position={[0, 1.35, 6.2]}>
          <mesh>
            <planeGeometry args={[2.8, 2.1]} />
            <meshStandardMaterial color="#f7efe0" />
          </mesh>
          <Text
            position={[0, 0.55, 0.02]}
            fontSize={0.14}
            color="#3a2418"
            maxWidth={2.4}
            lineHeight={1.35}
            anchorX="center"
            anchorY="top"
          >
            {`${copy.letterTitle}\n\n${copy.letterBody.join('\n\n')}`}
          </Text>
        </group>
      )}
    </>
  )
}
