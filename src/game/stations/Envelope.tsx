import { Text } from '@react-three/drei'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { copy } from '../../copy'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { RU_FONT, SPOTS } from '../layout'
import { WorldLabel } from '../WorldLabel'

export function EnvelopeStation() {
  const { state, patch } = useInvite()
  return (
    <>
      <RigidBody type="fixed" colliders={false} position={SPOTS.envelope}>
        <CuboidCollider args={[0.4, 0.55, 0.16]} position={[0, 0.55, 0]} />
      </RigidBody>
      <Interactable
        id="envelope"
        position={SPOTS.envelope}
        color="#ffd27a"
        enabled={!state.letterOpen}
        radius={1.55}
        onInteract={() => patch({ letterOpen: true, phase: 'explore', toast: 'письмо висит прямо по курсу' })}
      >
        {!state.letterOpen && (
          <>
            <group rotation={[0.1, 0.15, 0.02]}>
              <mesh position={[0, 0.85, 0]}>
                <boxGeometry args={[0.72, 0.46, 0.04]} />
                <meshStandardMaterial color="#f4e4c1" emissive="#c9a227" emissiveIntensity={0.7} />
              </mesh>
            </group>
            <WorldLabel position={[0, 1.45, 0]} color="#ffd27a">
              письмо
            </WorldLabel>
          </>
        )}
      </Interactable>

      {state.letterOpen && (
        <group position={SPOTS.letter}>
          <pointLight color="#ffe6b0" intensity={1.4} distance={5} position={[0, 1.4, 0.4]} />
          <mesh position={[0, 1.22, 0]}>
            <boxGeometry args={[1.18, 1.85, 0.07]} />
            <meshStandardMaterial color="#4a2e18" />
          </mesh>
          <mesh position={[0, 1.22, 0.045]}>
            <planeGeometry args={[1.02, 1.64]} />
            <meshStandardMaterial color="#f7efe0" emissive="#f3e6d0" emissiveIntensity={0.18} />
          </mesh>
          <mesh position={[0, 2.18, 0.02]}>
            <cylinderGeometry args={[0.035, 0.035, 1.22, 10]} />
            <meshStandardMaterial color="#6a3a18" />
          </mesh>
          <Text
            font={RU_FONT}
            position={[0, 1.92, 0.06]}
            fontSize={0.072}
            color="#3a2418"
            maxWidth={0.9}
            lineHeight={1.28}
            anchorX="center"
            anchorY="top"
            overflowWrap="break-word"
            clipRect={[-0.48, -1.48, 0.48, 0.06]}
            textAlign="center"
          >
            {`${copy.letterTitle}\n\n${copy.letterBody.join('\n\n')}`}
          </Text>
        </group>
      )}
    </>
  )
}
