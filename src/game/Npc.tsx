import { copy, npcs } from '../content/evening'
import type { LocationId } from '../content/types'
import { RuSign } from './Craft'
import { Interactable } from './Interactable'
import { emitTalk } from './talkBus'

function Prop({ loc }: { loc: LocationId }) {
  if (loc === 'hub') {
    return (
      <mesh position={[0.18, 0.92, 0.16]} rotation={[0.4, 0.2, 0.1]}>
        <boxGeometry args={[0.16, 0.02, 0.22]} />
        <meshStandardMaterial color="#f4ead8" />
      </mesh>
    )
  }
  if (loc === 'letter') {
    return (
      <mesh position={[0.16, 0.88, 0.18]} rotation={[0.5, 0.3, 0]}>
        <boxGeometry args={[0.14, 0.02, 0.1]} />
        <meshStandardMaterial color="#f7f0e4" />
      </mesh>
    )
  }
  if (loc === 'japan') {
    return (
      <group position={[0.22, 0.86, 0.12]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.08, 0.02, 12]} />
          <meshStandardMaterial color="#5a3a28" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.04, 0.035, 0.06, 10]} />
          <meshStandardMaterial color="#f4ead8" />
        </mesh>
      </group>
    )
  }
  if (loc === 'sport') {
    return (
      <group>
        <mesh position={[0.24, 0.9, 0.08]}>
          <torusGeometry args={[0.05, 0.012, 8, 16]} />
          <meshStandardMaterial color="#f4ead8" />
        </mesh>
        <mesh position={[-0.22, 0.55, 0.12]}>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial color="#e8782c" />
        </mesh>
      </group>
    )
  }
  if (loc === 'secret') {
    return (
      <mesh position={[0.2, 0.9, 0.14]} rotation={[0.3, 0.2, 0.2]}>
        <boxGeometry args={[0.12, 0.02, 0.16]} />
        <meshStandardMaterial color="#3a2a6a" />
      </mesh>
    )
  }
  if (loc === 'yesno') {
    return (
      <mesh position={[0.18, 0.88, 0.16]} rotation={[0.2, 0, 0.1]}>
        <boxGeometry args={[0.16, 0.01, 0.08]} />
        <meshStandardMaterial color="#ffd27a" />
      </mesh>
    )
  }
  if (loc === 'date') {
    return (
      <mesh position={[0.2, 0.9, 0.14]} rotation={[0.5, 0.1, 0]}>
        <boxGeometry args={[0.14, 0.02, 0.18]} />
        <meshStandardMaterial color="#c4a070" />
      </mesh>
    )
  }
  if (loc === 'send') {
    return (
      <mesh position={[0, 0.72, -0.18]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.22, 0.18, 0.08]} />
        <meshStandardMaterial color="#3a5a8a" />
      </mesh>
    )
  }
  if (loc === 'kubgu') {
    return (
      <mesh position={[0, 0.55, -0.16]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.16, 0.22, 0.08]} />
        <meshStandardMaterial color="#4a5a7a" />
      </mesh>
    )
  }
  return (
    <mesh position={[0, 0.95, 0.02]}>
      <boxGeometry args={[0.28, 0.06, 0.22]} />
      <meshStandardMaterial color="#1a4a32" />
    </mesh>
  )
}

export function Npc({
  loc,
  position,
}: {
  loc: LocationId
  position: [number, number, number]
}) {
  const cast =
    loc === 'hub'
      ? npcs.tanya
      : loc === 'letter'
        ? npcs.sonya
        : loc === 'japan'
          ? npcs.aya
          : loc === 'sport'
            ? npcs.rita
            : loc === 'secret'
              ? npcs.nina
              : loc === 'yesno'
                ? npcs.olya
                : loc === 'date'
                  ? npcs.katya
                  : loc === 'send'
                    ? npcs.gena
                    : loc === 'kubgu'
                      ? npcs.max
                      : npcs.lena

  const wide = loc === 'sport' || loc === 'send' || loc === 'vkusno'
  return (
    <Interactable id={`npc-${loc}`} position={position} radius={1.7} color={cast.accent} prompt={copy.talkPrompt} onInteract={() => emitTalk(loc)}>
      <group>
        <mesh position={[0, 0.22, 0]}>
          <capsuleGeometry args={[0.09, 0.28, 4, 8]} />
          <meshStandardMaterial color={cast.skin} />
        </mesh>
        <mesh position={[0, 0.7, 0]} scale={[wide ? 1.15 : 1, 1.15, 0.85]}>
          <sphereGeometry args={[0.22, 14, 12]} />
          <meshStandardMaterial color={cast.cloth} roughness={0.45} />
        </mesh>
        <mesh position={[-0.22, 0.78, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.055, 0.22, 4, 8]} />
          <meshStandardMaterial color={cast.cloth} />
        </mesh>
        <mesh position={[0.22, 0.78, 0]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.055, 0.22, 4, 8]} />
          <meshStandardMaterial color={cast.cloth} />
        </mesh>
        <mesh position={[0, 1.08, 0.02]}>
          <sphereGeometry args={[0.15, 16, 14]} />
          <meshStandardMaterial color={cast.skin} />
        </mesh>
        <mesh position={[0, loc === 'sport' ? 1.2 : 1.16, 0.02]} scale={[1.15, loc === 'yesno' ? 0.85 : 0.7, 1.15]}>
          <sphereGeometry args={[0.16, 12, 10]} />
          <meshStandardMaterial color={cast.hair} />
        </mesh>
        {loc === 'yesno' && (
          <mesh position={[0.16, 1.08, 0.04]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={cast.hair} />
          </mesh>
        )}
        {loc === 'send' && (
          <mesh position={[0, 1.22, 0.02]}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        )}
        <mesh position={[-0.04, 1.1, 0.13]}>
          <sphereGeometry args={[0.028, 10, 8]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0.04, 1.1, 0.13]}>
          <sphereGeometry args={[0.028, 10, 8]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[-0.04, 1.1, 0.15]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color="#1a0c08" />
        </mesh>
        <mesh position={[0.04, 1.1, 0.15]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color="#1a0c08" />
        </mesh>
        <Prop loc={loc} />
        <RuSign text={cast.name} position={[0, 1.98, 0]} size={0.14} color={cast.accent} />
      </group>
    </Interactable>
  )
}
