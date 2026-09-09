import { useMemo } from 'react'
import * as THREE from 'three'
import { Kanji, Mat } from './Craft'
import { cranePaperTex, sakuraScrollTex, shojiTex, wavePrintTex } from './japanArt'

const PINK = '#f4b6c8'
const PINK_LIT = '#ffd0dc'
const PINK_DEEP = '#c45c7a'
const WOOD = '#5a3a28'
const PAPER = '#f4ead8'

export function SakuraTree({
  position,
  scale = 1,
  rotationY = 0,
}: {
  position: [number, number, number]
  scale?: number
  rotationY?: number
}) {
  const clusters = useMemo(
    () =>
      [
        [0, 2.15, 0, 0.55, PINK],
        [0.45, 2.35, 0.15, 0.42, PINK_LIT],
        [-0.5, 2.2, -0.1, 0.4, '#e8a0b4'],
        [0.2, 2.55, -0.35, 0.36, PINK],
        [-0.25, 2.5, 0.3, 0.34, PINK_LIT],
        [0.55, 1.95, -0.2, 0.3, '#d4849a'],
        [-0.55, 1.85, 0.25, 0.28, PINK],
        [0.05, 1.7, 0.45, 0.32, PINK_LIT],
      ] as [number, number, number, number, string][],
    [],
  )
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 1.4, 32]} />
        <meshStandardMaterial color={WOOD} roughness={0.85} />
      </mesh>
      <mesh position={[0.22, 1.45, 0]} rotation={[0, 0, 0.7]}>
        <cylinderGeometry args={[0.04, 0.06, 0.7, 6]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
      <mesh position={[-0.2, 1.5, 0.08]} rotation={[0.2, 0, -0.65]}>
        <cylinderGeometry args={[0.035, 0.055, 0.62, 6]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
      {clusters.map(([x, y, z, r, c], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 24, 16]} />
          <meshStandardMaterial color={c} roughness={0.7} emissive={PINK} emissiveIntensity={0.12} />
        </mesh>
      ))}
    </group>
  )
}

export function Petals() {
  const bits = useMemo(() => {
    const out: [number, number, number, number][] = []
    for (let i = 0; i < 48; i++) {
      const a = i * 1.37
      out.push([(Math.sin(a) * 6.2 + (i % 5) * 0.3) * (i % 2 ? 1 : -0.7), 0.05 + (i % 7) * 0.012, Math.cos(a * 0.8) * 5.4, 0.2 + (i % 4) * 0.2])
    }
    return out
  }, [])
  return (
    <group>
      {bits.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} rotation={[-Math.PI / 2, 0, p[3]]}>
          <circleGeometry args={[0.05, 5]} />
          <meshStandardMaterial color={i % 2 ? PINK : PINK_LIT} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

export function Kakemono({
  position,
  rotationY = 0,
  kind = 'sakura',
  kanji,
}: {
  position: [number, number, number]
  rotationY?: number
  kind?: 'sakura' | 'wave' | 'crane'
  kanji?: string
}) {
  const map = kind === 'wave' ? wavePrintTex() : kind === 'crane' ? cranePaperTex() : sakuraScrollTex()
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.72, 2.05, 0.03]} />
        <meshStandardMaterial map={map} roughness={0.72} />
      </mesh>
      <mesh position={[0, 2.22, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.82, 24]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.78, 10]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>
      {kanji && <Kanji text={kanji} position={[0, 1.7, 0.04]} size={0.16} color={PINK_DEEP} />}
    </group>
  )
}

export function Shoji({
  position,
  rotationY = 0,
  width = 1.6,
  height = 2.4,
}: {
  position: [number, number, number]
  rotationY?: number
  width?: number
  height?: number
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial map={shojiTex()} roughness={0.82} color="#f7f0e6" />
      </mesh>
      <mesh position={[0, height / 2, 0.03]}>
        <boxGeometry args={[width + 0.06, 0.06, 0.05]} />
        <Mat color={WOOD} kind="wood" />
      </mesh>
      <mesh position={[0, 0.03, 0.03]}>
        <boxGeometry args={[width + 0.06, 0.06, 0.05]} />
        <Mat color={WOOD} kind="wood" />
      </mesh>
    </group>
  )
}

export function Chochin({ position, lit = false }: { position: [number, number, number]; lit?: boolean }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.16, 24, 18]} />
        <meshStandardMaterial color={PINK_LIT} emissive={PINK} emissiveIntensity={lit ? 1.05 : 0.7} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 10]} />
        <meshStandardMaterial color="#2a1810" />
      </mesh>
      <mesh position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 10]} />
        <meshStandardMaterial color="#2a1810" />
      </mesh>
      {lit && <pointLight color="#ffb8c8" intensity={0.5} distance={4.2} />}
    </group>
  )
}

