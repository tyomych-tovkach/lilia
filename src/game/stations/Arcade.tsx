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
import { WorldLabel } from '../WorldLabel'

function Pickup({
  position,
  selected,
  color,
  enabled,
  onToggle,
  children,
  id,
  label,
}: {
  id: string
  position: [number, number, number]
  selected: boolean
  color: string
  enabled: boolean
  onToggle: () => void
  children: ReactNode
  label: string
}) {
  return (
    <Interactable id={id} position={position} radius={0.78} enabled={enabled} color={color} onInteract={onToggle}>
      <group scale={selected ? 1.12 : 1}>
        {children}
        {selected && (
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#7dffb3" emissive="#3dff8a" emissiveIntensity={2} />
          </mesh>
        )}
        <WorldLabel position={[0, 0.72, 0]} color={selected ? '#7dffb3' : '#fff4dc'} maxWidth={110}>
          {label}
        </WorldLabel>
      </group>
    </Interactable>
  )
}

function row(cx: number, cz: number, i: number, n: number): [number, number, number] {
  const span = Math.min(2.0, 0.36 * (n - 1))
  const x = cx + (n === 1 ? 0 : -span / 2 + (span / (n - 1)) * i)
  return [x, 0.38, cz + 0.92]
}

export function ArcadeStations() {
  const { state, patch } = useInvite()
  const ready = state.letterOpen && !state.crashed

  return (
    <>
      <MachineCollider position={SPOTS.japan} />
      <MachineCollider position={SPOTS.sport} />
      <MachineCollider position={SPOTS.secret} />
      <Kit file="dance-machine.glb" position={SPOTS.dance} scale={0.95} rotation={[0, Math.PI, 0]} />
      <Kit file="claw-machine.glb" position={SPOTS.japan} scale={1} rotation={[0, 0.12, 0]} />
      <Kit file="basketball-game.glb" position={SPOTS.sport} scale={0.95} />
      <Kit file="gambling-machine.glb" position={SPOTS.secret} scale={1} rotation={[0, -0.12, 0]} />
      <WorldLabel position={[SPOTS.japan[0], 1.85, SPOTS.japan[2]]} color="#ff8ad4">
        ガチャ · Япония
      </WorldLabel>
      <WorldLabel position={[SPOTS.sport[0], 1.85, SPOTS.sport[2]]} color="#7dffb3">
        ロッカー · Спорт
      </WorldLabel>
      <WorldLabel position={[SPOTS.secret[0], 1.85, SPOTS.secret[2]]} color="#d0c4ff">
        チート · секрет
      </WorldLabel>

      {JAPAN_STICKERS.map((item, i) => {
        const p = row(SPOTS.japan[0], SPOTS.japan[2], i, JAPAN_STICKERS.length)
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
            label={item.id}
            onToggle={() => patch({ japanStickers: toggleLimited(state.japanStickers, item.id, 2) })}
          >
            <JapanShape kind={item.shape} />
          </Pickup>
        )
      })}

      {SPORT_MARKS.map((item, i) => {
        const p = row(SPOTS.sport[0], SPOTS.sport[2], i, SPORT_MARKS.length)
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
            label={item.id}
            onToggle={() => patch({ sportMarks: toggleLimited(state.sportMarks, item.id, 3) })}
          >
            <SportShape kind={item.shape} />
          </Pickup>
        )
      })}

      {SECRET_MARKS.map((item, i) => {
        const p = row(SPOTS.secret[0], SPOTS.secret[2], i, SECRET_MARKS.length)
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
            label={item.id}
            onToggle={() => patch({ secretMarks: toggleLimited(state.secretMarks, item.id, 3) })}
          >
            <SecretShape kind={item.shape} />
          </Pickup>
        )
      })}

      <Interactable
        id="jp-custom"
        position={[-0.42, 0, SPOTS.japan[2]]}
        color="#c9b48a"
        enabled={ready}
        radius={0.9}
        onInteract={() => patch({ compose: 'japan' })}
      >
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.32, 0.55, 0.06]} />
          <meshStandardMaterial color="#2a2018" />
        </mesh>
        <WorldLabel position={[0, 0.85, 0]} color="#c9b48a">
          своё
        </WorldLabel>
      </Interactable>
      <Interactable
        id="sp-custom"
        position={[0.42, 0, SPOTS.sport[2]]}
        color="#c9b48a"
        enabled={ready}
        radius={0.9}
        onInteract={() => patch({ compose: 'sport' })}
      >
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.32, 0.55, 0.06]} />
          <meshStandardMaterial color="#2a2018" />
        </mesh>
        <WorldLabel position={[0, 0.85, 0]} color="#c9b48a">
          своё
        </WorldLabel>
      </Interactable>
      <Interactable
        id="sc-custom"
        position={[0, 0, SPOTS.secret[2] + 1.32]}
        color="#c9b48a"
        enabled={ready}
        radius={0.9}
        onInteract={() => patch({ compose: 'secret' })}
      >
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.32, 0.55, 0.06]} />
          <meshStandardMaterial color="#2a2018" />
        </mesh>
        <WorldLabel position={[0, 0.85, 0]} color="#c9b48a">
          а ещё я
        </WorldLabel>
      </Interactable>
    </>
  )
}

