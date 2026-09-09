import type { ReactNode } from 'react'
import { Text } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { FONT, RU_FONT } from './layout'
import { skin, type SkinKind } from './skin'

export function Mat({
  color,
  kind,
  repeat = [2, 2],
  roughness = 0.86,
  metalness = 0,
  transparent,
  opacity,
  emissive,
  emissiveIntensity,
}: {
  color: string
  kind?: SkinKind
  repeat?: [number, number]
  roughness?: number
  metalness?: number
  transparent?: boolean
  opacity?: number
  emissive?: string
  emissiveIntensity?: number
}) {
  const map = kind ? skin(kind, color, repeat) : undefined
  return (
    <meshStandardMaterial
      color={kind ? '#ffffff' : color}
      map={map}
      roughness={roughness}
      metalness={metalness}
      transparent={transparent}
      opacity={opacity}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  )
}

export const FONT_CJK = FONT

export function RuSign({
  text,
  position,
  size = 0.2,
  color = '#f4ead8',
}: {
  text: string
  position: [number, number, number]
  size?: number
  color?: string
}) {
  return (
    <Text font={RU_FONT} position={position} fontSize={size} color={color} anchorX="center" maxWidth={4} overflowWrap="break-word">
      {text}
    </Text>
  )
}

export function Kanji({
  text,
  position,
  rotation,
  size = 0.22,
  color = '#f4e4c1',
}: {
  text: string
  position: [number, number, number]
  rotation?: [number, number, number]
  size?: number
  color?: string
}) {
  return (
    <Text
      font={FONT_CJK}
      position={position}
      rotation={rotation}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.01}
      outlineColor="#140808"
      maxWidth={3}
    >
      {text}
    </Text>
  )
}

export function Pavers({ half, color = '#6a5a48', accent = '#8a7058' }: { half: number; color?: string; accent?: string }) {
  const tiles = []
  const step = 0.62
  let i = 0
  for (let x = -half + 0.4; x < half - 0.3; x += step) {
    for (let z = -half + 0.4; z < half - 0.3; z += step) {
      const odd = (Math.round(x / step) + Math.round(z / step)) % 2 === 0
      tiles.push(
        <mesh key={`${x}:${z}`} position={[x + (odd ? 0.02 : -0.01), 0.04, z]} rotation={[-Math.PI / 2, 0, odd ? 0.01 : -0.008]}>
          <planeGeometry args={[0.56, 0.56]} />
          <meshStandardMaterial color={odd ? color : accent} roughness={0.92} />
        </mesh>,
      )
      i += 1
      if (i > 420) break
    }
  }
  return <group>{tiles}</group>
}

export function CurbRing({ half }: { half: number }) {
  const h = half - 0.12
  const parts: [number, number, number, number, number, number][] = [
    [0, 0.1, h, h * 2, 0.2, 0.22],
    [0, 0.1, -h, h * 2, 0.2, 0.22],
    [h, 0.1, 0, 0.22, 0.2, h * 2],
    [-h, 0.1, 0, 0.22, 0.2, h * 2],
  ]
  return (
    <>
      {parts.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]}>
          <boxGeometry args={[p[3], p[4], p[5]]} />
          <meshStandardMaterial color="#5a4a3c" roughness={0.8} />
        </mesh>
      ))}
    </>
  )
}