export function Byobu({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const map = sakuraScrollTex()
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-0.55, 0, 0.55].map((x, i) => (
        <group key={x} position={[x, 0, i === 1 ? -0.04 : 0]} rotation={[0, i === 0 ? 0.18 : i === 2 ? -0.18 : 0, 0]}>
          <mesh position={[0, 1.05, 0]}>
            <boxGeometry args={[0.58, 2.1, 0.04]} />
            <meshStandardMaterial map={map} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Ikebana({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.16, 12]} />
        <meshStandardMaterial color="#3a2418" roughness={0.4} />
      </mesh>
      <mesh position={[0.02, 0.42, 0]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.55, 6]} />
        <meshStandardMaterial color="#2a5a32" />
      </mesh>
      <mesh position={[-0.06, 0.38, 0.04]} rotation={[-0.4, 0.2, -0.3]}>
        <cylinderGeometry args={[0.01, 0.01, 0.42, 6]} />
        <meshStandardMaterial color="#245028" />
      </mesh>
      <mesh position={[0.04, 0.62, 0.02]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={PINK} />
      </mesh>
      <mesh position={[-0.08, 0.52, 0.06]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={PINK_LIT} />
      </mesh>
      <mesh position={[0.1, 0.48, -0.04]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={PINK_DEEP} />
      </mesh>
    </group>
  )
}

export function Tsukubai({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.28, 12]} />
        <Mat color="#6a6a60" kind="stone" repeat={[1, 1]} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
        <meshStandardMaterial color="#7ecbff" transparent opacity={0.45} roughness={0.15} metalness={0.2} />
      </mesh>
      <mesh position={[0.28, 0.22, 0.1]} rotation={[0.2, 0, 0.4]}>
        <cylinderGeometry args={[0.03, 0.04, 0.22, 8]} />
        <meshStandardMaterial color="#d8c8a8" />
      </mesh>
    </group>
  )
}

export function Noren({ position, rotationY = 0, label }: { position: [number, number, number]; rotationY?: number; label?: string }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[1.5, 0.06, 0.06]} />
        <Mat color={WOOD} kind="wood" />
      </mesh>
      {[-0.48, 0, 0.48].map((x) => (
        <mesh key={x} position={[x, 1.15, 0.02]}>
          <boxGeometry args={[0.44, 0.75, 0.02]} />
          <meshStandardMaterial color={PINK_DEEP} roughness={0.7} />
        </mesh>
      ))}
      {label && <Kanji text={label} position={[0, 1.2, 0.04]} size={0.12} color={PAPER} />}
    </group>
  )
}

export function FanWall({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh rotation={[0, 0, 0.15]}>
        <circleGeometry args={[0.28, 12, 0, Math.PI]} />
        <meshStandardMaterial color={PINK_LIT} side={THREE.DoubleSide} />
      </mesh>
      {[-0.5, -0.2, 0.15, 0.5].map((a) => (
        <mesh key={a} position={[Math.sin(a) * 0.08, Math.cos(a) * 0.04, 0.01]} rotation={[0, 0, a]}>
          <boxGeometry args={[0.015, 0.26, 0.01]} />
          <meshStandardMaterial color={WOOD} />
        </mesh>
      ))}
    </group>
  )
}

export function OrigamiString({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 0.35, 0.7, 1.05].map((y, i) => (
        <mesh key={y} position={[Math.sin(i) * 0.05, 2.1 - y, 0]} rotation={[0.4, i, 0.2]}>
          <coneGeometry args={[0.07, 0.12, 4]} />
          <meshStandardMaterial color={i % 2 ? PINK_LIT : PAPER} />
        </mesh>
      ))}
    </group>
  )
}

export function Toro({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.16, 8]} />
        <Mat color="#7a7468" kind="stone" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
        <Mat color="#6a655c" kind="stone" />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.32, 0.28, 0.32]} />
        <meshStandardMaterial color={PINK_LIT} emissive={PINK} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.2, 0.12, 0.1, 8]} />
        <Mat color="#7a7468" kind="stone" />
      </mesh>
    </group>
  )
}

export function LowTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.6, 0.06, 0.7]} />
        <Mat color="#6a4a32" kind="wood" repeat={[2, 1]} />
      </mesh>
      {[-0.65, 0.65].map((x) => (
        <mesh key={x} position={[x, 0.16, 0]}>
          <boxGeometry args={[0.08, 0.32, 0.55]} />
          <Mat color={WOOD} kind="wood" />
        </mesh>
      ))}
    </group>
  )
}
