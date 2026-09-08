import { Sparkles, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { copy } from '../../copy'
import { DATE_CHIPS, districtOpen, formatRuDate, PORTAL_FLAVORS, type PortalId } from '../../logic'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { FONT, SPOTS } from '../layout'
import { playerPos } from '../playerRef'
import { WorldLabel } from '../WorldLabel'

function Arch({
  id,
  position,
  color,
  label,
}: {
  id: PortalId
  position: [number, number, number]
  color: string
  label: string
}) {
  const { state, patch } = useInvite()
  const open = districtOpen(state, 3) && !state.crashed
  const selected = state.portal === id

  useFrame(() => {
    if (!open || state.portal === 'custom') return
    if (state.portal && state.portal !== id) return
    const d = playerPos.distanceTo(new THREE.Vector3(...position))
    if (d < 0.85 && state.portal !== id) patch({ portal: id, flavor: '', customPlace: '' })
  })

  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[0.78, 0.06, 12, 36]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 2 : 1.1} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.7, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          transparent
          opacity={open ? 0.32 : 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      {open && <Sparkles count={10} scale={[1.3, 1.3, 0.35]} size={2.2} color={color} />}
      <Text font={FONT} position={[0, -1.05, 0]} fontSize={0.12} color="#fff4dc" anchorX="center">
        {label}
      </Text>
      <WorldLabel position={[0, -1.32, 0]} color={color} maxWidth={130}>
        {copy.portalNames[id].title}
      </WorldLabel>
    </group>
  )
}

export function PortalStation() {
  const { state, patch } = useInvite()
  const open = districtOpen(state, 3) && !state.crashed
  const flavors = state.portal && state.portal !== 'custom' ? PORTAL_FLAVORS[state.portal] : []
  const z = SPOTS.portalPlay[2]

  return (
    <>
      <Arch id="calm" position={SPOTS.portalCalm} color="#7ecbff" label="静" />
      <Arch id="play" position={SPOTS.portalPlay} color="#7dffb3" label="球" />
      <Arch id="japan" position={SPOTS.portalJapan} color="#ff8ad4" label="祭" />

      {open && (
        <Interactable
          id="custom-place"
          position={[2.05, 0, z - 1.05]}
          enabled={open}
          color="#c9b48a"
          radius={0.95}
          onInteract={() => patch({ portal: 'custom', flavor: '', compose: 'place', customPlace: state.customPlace })}
        >
          <mesh position={[0, 0.58, 0]}>
            <boxGeometry args={[0.36, 0.95, 0.07]} />
            <meshStandardMaterial color="#2a2018" />
          </mesh>
          <WorldLabel position={[0, 1.22, 0]} color="#c9b48a">
            своё место
          </WorldLabel>
        </Interactable>
      )}

      {open &&
        flavors.map((f, i) => (
          <Interactable
            key={f.id}
            id={`fl-${f.id}`}
            position={[-1.55 + i * 1.02, 0, z - 1.95]}
            enabled={open}
            color={f.hue}
            radius={0.82}
            onInteract={() => patch({ flavor: f.id, compose: null })}
          >
            <mesh position={[0, 0.36, 0]}>
              <icosahedronGeometry args={[0.16]} />
              <meshStandardMaterial
                color={f.hue}
                emissive={f.hue}
                emissiveIntensity={state.flavor === f.id ? 1.6 : 0.4}
              />
            </mesh>
            <WorldLabel position={[0, 0.68, 0]} color="#fff4dc" maxWidth={120} wrap>
              {f.id}
            </WorldLabel>
          </Interactable>
        ))}

      {open &&
        DATE_CHIPS.map((iso, i) => (
          <Interactable
            key={iso}
            id={`date-${iso}`}
            position={[-2.05 + i * 0.68, 0, z - 2.85]}
            color="#ffb020"
            radius={0.72}
            enabled={open}
            onInteract={() => patch({ date: iso })}
          >
            <mesh position={[0, 0.42, 0]}>
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshStandardMaterial
                color="#ffb020"
                emissive="#ff8a00"
                emissiveIntensity={state.date === iso ? 2 : 0.7}
              />
            </mesh>
            <WorldLabel position={[0, 0.7, 0]} color="#ffd27a" maxWidth={70}>
              {formatRuDate(iso).slice(0, 5)}
            </WorldLabel>
          </Interactable>
        ))}

      {open && (
        <>
          <Interactable
            id="slot-day"
            position={[-0.85, 0, z - 3.65]}
            color="#ffe066"
            enabled={open}
            radius={0.9}
            onInteract={() => patch({ slot: 'day' })}
          >
            <mesh position={[0, 0.45, 0]}>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial
                color="#ffe066"
                emissive="#ffb020"
                emissiveIntensity={state.slot === 'day' ? 2 : 0.5}
              />
            </mesh>
            <WorldLabel position={[0, 0.82, 0]} color="#ffe066">
              день
            </WorldLabel>
          </Interactable>
          <Interactable
            id="slot-eve"
            position={[0.85, 0, z - 3.65]}
            color="#7ecbff"
            enabled={open}
            radius={0.9}
            onInteract={() => patch({ slot: 'evening' })}
          >
            <mesh position={[0, 0.45, 0]}>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial
                color="#3a4a9a"
                emissive="#7ecbff"
                emissiveIntensity={state.slot === 'evening' ? 1.6 : 0.4}
              />
            </mesh>
            <WorldLabel position={[0, 0.82, 0]} color="#7ecbff">
              вечер
            </WorldLabel>
          </Interactable>
        </>
      )}
    </>
  )
}
