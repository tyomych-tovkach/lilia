import { npcs } from '../content/evening'
import type { LocationId } from '../content/types'
import { Interactable } from './Interactable'
import { emitTalk } from './talkBus'

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

  return (
    <Interactable id={`npc-${loc}`} position={position} radius={1.7} color={cast.accent} onInteract={() => emitTalk(loc)}>
      <group>
        <mesh position={[0, 0.22, 0]}>
          <capsuleGeometry args={[0.09, 0.28, 4, 8]} />
          <meshStandardMaterial color={cast.skin} />
        </mesh>
        <mesh position={[0, 0.7, 0]} scale={[1, 1.15, 0.85]}>
          <sphereGeometry args={[0.22, 14, 12]} />
          <meshStandardMaterial color={cast.cloth} roughness={0.45} />
        </mesh>
        <mesh position={[-0.22, 0.78, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.04, 0.28, 4, 8]} />
          <meshStandardMaterial color={cast.skin} />
        </mesh>
        <mesh position={[0.22, 0.78, 0]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.04, 0.28, 4, 8]} />
          <meshStandardMaterial color={cast.skin} />
        </mesh>
        <mesh position={[0, 1.08, 0.02]}>
          <sphereGeometry args={[0.15, 16, 14]} />
          <meshStandardMaterial color={cast.skin} />
        </mesh>
        <mesh position={[0, 1.16, 0.02]} scale={[1.15, 0.7, 1.15]}>
          <sphereGeometry args={[0.16, 12, 10]} />
          <meshStandardMaterial color={cast.hair} />
        </mesh>
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
      </group>
    </Interactable>
  )
}
