import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { copy } from '../../copy'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { SPOTS } from '../layout'
import { FramedHtml, WorldLabel } from '../WorldLabel'

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
        radius={1.45}
        onInteract={() => patch({ letterOpen: true, phase: 'explore', toast: '' })}
      >
        <group rotation={[0.1, 0.15, 0.02]}>
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[0.72, 0.46, 0.04]} />
            <meshStandardMaterial color="#f4e4c1" emissive="#c9a227" emissiveIntensity={0.45} />
          </mesh>
        </group>
        {!state.letterOpen && (
          <WorldLabel position={[0, 1.45, 0]} color="#ffd27a">
            письмо
          </WorldLabel>
        )}
      </Interactable>

      {state.letterOpen && (
        <group position={SPOTS.letter} rotation={[0, -0.55, 0]}>
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[1.12, 1.72, 0.06]} />
            <meshStandardMaterial color="#5a3a22" />
          </mesh>
          <mesh position={[0, 1.15, 0.04]}>
            <planeGeometry args={[0.98, 1.52]} />
            <meshStandardMaterial color="#f7efe0" />
          </mesh>
          <FramedHtml position={[0, 1.15, 0.05]} className="letter-card" width={200} height={310}>
            <p className="letter-title">{copy.letterTitle}</p>
            {copy.letterBody.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </FramedHtml>
        </group>
      )}
    </>
  )
}