function MachineCollider({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={[0.42, 0.7, 0.35]} position={[0, 0.7, 0]} />
    </RigidBody>
  )
}

function JapanShape({ kind }: { kind: string }) {
  if (kind === 'bowl')
    return (
      <mesh>
        <sphereGeometry args={[0.16, 12, 10]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#8a1010" emissiveIntensity={0.4} />
      </mesh>
    )
  if (kind === 'bag')
    return (
      <mesh>
        <boxGeometry args={[0.22, 0.16, 0.14]} />
        <meshStandardMaterial color="#c4a574" />
      </mesh>
    )
  if (kind === 'star')
    return (
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <octahedronGeometry args={[0.16]} />
        <meshStandardMaterial color="#ffe066" emissive="#ffb020" emissiveIntensity={0.7} />
      </mesh>
    )
  if (kind === 'glyph')
    return (
      <mesh>
        <torusGeometry args={[0.12, 0.04, 8, 12]} />
        <meshStandardMaterial color="#fff7e8" />
      </mesh>
    )
  if (kind === 'flower')
    return (
      <mesh>
        <torusGeometry args={[0.12, 0.04, 8, 12]} />
        <meshStandardMaterial color="#ff8ad4" emissive="#ff4d9a" emissiveIntensity={0.5} />
      </mesh>
    )
  return (
    <mesh>
      <icosahedronGeometry args={[0.15]} />
      <meshStandardMaterial color="#7ecbff" emissive="#2de2ff" emissiveIntensity={0.6} />
    </mesh>
  )
}

function SportShape({ kind }: { kind: string }) {
  if (kind === 'volley')
    return (
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#f4f0e0" />
      </mesh>
    )
  if (kind === 'basket')
    return (
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#e8782c" />
      </mesh>
    )
  if (kind === 'racket')
    return (
      <mesh rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.42, 8]} />
        <meshStandardMaterial color="#7dffb3" />
      </mesh>
    )
  if (kind === 'lens')
    return (
      <mesh>
        <torusGeometry args={[0.12, 0.03, 8, 16]} />
        <meshStandardMaterial color="#6ad0ff" />
      </mesh>
    )
  if (kind === 'shoe')
    return (
      <mesh>
        <boxGeometry args={[0.22, 0.1, 0.12]} />
        <meshStandardMaterial color="#3dff8a" />
      </mesh>
    )
  return (
    <mesh>
      <coneGeometry args={[0.1, 0.22, 8]} />
      <meshStandardMaterial color="#ffd27a" />
    </mesh>
  )
}

function SecretShape({ kind }: { kind: string }) {
  if (kind === 'disco')
    return (
      <mesh>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial color="#ff4d9a" emissive="#ff2d95" emissiveIntensity={0.6} />
      </mesh>
    )
  if (kind === 'headphones')
    return (
      <mesh>
        <torusGeometry args={[0.12, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#b14dff" />
      </mesh>
    )
  if (kind === 'reel')
    return (
      <mesh>
        <cylinderGeometry args={[0.14, 0.14, 0.06, 16]} />
        <meshStandardMaterial color="#d0c4ff" />
      </mesh>
    )
  if (kind === 'boot')
    return (
      <mesh>
        <boxGeometry args={[0.2, 0.12, 0.12]} />
        <meshStandardMaterial color="#8ab4ff" />
      </mesh>
    )
  return (
    <mesh>
      <sphereGeometry args={[0.14, 12, 12]} />
      <meshStandardMaterial color="#ffb6d9" emissive="#ff8ad4" emissiveIntensity={0.5} />
    </mesh>
  )
}
