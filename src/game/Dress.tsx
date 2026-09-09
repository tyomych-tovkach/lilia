import { Kanji, Mat, RuSign } from './Craft'
import * as THREE from 'three'

export function Maple({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 1.7, 32]} />
        <meshStandardMaterial color="#5a3a22" roughness={0.86} />
      </mesh>
      <mesh position={[0.28, 1.55, 0.05]} rotation={[0, 0, 0.55]}>
        <cylinderGeometry args={[0.04, 0.07, 0.8, 16]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
      {(
        [
          [0, 2.05, 0, 0.72, '#c45c28'],
          [0.42, 2.2, 0.12, 0.5, '#a83818'],
          [-0.4, 2.1, -0.08, 0.48, '#d46830'],
          [0.15, 2.4, -0.28, 0.4, '#c45c28'],
          [-0.2, 2.35, 0.28, 0.38, '#8a2810'],
        ] as [number, number, number, number, string][]
      ).map(([x, y, z, r, c], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1.15, 0.7, 1.1]}>
          <sphereGeometry args={[r, 32, 20]} />
          <meshStandardMaterial color={c} roughness={0.72} />
        </mesh>
      ))}
    </group>
  )
}

export function Koi({ position, color = '#f4ead8' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0.4, 0.15]} scale={[1.6, 0.45, 0.7]}>
        <sphereGeometry args={[0.1, 24, 16]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      <mesh position={[0.12, 0.02, 0]} rotation={[0, 0, 0.4]} scale={[0.5, 0.35, 0.15]}>
        <sphereGeometry args={[0.08, 12, 10]} />
        <meshStandardMaterial color="#c45c4a" />
      </mesh>
    </group>
  )
}

export function StoneLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.18, 32]} />
        <Mat color="#7a7468" kind="stone" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.42, 32]} />
        <Mat color="#6a655c" kind="stone" />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[0.34, 0.28, 0.34]} />
        <meshStandardMaterial color="#f4ead8" emissive="#ffc070" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 0.94, 0]}>
        <cylinderGeometry args={[0.22, 0.12, 0.12, 32]} />
        <Mat color="#7a7468" kind="stone" />
      </mesh>
      <pointLight position={[0, 0.74, 0]} color="#ffc070" intensity={0.45} distance={3.5} />
    </group>
  )
}

export function Kotoji({ position, letter = false }: { position: [number, number, number]; letter?: boolean }) {
  return (
    <group position={position}>
      <mesh position={[-0.22, 0.32, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.64, 32]} />
        <Mat color="#7a7468" kind="stone" />
      </mesh>
      <mesh position={[0.22, 0.42, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.84, 32]} />
        <Mat color="#7a7468" kind="stone" />
      </mesh>
      <mesh position={[0, 0.78, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.55, 0.08, 0.12]} />
        <Mat color="#6a655c" kind="stone" />
      </mesh>
      <mesh position={[0.12, 0.92, 0]}>
        <boxGeometry args={[0.36, 0.22, 0.28]} />
        <meshStandardMaterial color="#f4ead8" emissive="#ffc070" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.12, 1.08, 0]}>
        <cylinderGeometry args={[0.2, 0.1, 0.1, 32]} />
        <Mat color="#7a7468" kind="stone" />
      </mesh>
      {letter && (
        <mesh position={[0.12, 1.05, 0.02]} rotation={[-0.08, 0.12, 0]}>
          <boxGeometry args={[0.2, 0.012, 0.14]} />
          <Mat color="#f7f0e4" kind="paper" />
        </mesh>
      )}
      {letter && (
        <mesh position={[0.16, 1.06, 0.04]}>
          <circleGeometry args={[0.018, 16]} />
          <meshStandardMaterial color="#c41e3a" />
        </mesh>
      )}
      <pointLight position={[0.12, 0.92, 0]} color="#ffc070" intensity={0.55} distance={3.5} />
    </group>
  )
}

export function Zabuton({ position, color = '#8a143c' }: { position: [number, number, number]; color?: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.62, 0.08, 0.62]} />
      <Mat color={color} kind="cloth" />
    </mesh>
  )
}

