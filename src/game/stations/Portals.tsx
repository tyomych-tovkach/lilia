import { Sparkles, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DATE_CHIPS, formatRuDate, PORTAL_FLAVORS, type PortalId } from '../../logic'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { SPOTS } from '../layout'
import { playerPos } from '../playerRef'

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
  const open = state.saidYes && !state.crashed
  const selected = state.portal === id

  useFrame(() => {
    if (!open || state.portal === 'custom') return
    if (state.portal && state.portal !== id) return
    const d = playerPos.distanceTo(new THREE.Vector3(...position))
    if (d < 1.15 && state.portal !== id) patch({ portal: id, flavor: '', customPlace: '' })
  })

  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[1.25, 0.08, 12, 48]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 2 : 1.1} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.12, 28]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          transparent
          opacity={open ? 0.32 : 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      {open && <Sparkles count={20} scale={[2.1, 2.1, 0.5]} size={3} color={color} />}
      <Text position={[0, -1.55, 0]} fontSize={0.2} color="#fff4dc" anchorX="center">
        {label}
      </Text>
    </group>
  )
}

export function PortalStation() {
  const { state, patch } = useInvite()
  const open = state.saidYes && !state.crashed
  const flavors =
    state.portal && state.portal !== 'custom' ? PORTAL_FLAVORS[state.portal] : []

  return (
    <>
      <Arch id="calm" position={SPOTS.portalCalm} color="#7ecbff" label="спокойно" />
      <Arch id="play" position={SPOTS.portalPlay} color="#7dffb3" label="поиграть" />
      <Arch id="japan" position={SPOTS.portalJapan} color="#ff8ad4" label="япония" />

      {open && (
        <Interactable
          id="custom-place"
          position={[8.4, 0, -16.4]}
          enabled={open}
          color="#c9b48a"
          onInteract={() => patch({ portal: 'custom', flavor: '', customPlace: state.customPlace || ' ' })}
        >
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.7, 1.5, 0.12]} />
            <meshStandardMaterial color="#2a2018" />
          </mesh>
          <Text position={[0, 1.8, 0.1]} fontSize={0.14} color="#c9b48a" anchorX="center">
            своё
          </Text>
        </Interactable>
      )}

      {open && flavors.map((f, i) => (
        <Interactable
          key={f.id}
          id={`fl-${f.id}`}
          position={[
            (state.portal === 'calm' ? -5.2 : state.portal === 'japan' ? 5.2 : 0) + (i - 1.5) * 1.15,
            0,
            -18.8,
          ]}
          enabled={open}
          color={f.hue}
          radius={1.1}
          onInteract={() => patch({ flavor: f.id })}
        >
          <mesh position={[0, 0.55, 0]}>
            <icosahedronGeometry args={[0.28]} />
            <meshStandardMaterial
              color={f.hue}
              emissive={f.hue}
              emissiveIntensity={state.flavor === f.id ? 1.6 : 0.4}
            />
          </mesh>
        </Interactable>
      ))}

      {open &&
        DATE_CHIPS.map((iso, i) => (
          <Interactable
            key={iso}
            id={`date-${iso}`}
            position={[-6 + i * 1.7, 0, -20.2]}
            color="#ffb020"
            radius={1.05}
            enabled={open}
            onInteract={() => patch({ date: iso })}
          >
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshStandardMaterial
                color="#ffb020"
                emissive="#ff8a00"
                emissiveIntensity={state.date === iso ? 2 : 0.7}
              />
            </mesh>
            <Text position={[0, 1.15, 0]} fontSize={0.12} color="#fff4dc" anchorX="center">
              {formatRuDate(iso).slice(0, 5)}
            </Text>
          </Interactable>
        ))}

      {open && (
        <>
          <Interactable
            id="slot-day"
            position={[-1.2, 0, -21.6]}
            color="#ffe066"
            enabled={open}
            onInteract={() => patch({ slot: 'day' })}
          >
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.32, 12, 12]} />
              <meshStandardMaterial
                color="#ffe066"
                emissive="#ffb020"
                emissiveIntensity={state.slot === 'day' ? 2 : 0.5}
              />
            </mesh>
          </Interactable>
          <Interactable
            id="slot-eve"
            position={[1.2, 0, -21.6]}
            color="#7ecbff"
            enabled={open}
            onInteract={() => patch({ slot: 'evening' })}
          >
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.32, 12, 12]} />
              <meshStandardMaterial
                color="#3a4a9a"
                emissive="#7ecbff"
                emissiveIntensity={state.slot === 'evening' ? 1.6 : 0.4}
              />
            </mesh>
          </Interactable>
        </>
      )}
    </>
  )
}