export function ShopBay({
  position,
  rotationY,
  plaster,
  timber,
  noren,
  goods,
}: {
  position: [number, number, number]
  rotationY: number
  plaster: string
  timber: string
  noren: string
  goods: string
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.55, 1.7, 0.68]} position={[0, 1.7, 0]} />
      </RigidBody>
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[3.15, 3.4, 1.35]} />
        <meshStandardMaterial color={timber} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.65, 0.7]}>
        <boxGeometry args={[2.9, 2.9, 0.08]} />
        <meshStandardMaterial color={plaster} roughness={0.86} />
      </mesh>
      <mesh position={[-0.7, 1.15, 0.78]}>
        <boxGeometry args={[0.08, 1.15, 0.9]} />
        <meshStandardMaterial color={timber} />
      </mesh>
      <mesh position={[0.7, 1.15, 0.78]}>
        <boxGeometry args={[0.08, 1.15, 0.9]} />
        <meshStandardMaterial color={timber} />
      </mesh>
      <mesh position={[0, 1.75, 0.78]}>
        <boxGeometry args={[1.5, 0.08, 0.9]} />
        <meshStandardMaterial color={timber} />
      </mesh>
      <mesh position={[-0.55, 2.35, 0.74]}>
        <boxGeometry args={[0.7, 0.7, 0.06]} />
        <meshStandardMaterial color="#7a4a30" emissive={goods} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.55, 2.35, 0.74]}>
        <boxGeometry args={[0.7, 0.7, 0.06]} />
        <meshStandardMaterial color="#7a4a30" emissive="#ffd27a" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.7, 0.78]}>
        <boxGeometry args={[1.15, 1.25, 0.08]} />
        <meshStandardMaterial color="#1a1210" />
      </mesh>
      <mesh position={[0, 1.2, 0.86]}>
        <boxGeometry args={[1.4, 0.55, 0.04]} />
        <meshStandardMaterial color={noren} />
      </mesh>
      <mesh position={[0, 3.45, 0.15]} rotation={[0.38, 0, 0]}>
        <boxGeometry args={[3.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#2a1818" />
      </mesh>
      <mesh position={[0, 3.45, -0.2]} rotation={[-0.38, 0, 0]}>
        <boxGeometry args={[3.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#2a1818" />
      </mesh>
      <mesh position={[-1.05, 2.15, 0.9]}>
        <cylinderGeometry args={[0.07, 0.07, 0.14, 8]} />
        <meshStandardMaterial color="#c44536" />
      </mesh>
      <mesh position={[-1.05, 2.32, 0.9]}>
        <sphereGeometry args={[0.11, 12, 10]} />
        <meshStandardMaterial color="#ffb020" emissive="#ff8a00" emissiveIntensity={1.3} />
      </mesh>
    </group>
  )
}

export function Lantern({ position, lit = true }: { position: [number, number, number]; lit?: boolean }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 0.16, 8]} />
        <Mat color="#5a3a22" kind="wood" repeat={[1, 1]} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color="#ffb020" emissive="#ff8a00" emissiveIntensity={lit ? 1.6 : 1.05} />
      </mesh>
      {lit && <pointLight color="#ffc070" intensity={0.55} distance={4.2} />}
    </group>
  )
}

export function Bench({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.15, 0.08, 0.36]} />
        <Mat color="#6a4a32" kind="wood" repeat={[1, 1]} roughness={0.7} />
      </mesh>
      <mesh position={[-0.48, 0.16, 0]}>
        <boxGeometry args={[0.08, 0.32, 0.32]} />
        <Mat color="#4a3224" kind="wood" repeat={[1, 1]} />
      </mesh>
      <mesh position={[0.48, 0.16, 0]}>
        <boxGeometry args={[0.08, 0.32, 0.32]} />
        <Mat color="#4a3224" kind="wood" repeat={[1, 1]} />
      </mesh>
    </group>
  )
}

export function Planter({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.42, 0.36, 0.42]} />
        <Mat color="#6a3a2a" kind="wood" repeat={[1, 1]} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <Mat color="#2a6a3a" kind="grass" repeat={[1, 1]} />
      </mesh>
      <mesh position={[0.08, 0.52, 0.04]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <Mat color="#3a8a44" kind="grass" repeat={[1, 1]} />
      </mesh>
    </group>
  )
}

export type DoorStatus = 'locked' | 'now' | 'done' | 'open' | 'staff'

export function Archway({
  position,
  rotationY = 0,
  label,
  status = 'open',
  staff = false,
}: {
  position: [number, number, number]
  rotationY?: number
  label: string
  status?: DoorStatus
  staff?: boolean
}) {
  const frame = status === 'now' ? '#d4a017' : status === 'done' ? '#8a6a48' : staff || status === 'staff' ? '#4a4038' : '#7a3030'
  const scale = staff || status === 'staff' ? 0.72 : 1
  const lit = status === 'now'
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh position={[-1.15, 1.45, 0]}>
        <boxGeometry args={[0.22, 2.9, 0.28]} />
        <meshStandardMaterial color={frame} emissive={lit ? '#ffd27a' : '#000'} emissiveIntensity={lit ? 0.35 : 0} />
      </mesh>
      <mesh position={[1.15, 1.45, 0]}>
        <boxGeometry args={[0.22, 2.9, 0.28]} />
        <meshStandardMaterial color={frame} emissive={lit ? '#ffd27a' : '#000'} emissiveIntensity={lit ? 0.35 : 0} />
      </mesh>
      <mesh position={[0, 2.95, 0]}>
        <boxGeometry args={[2.7, 0.22, 0.4]} />
        <meshStandardMaterial color={frame} />
      </mesh>
      <RuSign text={label} position={[0, 3.38, 0.08]} size={staff ? 0.11 : 0.13} color={lit ? '#ffd27a' : '#f4ead8'} />
      {status === 'locked' && (
        <mesh position={[0, 1.35, 0]}>
          <boxGeometry args={[2.15, 2.5, 0.08]} />
          <meshStandardMaterial color="#2a1814" />
        </mesh>
      )}
      {status === 'now' && (
        <mesh position={[0, 3.55, 0.12]}>
          <sphereGeometry args={[0.08, 10, 8]} />
          <meshStandardMaterial color="#ffd27a" emissive="#ffb020" emissiveIntensity={1.4} />
        </mesh>
      )}
    </group>
  )
}