export function PlaceSetting({ position, rotY = 0 }: { position: [number, number, number]; rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.165, 32]} />
        <meshStandardMaterial color="#3a0e14" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.12, 28]} />
        <meshStandardMaterial color="#f4ead8" roughness={0.5} />
      </mesh>
      <mesh position={[0.08, 0.03, 0.02]}>
        <cylinderGeometry args={[0.055, 0.06, 0.045, 24]} />
        <meshStandardMaterial color="#1a1010" roughness={0.3} />
      </mesh>
      <mesh position={[-0.14, 0.01, 0]}>
        <boxGeometry args={[0.22, 0.012, 0.012]} />
        <meshStandardMaterial color="#3a2418" />
      </mesh>
      <mesh position={[0.12, 0.04, -0.08]}>
        <cylinderGeometry args={[0.032, 0.028, 0.07, 24]} />
        <meshStandardMaterial color="#7aa090" roughness={0.4} />
      </mesh>
      <mesh position={[0.16, 0.09, 0.1]}>
        <cylinderGeometry args={[0.008, 0.008, 0.11, 16]} />
        <meshStandardMaterial color="#c8dce8" roughness={0.15} metalness={0.25} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.16, 0.16, 0.1]}>
        <sphereGeometry args={[0.038, 16, 12]} />
        <meshStandardMaterial color="#c8dce8" roughness={0.12} metalness={0.2} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

export function Candle({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.022, 0.022, 0.16, 16]} />
        <meshStandardMaterial color="#f4ead8" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.028, 16, 12]} />
        <meshStandardMaterial color="#ffb020" emissive="#ff8a00" emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0, 0.12, 0]} color="#ffb040" intensity={0.5} distance={3.2} />
    </group>
  )
}

export function Mailbox({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 32]} />
        <meshStandardMaterial color="#8a2030" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.23, 0.25, 1.18, 32]} />
        <meshStandardMaterial color="#c41e3a" metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[0, 1.24, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.07, 32]} />
        <meshStandardMaterial color="#a01830" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.02, 0.2]}>
        <boxGeometry args={[0.16, 0.04, 0.06]} />
        <meshStandardMaterial color="#1a0c0c" />
      </mesh>
      <Kanji text="〒" position={[0, 0.88, 0.26]} size={0.12} color="#f4ead8" />
    </group>
  )
}

