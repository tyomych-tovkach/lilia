import { Text } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { type ReactNode } from 'react'
import {
  JAPAN_STICKERS,
  SECRET_MARKS,
  SPORT_MARKS,
  toggleLimited,
} from '../../logic'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { Kit } from '../Kit'
import { SPOTS } from '../layout'

function Pickup({
  position,
  selected,
  color,
  enabled,
  onToggle,
  children,
  id,
}: {
  id: string
  position: [number, number, number]
  selected: boolean
  color: string
  enabled: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <Interactable id={id} position={position} radius={1.15} enabled={enabled} color={color} onInteract={onToggle}>
      <group scale={selected ? 1.18 : 1}>
        {children}
        {selected && (
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshStandardMaterial color="#7dffb3" emissive="#3dff8a" emissiveIntensity={2} />
          </mesh>
        )}
      </group>
    </Interactable>
  )
}

export function ArcadeStations() {
  const { state, patch } = useInvite()
  const ready = state.letterOpen && !state.crashed

  return (
    <>
      <MachineCollider position={SPOTS.japan} />
      <MachineCollider position={SPOTS.sport} />
      <MachineCollider position={SPOTS.secret} />
      <Kit file="claw-machine.glb" position={SPOTS.japan} scale={1.65} rotation={[0, 0.2, 0]} />
      <Kit file="basketball-game.glb" position={SPOTS.sport} scale={1.55} />
      <Kit file="gambling-machine.glb" position={SPOTS.secret} scale={1.65} rotation={[0, -0.2, 0]} />

      {JAPAN_STICKERS.map((item, i) => {
        const a = (i / JAPAN_STICKERS.length) * Math.PI * 1.1 - 0.55
        const p: [number, number, number] = [SPOTS.japan[0] + Math.sin(a) * 1.7, 0.45, SPOTS.japan[2] + 1.1 + Math.cos(a) * 0.35]
        const on = state.japanStickers.includes(item.id)
        const can = ready && (on || state.japanStickers.length < 2)
        return (
          <Pickup
            key={item.id}
            id={`jp-${item.id}`}
            position={p}
            selected={on}
            color="#ff4d6d"
            enabled={can}
            onToggle={() => patch({ japanStickers: toggleLimited(state.japanStickers, item.id, 2) })}
          >
            <JapanShape kind={item.shape} />
          </Pickup>
        )
      })}

      {SPORT_MARKS.map((item, i) => {
        const a = (i / SPORT_MARKS.length) * Math.PI * 1.15 - 0.6
        const p: [number, number, number] = [SPOTS.sport[0] + Math.sin(a) * 1.85, 0.42, SPOTS.sport[2] + 1.25 + Math.cos(a) * 0.3]
        const on = state.sportMarks.includes(item.id)
        const can = ready && (on || state.sportMarks.length < 3)
        return (
          <Pickup
            key={item.id}
            id={`sp-${item.id}`}
            position={p}
            selected={on}
            color="#3dff8a"
            enabled={can}
            onToggle={() => patch({ sportMarks: toggleLimited(state.sportMarks, item.id, 3) })}
          >
            <SportShape kind={item.shape} />
          </Pickup>
        )
      })}

      {SECRET_MARKS.map((item, i) => {
        const a = (i / SECRET_MARKS.length) * Math.PI * 1.1 - 0.55
        const p: [number, number, number] = [SPOTS.secret[0] + Math.sin(a) * 1.7, 0.45, SPOTS.secret[2] + 1.1 + Math.cos(a) * 0.35]
        const on = state.secretMarks.includes(item.id)
        const can = ready && (on || state.secretMarks.length < 3)
        return (
          <Pickup
            key={item.id}
            id={`sc-${item.id}`}
            position={p}
            selected={on}
            color="#b14dff"
            enabled={can}
            onToggle={() => patch({ secretMarks: toggleLimited(state.secretMarks, item.id, 3) })}
          >
            <SecretShape kind={item.shape} />
          </Pickup>
        )
      })}
    </>
  )
}

function MachineCollider({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={[0.7, 1, 0.55]} position={[0, 1, 0]} />
    </RigidBody>
  )
}

function JapanShape({ kind }: { kind: string }) {
  if (kind === 'bowl')
    return (
      <mesh>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#8a1010" emissiveIntensity={0.4} />
      </mesh>
    )
  if (kind === 'bag')
    return (
      <mesh>
        <boxGeometry args={[0.28, 0.22, 0.18]} />
        <meshStandardMaterial color="#c4a574" />
      </mesh>
    )
  if (kind === 'star')
    return (
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <octahedronGeometry args={[0.22]} />
        <meshStandardMaterial color="#ffe066" emissive="#ffb020" emissiveIntensity={0.7} />
      </mesh>
    )
  if (kind === 'glyph')
    return (
      <Text fontSize={0.28} color="#fff7e8" anchorX="center">
        あ
      </Text>
    )
  if (kind === 'flower')
    return (
      <mesh>
        <torusGeometry args={[0.16, 0.05, 8, 12]} />
        <meshStandardMaterial color="#ff8ad4" emissive="#ff4d9a" emissiveIntensity={0.5} />
      </mesh>
    )
  return (
    <mesh>
      <icosahedronGeometry args={[0.2]} />
      <meshStandardMaterial color="#7ecbff" emissive="#2de2ff" emissiveIntensity={0.6} />
    </mesh>
  )
}

function SportShape({ kind }: { kind: string }) {
  if (kind === 'volley')
    return (
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f4f0e0" />
      </mesh>
    )
  if (kind === 'basket')
    return (
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#e8782c" />
      </mesh>
    )
  if (kind === 'racket')
    return (
      <mesh rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.55, 8]} />
        <meshStandardMaterial color="#7dffb3" />
      </mesh>
    )
  if (kind === 'lens')
    return (
      <mesh>
        <torusGeometry args={[0.16, 0.04, 8, 16]} />
        <meshStandardMaterial color="#6ad0ff" />
      </mesh>
    )
  if (kind === 'shoe')
    return (
      <mesh>
        <boxGeometry args={[0.28, 0.12, 0.16]} />
        <meshStandardMaterial color="#3dff8a" />
      </mesh>
    )
  return (
    <mesh>
      <coneGeometry args={[0.12, 0.28, 8]} />
      <meshStandardMaterial color="#ffd27a" />
    </mesh>
  )
}

function SecretShape({ kind }: { kind: string }) {
  if (kind === 'disco')
    return (
      <mesh>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="#ff4d9a" emissive="#ff2d95" emissiveIntensity={0.6} />
      </mesh>
    )
  if (kind === 'headphones')
    return (
      <mesh>
        <torusGeometry args={[0.16, 0.05, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#b14dff" />
      </mesh>
    )
  if (kind === 'reel')
    return (
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
        <meshStandardMaterial color="#d0c4ff" />
      </mesh>
    )
  if (kind === 'boot')
    return (
      <mesh>
        <boxGeometry args={[0.26, 0.14, 0.16]} />
        <meshStandardMaterial color="#8ab4ff" />
      </mesh>
    )
  return (
    <mesh>
      <sphereGeometry args={[0.18, 12, 12]} />
      <meshStandardMaterial color="#ffb6d9" emissive="#ff8ad4" emissiveIntensity={0.5} />
    </mesh>
  )
}
