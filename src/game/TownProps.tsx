import { Text } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { FONT } from './layout'

export function Kanji({
  text,
  position,
  rotation,
  size = 0.28,
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
      font={FONT}
      position={position}
      rotation={rotation}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.01}
      outlineColor="#140808"
      overflowWrap="break-word"
      maxWidth={2.4}
    >
      {text}
    </Text>
  )
}

export function Machiya({
  position,
  face,
  noren,
  accent = '#c44536',
  stories = 2,
}: {
  position: [number, number, number]
  face: 'left' | 'right'
  noren: string
  accent?: string
  stories?: 2 | 3
}) {
  const rotY = face === 'left' ? -Math.PI / 2 : Math.PI / 2
  const h = stories === 3 ? 3.55 : 2.85
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.15, h / 2, 1.12]} position={[0, h / 2, 0]} />
      </RigidBody>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[2.28, h, 2.18]} />
        <meshStandardMaterial color="#6b4636" roughness={0.72} />
      </mesh>
      <mesh position={[0, h / 2 - 0.05, 1.1]}>
        <boxGeometry args={[2.05, h - 0.35, 0.06]} />
        <meshStandardMaterial color="#f3e6d0" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.58, 1.14]}>
        <boxGeometry args={[0.95, 1.15, 0.08]} />
        <meshStandardMaterial color="#1a1210" />
      </mesh>
      <mesh position={[-0.58, 1.85, 1.14]}>
        <boxGeometry args={[0.52, 0.62, 0.05]} />
        <meshStandardMaterial color="#8a4a28" emissive={accent} emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0.58, 1.85, 1.14]}>
        <boxGeometry args={[0.52, 0.62, 0.05]} />
        <meshStandardMaterial color="#8a4a28" emissive={accent} emissiveIntensity={0.45} />
      </mesh>
      {stories === 3 && (
        <>
          <mesh position={[-0.5, 2.7, 1.14]}>
            <boxGeometry args={[0.5, 0.5, 0.05]} />
            <meshStandardMaterial color="#5a3020" emissive="#ffb020" emissiveIntensity={0.55} />
          </mesh>
          <mesh position={[0.5, 2.7, 1.14]}>
            <boxGeometry args={[0.5, 0.5, 0.05]} />
            <meshStandardMaterial color="#5a3020" emissive="#ffd27a" emissiveIntensity={0.4} />
          </mesh>
        </>
      )}
      <mesh position={[0, h + 0.12, 0.18]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[2.62, 0.09, 1.35]} />
        <meshStandardMaterial color="#1c1012" roughness={0.5} />
      </mesh>
      <mesh position={[0, h + 0.12, -0.18]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[2.62, 0.09, 1.35]} />
        <meshStandardMaterial color="#1c1012" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.18, 1.16]}>
        <boxGeometry args={[1.55, 0.48, 0.04]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <Kanji text={noren} position={[0, 1.18, 1.2]} size={0.24} />
      <mesh position={[0.95, 2.15, 1.18]}>
        <boxGeometry args={[0.08, 0.7, 0.22]} />
        <meshStandardMaterial color="#2a1810" />
      </mesh>
      <Kanji
        text={noren.length > 1 ? noren[0] : noren}
        position={[0.95, 2.15, 1.32]}
        size={0.16}
        rotation={[0, 0, 0]}
        color="#f4e4c1"
      />
      <mesh position={[-0.85, 2.05, 1.22]}>
        <cylinderGeometry args={[0.07, 0.07, 0.16, 8]} />
        <meshStandardMaterial color="#c44536" />
      </mesh>
      <mesh position={[-0.85, 2.2, 1.22]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color="#ffb020" emissive="#ff8a00" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}

export function SkylineBlock({ position, h, lit }: { position: [number, number, number]; h: number; lit: string }) {
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[2.4, h, 2.1]} />
        <meshStandardMaterial color="#24151c" roughness={0.85} />
      </mesh>
      <mesh position={[0, h + 0.05, 0]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[2.7, 0.08, 2.3]} />
        <meshStandardMaterial color="#14080c" />
      </mesh>
      <mesh position={[0.4, h * 0.55, 1.06]}>
        <boxGeometry args={[0.35, 0.4, 0.04]} />
        <meshStandardMaterial color={lit} emissive={lit} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[-0.45, h * 0.4, 1.06]}>
        <boxGeometry args={[0.35, 0.4, 0.04]} />
        <meshStandardMaterial color="#ffd27a" emissive="#ffb020" emissiveIntensity={0.45} />
      </mesh>
    </group>
  )
}

export function Torii({ z, w = 2.05 }: { z: number; w?: number }) {
  const vermillion = '#c44536'
  return (
    <group position={[0, 0, z]}>
      <mesh position={[-w, 1.55, 0]}>
        <boxGeometry args={[0.2, 3.1, 0.2]} />
        <meshStandardMaterial color={vermillion} roughness={0.38} />
      </mesh>
      <mesh position={[w, 1.55, 0]}>
        <boxGeometry args={[0.2, 3.1, 0.2]} />
        <meshStandardMaterial color={vermillion} roughness={0.38} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[w * 2 + 0.95, 0.2, 0.36]} />
        <meshStandardMaterial color={vermillion} />
      </mesh>
      <mesh position={[0, 2.82, 0]}>
        <boxGeometry args={[w * 2 + 0.45, 0.1, 0.2]} />
        <meshStandardMaterial color="#1a1210" />
      </mesh>
    </group>
  )
}

export function StreetGate({
  z,
  open,
  seal,
}: {
  z: number
  open: boolean
  seal: string
}) {
  return (
    <group>
      <Torii z={z} />
      {!open && (
        <>
          <RigidBody type="fixed" colliders={false} position={[0, 0, z]}>
            <CuboidCollider args={[2.75, 1.65, 0.16]} position={[0, 1.65, 0]} />
          </RigidBody>
          <mesh position={[0, 1.3, z]}>
            <boxGeometry args={[5.1, 2.5, 0.1]} />
            <meshStandardMaterial color="#1c100c" />
          </mesh>
          <Kanji text={seal} position={[0, 1.5, z + 0.08]} size={0.4} color="#e8c96a" />
        </>
      )}
    </group>
  )
}

export function StoneLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.24, 8]} />
        <meshStandardMaterial color="#6a6460" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.22, 0.38, 0.22]} />
        <meshStandardMaterial color="#5a5450" />
      </mesh>
      <mesh position={[0, 0.42, 0.12]}>
        <boxGeometry args={[0.08, 0.16, 0.02]} />
        <meshStandardMaterial color="#ffd27a" emissive="#ffb020" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.08, 8]} />
        <meshStandardMaterial color="#4a4440" />
      </mesh>
    </group>
  )
}