export function GymHoop({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.7, 1.7, 0.12]} />
        <meshStandardMaterial color="#3a5a8a" />
      </mesh>
      <mesh position={[0, 2.15, 0.14]}>
        <boxGeometry args={[1.15, 0.85, 0.06]} />
        <meshStandardMaterial color="#d8d0c0" />
      </mesh>
      <mesh position={[0, 2.42, 0.28]}>
        <boxGeometry args={[1.55, 1.05, 0.07]} />
        <meshStandardMaterial color="#f4f0e8" />
      </mesh>
      <mesh position={[0, 2.42, 0.32]}>
        <boxGeometry args={[0.52, 0.45, 0.02]} />
        <meshStandardMaterial color="#c45c4a" />
      </mesh>
      <mesh position={[0, 2.38, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.018, 16, 48]} />
        <meshStandardMaterial color="#e8782c" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.18, 0.54]}>
        <coneGeometry args={[0.2, 0.38, 12, 1, true]} />
        <meshStandardMaterial color="#f4f0e8" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function VolleyNet() {
  return (
    <group>
      {([-2.55, 2.55] as const).map((x) => (
        <group key={x} position={[x, 0, -0.35]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
            <meshStandardMaterial color="#4a4a50" />
          </mesh>
          <mesh position={[0, 0.86, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 1.72, 32]} />
            <meshStandardMaterial color="#8a9098" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.58, -0.35]}>
        <boxGeometry args={[5.1, 0.03, 0.04]} />
        <meshStandardMaterial color="#f4f0e0" />
      </mesh>
      <mesh position={[0, 0.92, -0.35]}>
        <boxGeometry args={[5.1, 0.02, 0.03]} />
        <meshStandardMaterial color="#f4f0e0" />
      </mesh>
      <mesh position={[0, 1.25, -0.35]}>
        <planeGeometry args={[5, 0.64]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function Ball({ position, color, r = 0.11 }: { position: [number, number, number]; color: string; r?: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[r, 32, 24]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  )
}

export function CityBlock({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#1a1830" roughness={0.9} />
      </mesh>
      {[-0.35, 0.1, 0.4].map((x, i) =>
        [0.35, 0.7, 1.05].map((y) => (
          <mesh key={`${x}:${y}`} position={[x * size[0] * 0.35, y * size[1] * 0.55, size[2] / 2 + 0.02]}>
            <boxGeometry args={[0.12, 0.18, 0.02]} />
            <meshStandardMaterial
              color={i % 2 ? '#ffd27a' : '#7ecbff'}
              emissive={i % 3 ? '#ffd27a' : '#7ecbff'}
              emissiveIntensity={0.8}
            />
          </mesh>
        )),
      )}
    </group>
  )
}

export function Pot({ position, r = 0.16 }: { position: [number, number, number]; r?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[r, r * 0.85, 0.28, 24]} />
        <meshStandardMaterial color="#4a3a32" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.42, 0]} scale={[1.1, 0.7, 1.1]}>
        <sphereGeometry args={[r * 0.95, 20, 14]} />
        <meshStandardMaterial color="#2a5a32" roughness={0.75} />
      </mesh>
      <mesh position={[0.08, 0.5, 0.04]} scale={[0.7, 0.55, 0.7]}>
        <sphereGeometry args={[r * 0.7, 16, 12]} />
        <meshStandardMaterial color="#3a7a40" />
      </mesh>
    </group>
  )
}

export function Lockers({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-0.66, -0.22, 0.22, 0.66].map((x, i) => (
        <group key={x} position={[x, 0, 0]} rotation={[0, i === 1 ? 0.4 : 0, 0]}>
          <mesh position={[0, 0.92, 0]}>
            <boxGeometry args={[0.42, 1.85, 0.38]} />
            <meshStandardMaterial color="#3a3f42" metalness={0.35} roughness={0.45} />
          </mesh>
          <mesh position={[0.16, 0.85, 0.2]}>
            <boxGeometry args={[0.04, 0.1, 0.04]} />
            <meshStandardMaterial color="#c9a227" metalness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function VkusnoLogo({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2.4, 1.5, 0.08]} />
        <meshStandardMaterial color="#163d2a" />
      </mesh>
      <mesh position={[-0.2, 0.1, 0.07]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.13, 0.72, 0.07]} />
        <meshStandardMaterial color="#f0c030" emissive="#f0c030" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.07, 0.1, 0.07]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.13, 0.72, 0.07]} />
        <meshStandardMaterial color="#f0c030" emissive="#f0c030" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.57, -0.13, 0.09]}>
        <sphereGeometry args={[0.24, 24, 18]} />
        <meshStandardMaterial color="#e24a28" />
      </mesh>
      <RuSign text="Вкусно и точка" position={[0.15, -0.7, 0.08]} size={0.11} color="#f4ead8" />
    </group>
  )
}

export function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.18, 28]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 3.15, 28]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.72} />
      </mesh>
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.14, 28]} />
        <meshStandardMaterial color="#efe6d2" />
      </mesh>
    </group>
  )
}

export function GetaPair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-0.08, 0.08].map((x) => (
        <group key={x} position={[x, 0.03, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.04, 0.26]} />
            <meshStandardMaterial color="#3a2418" />
          </mesh>
          <mesh position={[0, -0.03, 0.07]}>
            <boxGeometry args={[0.08, 0.03, 0.04]} />
            <meshStandardMaterial color="#2a1810" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Tsuitate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[-0.28, 0.08, 0.08]}>
        <boxGeometry args={[0.08, 0.16, 0.22]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <mesh position={[0.28, 0.08, 0.08]}>
        <boxGeometry args={[0.08, 0.16, 0.22]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.72, 2.08, 0.05]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <Kanji text="宴" position={[0, 1.35, 0.04]} size={0.28} color="#c45c7a" />
    </group>
  )
}

export function Beam({ z, half }: { z: number; half: number }) {
  return (
    <mesh position={[0, 4.18, z]}>
      <boxGeometry args={[half * 1.92, 0.12, 0.18]} />
      <Mat color="#6a4a32" kind="wood" repeat={[8, 1]} />
    </mesh>
  )
}

export function HungChochin({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.55, 8]} />
        <meshStandardMaterial color="#2a1810" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.16, 24, 18]} />
        <meshStandardMaterial color="#ffd0dc" emissive="#f4b6c8" emissiveIntensity={0.85} roughness={0.45} />
      </mesh>
      <pointLight color="#ffb8c8" intensity={0.45} distance={4.2} />
    </group>
  )
}