export function RoomBounds({ half, wallH = 3.4 }: { half: number; wallH?: number }) {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[half + 2, 0.2, half + 2]} position={[0, -0.2, 0]} />
      <CuboidCollider args={[half + 2, wallH, 0.35]} position={[0, wallH / 2, half + 0.4]} />
      <CuboidCollider args={[half + 2, wallH, 0.35]} position={[0, wallH / 2, -half - 0.4]} />
      <CuboidCollider args={[0.35, wallH, half + 2]} position={[half + 0.4, wallH / 2, 0]} />
      <CuboidCollider args={[0.35, wallH, half + 2]} position={[-half - 0.4, wallH / 2, 0]} />
    </RigidBody>
  )
}

export function SkyDome({ color, radius = 52 }: { color: string; radius?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 28, 18]} />
      <meshBasicMaterial color={color} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  )
}

export function GroundDisk({
  radius,
  color,
  kind = 'grass',
  y = 0,
}: {
  radius: number
  color: string
  kind?: SkinKind
  y?: number
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <circleGeometry args={[radius, 56]} />
      <Mat color={color} kind={kind} repeat={[12, 12]} roughness={0.95} />
    </mesh>
  )
}

export function GroundSkirt({ radius = 36, color = '#243218', y = -0.05 }: { radius?: number; color?: string; y?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <circleGeometry args={[radius, 56]} />
      <meshStandardMaterial color={color} roughness={0.97} />
    </mesh>
  )
}

export function HedgeRing({ half, height = 1.42, color = '#1a4630' }: { half: number; height?: number; color?: string }) {
  const t = 0.62
  const outer = half + 1.05
  const span = outer * 2 + 1.4
  const parts: [number, number, number, number, number, number][] = [
    [0, height / 2, outer, span, height, t],
    [0, height / 2, -outer, span, height, t],
    [outer, height / 2, 0, t, height, outer * 2],
    [-outer, height / 2, 0, t, height, outer * 2],
  ]
  return (
    <group>
      {parts.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]}>
          <boxGeometry args={[p[3], p[4], p[5]]} />
          <meshStandardMaterial color={color} roughness={0.92} />
        </mesh>
      ))}
    </group>
  )
}

export function IndoorSkirting({ half, color = '#5a3a28', height = 0.14 }: { half: number; color?: string; height?: number }) {
  const t = 0.07
  const inset = half - 0.22
  return (
    <group>
      <mesh position={[0, height / 2, -inset]}>
        <boxGeometry args={[half * 2 - 0.28, height, t]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
      <mesh position={[0, height / 2, inset]}>
        <boxGeometry args={[half * 2 - 0.28, height, t]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
      <mesh position={[-inset, height / 2, 0]}>
        <boxGeometry args={[t, height, half * 2 - 0.28]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
      <mesh position={[inset, height / 2, 0]}>
        <boxGeometry args={[t, height, half * 2 - 0.28]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
    </group>
  )
}

export function Cornice({ half, y, color = '#e8c8c0' }: { half: number; y: number; color?: string }) {
  const t = 0.16
  const inset = half - 0.18
  return (
    <group>
      <mesh position={[0, y, -inset]}>
        <boxGeometry args={[half * 2 - 0.1, 0.1, t]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, y, inset]}>
        <boxGeometry args={[half * 2 - 0.1, 0.1, t]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[-inset, y, 0]}>
        <boxGeometry args={[t, 0.1, half * 2 - 0.1]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[inset, y, 0]}>
        <boxGeometry args={[t, 0.1, half * 2 - 0.1]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
}

export function RoomLights({
  sky,
  fog,
  ambient = 0.72,
  dirIntensity = 1.2,
  dirColor = '#ffe2c4',
  hemiSky = '#c8d4f0',
  hemiGround = '#4a3020',
  hemiIntensity = 0.18,
  dirPosition = [6, 14, 8],
  skyDome = false,
}: {
  sky: string
  fog: [string, number, number]
  ambient?: number
  dirIntensity?: number
  dirColor?: string
  hemiSky?: string
  hemiGround?: string
  hemiIntensity?: number
  dirPosition?: [number, number, number]
  skyDome?: boolean
}) {
  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={fog} />
      <ambientLight intensity={ambient} />
      <hemisphereLight args={[hemiSky, hemiGround, hemiIntensity]} />
      <directionalLight position={dirPosition} intensity={dirIntensity} color={dirColor} />
      {skyDome && <SkyDome color={sky} />}
    </>
  )
}

export function PlazaShell({
  half,
  ground,
  accent,
  plaster,
  children,
}: {
  half: number
  ground: string
  accent: string
  plaster: string[]
  children?: ReactNode
}) {
  const bays = []
  const span = 3.25
  let pi = 0
  for (let x = -half + 1.8; x < half - 1.6; x += span) {
    bays.push(
      <ShopBay
        key={`n${x}`}
        position={[x, 0, -half + 0.55]}
        rotationY={0}
        plaster={plaster[pi++ % plaster.length]}
        timber="#5a3a2a"
        noren={['#c44536', '#5a2a6a', '#2a5a4a'][pi % 3]}
        goods="#ff8aa0"
      />,
    )
    bays.push(
      <ShopBay
        key={`s${x}`}
        position={[x, 0, half - 0.55]}
        rotationY={Math.PI}
        plaster={plaster[pi++ % plaster.length]}
        timber="#5a3a2a"
        noren="#4a2a6a"
        goods="#ffd27a"
      />,
    )
  }
  for (let z = -half + 3.2; z < half - 3; z += span) {
    bays.push(
      <ShopBay
        key={`w${z}`}
        position={[-half + 0.55, 0, z]}
        rotationY={Math.PI / 2}
        plaster={plaster[pi++ % plaster.length]}
        timber="#4a3024"
        noren="#8a2a2a"
        goods="#7ecbff"
      />,
    )
    bays.push(
      <ShopBay
        key={`e${z}`}
        position={[half - 0.55, 0, z]}
        rotationY={-Math.PI / 2}
        plaster={plaster[pi++ % plaster.length]}
        timber="#4a3024"
        noren="#2a4a6a"
        goods="#ffb020"
      />,
    )
  }
  return (
    <>
      <color attach="background" args={['#1c1428']} />
      <fog attach="fog" args={['#1c1428', 18, 42]} />
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#c8d4f0', '#4a3020', 0.8]} />
      <directionalLight position={[6, 14, 8]} intensity={1.15} color="#ffe2c4" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[half * 2 + 2, half * 2 + 2]} />
        <meshStandardMaterial color={ground} roughness={0.95} />
      </mesh>
      <Pavers half={half} color={ground} accent={accent} />
      <CurbRing half={half} />
      {bays}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[half + 2, 0.2, half + 2]} position={[0, -0.2, 0]} />
        <CuboidCollider args={[half + 2, 3, 0.35]} position={[0, 2, half + 0.4]} />
        <CuboidCollider args={[half + 2, 3, 0.35]} position={[0, 2, -half - 0.4]} />
        <CuboidCollider args={[0.35, 3, half + 2]} position={[half + 0.4, 2, 0]} />
        <CuboidCollider args={[0.35, 3, half + 2]} position={[-half - 0.4, 2, 0]} />
      </RigidBody>
      <Lantern position={[-2.2, 2.7, -2]} />
      <Lantern position={[2.2, 2.75, 2.1]} />
      <Lantern position={[0, 2.9, 0]} />
      <Planter position={[-3.2, 0, 2.4]} />
      <Planter position={[3.1, 0, -2.2]} />
      <Bench position={[-2.6, 0, 3.4]} rotationY={0.2} />
      <Bench position={[2.7, 0, -3.3]} rotationY={3.4} />
      {children}
    </>
  )
}
