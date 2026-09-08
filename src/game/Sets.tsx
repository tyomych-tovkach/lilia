import type { ReactNode } from 'react'
import { Archway, Bench, Lantern, Planter, RoomBounds, RoomLights, RuSign } from './Craft'
import { Kit } from './Kit'

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 1.4, 8]} />
        <meshStandardMaterial color="#5a3a22" />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.7, 12, 10]} />
        <meshStandardMaterial color="#2a6a3a" />
      </mesh>
      <mesh position={[0.35, 1.9, 0.1]}>
        <sphereGeometry args={[0.42, 10, 8]} />
        <meshStandardMaterial color="#3a8a44" />
      </mesh>
    </group>
  )
}

function Hedge({ position, args }: { position: [number, number, number]; args: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#245a32" roughness={0.9} />
    </mesh>
  )
}

function WallRing({ half, color, height = 3.6, thick = 0.4 }: { half: number; color: string; height?: number; thick?: number }) {
  return (
    <>
      <mesh position={[0, height / 2, -half]}>
        <boxGeometry args={[half * 2 + 0.4, height, thick]} />
        <meshStandardMaterial color={color} roughness={0.84} />
      </mesh>
      <mesh position={[0, height / 2, half]}>
        <boxGeometry args={[half * 2 + 0.4, height, thick]} />
        <meshStandardMaterial color={color} roughness={0.84} />
      </mesh>
      <mesh position={[-half, height / 2, 0]}>
        <boxGeometry args={[thick, height, half * 2]} />
        <meshStandardMaterial color={color} roughness={0.84} />
      </mesh>
      <mesh position={[half, height / 2, 0]}>
        <boxGeometry args={[thick, height, half * 2]} />
        <meshStandardMaterial color={color} roughness={0.84} />
      </mesh>
    </>
  )
}

function Floor({ half, color }: { half: number; color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[half * 2 + 2, half * 2 + 2]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  )
}

export function FoyerSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#1a1020" fog={['#1a1020', 16, 38]} />
      <Floor half={half} color="#3a2a28" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0.4]}>
        <planeGeometry args={[2.4, half * 1.7]} />
        <meshStandardMaterial color="#7a2030" roughness={0.7} />
      </mesh>
      <mesh position={[0, 4.4, 0]}>
        <boxGeometry args={[half * 2, 0.2, half * 2]} />
        <meshStandardMaterial color="#2a1818" />
      </mesh>
      <mesh position={[0, 4.1, 0]}>
        <sphereGeometry args={[0.28, 12, 10]} />
        <meshStandardMaterial color="#ffd27a" emissive="#ffb020" emissiveIntensity={1.6} />
      </mesh>
      <pointLight position={[0, 3.8, 0]} color="#ffc070" intensity={1.1} distance={14} />
      <WallRing half={half} color="#e8d5b8" />
      <mesh position={[0, 2.6, -half + 0.22]}>
        <boxGeometry args={[11, 3.4, 0.08]} />
        <meshStandardMaterial color="#6a1424" />
      </mesh>
      <mesh position={[-4.4, 3.6, -half + 0.28]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[3.2, 2.2, 0.04]} />
        <meshStandardMaterial color="#c9a227" />
      </mesh>
      <mesh position={[4.4, 3.6, -half + 0.28]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[3.2, 2.2, 0.04]} />
        <meshStandardMaterial color="#c9a227" />
      </mesh>
      <mesh position={[0, 0.85, 2.6]}>
        <boxGeometry args={[2.4, 0.08, 0.9]} />
        <meshStandardMaterial color="#5a3a28" />
      </mesh>
      <mesh position={[-0.9, 0.42, 2.6]}>
        <boxGeometry args={[0.12, 0.84, 0.8]} />
        <meshStandardMaterial color="#3a2418" />
      </mesh>
      <mesh position={[0.9, 0.42, 2.6]}>
        <boxGeometry args={[0.12, 0.84, 0.8]} />
        <meshStandardMaterial color="#3a2418" />
      </mesh>
      <mesh position={[-3.4, 1.4, 3.2]}>
        <boxGeometry args={[1.4, 2.2, 0.12]} />
        <meshStandardMaterial color="#3a2418" />
      </mesh>
      <RuSign text="ВЕЧЕР В СЕМИ АКТАХ" position={[-3.4, 2.35, 3.28]} size={0.11} color="#ffd27a" />
      <RuSign text="Афиша" position={[-3.4, 2.05, 3.28]} size={0.1} color="#f4ead8" />
      <Lantern position={[-2.2, 2.4, -1]} />
      <Lantern position={[2.2, 2.4, -1]} />
      <Lantern position={[0, 2.2, 4.2]} />
      <Bench position={[-2.8, 0, 4.4]} rotationY={0.2} />
      <Bench position={[2.8, 0, 4.4]} rotationY={-0.2} />
      <Planter position={[-5.2, 0, 1]} />
      <Planter position={[5.2, 0, 1]} />
      <RoomBounds half={half} wallH={4} />
      {children}
    </>
  )
}

export function GardenSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#c8dce8" fog={['#c8dce8', 18, 36]} />
      <Floor half={half} color="#3a6a3a" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0.4]}>
        <planeGeometry args={[1.6, half * 1.6]} />
        <meshStandardMaterial color="#c4b090" roughness={0.9} />
      </mesh>
      <Hedge position={[0, 0.7, -half + 0.3]} args={[half * 2, 1.4, 0.5]} />
      <Hedge position={[-half + 0.3, 0.7, 0]} args={[0.5, 1.4, half * 2]} />
      <Hedge position={[half - 0.3, 0.7, 0]} args={[0.5, 1.4, half * 2]} />
      <Tree position={[-3.4, 0, -2.6]} />
      <Tree position={[3.6, 0, -2.2]} scale={1.15} />
      <Tree position={[-4.2, 0, 2.4]} scale={0.85} />
      <Tree position={[4, 0, 3]} scale={0.9} />
      <mesh position={[0, 0.42, -2.2]}>
        <cylinderGeometry args={[0.7, 0.78, 0.18, 20]} />
        <meshStandardMaterial color="#c4b090" />
      </mesh>
      <mesh position={[0, 0.52, -2.2]}>
        <cylinderGeometry args={[0.48, 0.48, 0.08, 16]} />
        <meshStandardMaterial color="#7ecbff" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 0.38, 0.2]}>
        <boxGeometry args={[1.5, 0.08, 1.5]} />
        <meshStandardMaterial color="#d4b090" />
      </mesh>
      <mesh position={[0, 0.44, 0.15]} rotation={[-0.08, 0.2, 0]}>
        <boxGeometry args={[0.28, 0.01, 0.2]} />
        <meshStandardMaterial color="#f7f0e4" />
      </mesh>
      <Planter position={[-1.6, 0, -3.4]} />
      <Planter position={[1.6, 0, -3.4]} />
      <Bench position={[-2.2, 0, 1.8]} />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function TeaSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#2a1818" fog={['#2a1818', 10, 22]} />
      <Floor half={half} color="#6a4a32" />
      <WallRing half={half} color="#f0e0d0" height={3.2} />
      <mesh position={[0, 3.3, 0]}>
        <boxGeometry args={[half * 2, 0.12, half * 2]} />
        <meshStandardMaterial color="#4a3024" />
      </mesh>
      <mesh position={[-2.4, 1.6, -half + 0.55]}>
        <boxGeometry args={[1.6, 2.2, 0.08]} />
        <meshStandardMaterial color="#5a1a28" />
      </mesh>
      <mesh position={[0, 0.22, -1.4]}>
        <cylinderGeometry args={[0.7, 0.75, 0.22, 16]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
      <mesh position={[0, 0.36, -1.4]}>
        <cylinderGeometry args={[0.22, 0.2, 0.1, 12]} />
        <meshStandardMaterial color="#f4ead8" />
      </mesh>
      <mesh position={[-0.7, 0.12, -0.7]}>
        <cylinderGeometry args={[0.28, 0.3, 0.1, 12]} />
        <meshStandardMaterial color="#8a143c" />
      </mesh>
      <mesh position={[0.7, 0.12, -0.7]}>
        <cylinderGeometry args={[0.28, 0.3, 0.1, 12]} />
        <meshStandardMaterial color="#8a143c" />
      </mesh>
      <Lantern position={[-1.8, 1.8, -1.2]} />
      <Lantern position={[1.8, 1.8, -1.2]} />
      <Lantern position={[0, 2.2, 1.6]} />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function CourtSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#8ec8f0" fog={['#8ec8f0', 22, 40]} />
      <Floor half={half} color="#4a8a4a" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -0.4]}>
        <planeGeometry args={[5.4, 9.2]} />
        <meshStandardMaterial color="#3a7a3a" />
      </mesh>
      <mesh position={[0, 0.06, -0.4]}>
        <boxGeometry args={[5.4, 0.04, 0.06]} />
        <meshStandardMaterial color="#f4f0e0" />
      </mesh>
      <mesh position={[0, 0.06, -3.2]}>
        <boxGeometry args={[5.4, 0.04, 0.06]} />
        <meshStandardMaterial color="#f4f0e0" />
      </mesh>
      <mesh position={[-2.7, 0.7, -0.4]}>
        <boxGeometry args={[0.08, 1.4, 9.2]} />
        <meshStandardMaterial color="#d8d0c0" />
      </mesh>
      <mesh position={[2.7, 0.7, -0.4]}>
        <boxGeometry args={[0.08, 1.4, 9.2]} />
        <meshStandardMaterial color="#d8d0c0" />
      </mesh>
      <mesh position={[0, 0.55, 3.6]}>
        <boxGeometry args={[4.4, 0.7, 0.7]} />
        <meshStandardMaterial color="#6a4a32" />
      </mesh>
      <Kit file="basketball-game.glb" position={[-1.8, 0, 1.1]} scale={0.85} />
      <RoomBounds half={half} wallH={2.2} />
      {children}
    </>
  )
}

export function RoofSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#12122a" fog={['#12122a', 12, 28]} />
      <Floor half={half} color="#3a3450" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[half * 1.6, half * 1.6]} />
        <meshStandardMaterial color="#2a2438" />
      </mesh>
      <mesh position={[0, 0.55, -half + 0.2]}>
        <boxGeometry args={[half * 2, 1.1, 0.28]} />
        <meshStandardMaterial color="#4a4460" />
      </mesh>
      <mesh position={[-half + 0.2, 0.55, 0]}>
        <boxGeometry args={[0.28, 1.1, half * 2]} />
        <meshStandardMaterial color="#4a4460" />
      </mesh>
      <mesh position={[half - 0.2, 0.55, 0]}>
        <boxGeometry args={[0.28, 1.1, half * 2]} />
        <meshStandardMaterial color="#4a4460" />
      </mesh>
      {[-4, -2, 0, 2, 4].map((x) => (
        <mesh key={x} position={[x, 1.1, -half - 1.6]}>
          <boxGeometry args={[1.4, 2.4 + Math.abs(x) * 0.15, 1.2]} />
          <meshStandardMaterial color="#2a2038" />
        </mesh>
      ))}
      <mesh position={[-0.8, 0.42, -1.4]}>
        <cylinderGeometry args={[0.22, 0.24, 0.5, 10]} />
        <meshStandardMaterial color="#3a2a4a" />
      </mesh>
      <mesh position={[0.8, 0.42, -1.4]}>
        <cylinderGeometry args={[0.22, 0.24, 0.5, 10]} />
        <meshStandardMaterial color="#3a2a4a" />
      </mesh>
      <Lantern position={[-1.6, 1.5, -1.8]} />
      <Lantern position={[1.6, 1.5, -1.8]} />
      <pointLight position={[0, 3.4, 0]} color="#a080ff" intensity={0.55} distance={10} />
      <RoomBounds half={half} wallH={1.6} />
      {children}
    </>
  )
}

export function BridgeSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#1c2438" fog={['#1c2438', 12, 26]} />
      <Floor half={half} color="#2a4050" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[half * 2, half * 2]} />
        <meshStandardMaterial color="#1a3850" />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[2.1, 0.16, 8.4]} />
        <meshStandardMaterial color="#6a5a48" />
      </mesh>
      <mesh position={[-1.05, 0.7, 0]}>
        <boxGeometry args={[0.08, 0.7, 8.4]} />
        <meshStandardMaterial color="#4a3a2c" />
      </mesh>
      <mesh position={[1.05, 0.7, 0]}>
        <boxGeometry args={[0.08, 0.7, 8.4]} />
        <meshStandardMaterial color="#4a3a2c" />
      </mesh>
      {[-3, -1, 1, 3].map((z) => (
        <group key={z}>
          <mesh position={[-1.05, 1.15, z]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ffd27a" emissive="#ffb020" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[1.05, 1.15, z]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ffd27a" emissive="#ffb020" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}
      <mesh position={[-3.4, 0.4, 3.6]}>
        <boxGeometry args={[2.2, 0.5, 2.2]} />
        <meshStandardMaterial color="#4a5a48" />
      </mesh>
      <mesh position={[3.4, 0.4, 3.6]}>
        <boxGeometry args={[2.2, 0.5, 2.2]} />
        <meshStandardMaterial color="#4a5a48" />
      </mesh>
      <RoomBounds half={half} wallH={2} />
      {children}
    </>
  )
}

export function TableSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#241818" fog={['#241818', 10, 20]} />
      <Floor half={half} color="#5a4034" />
      <WallRing half={half} color="#f0e4d0" height={3.3} />
      <mesh position={[2.2, 1.7, -half + 0.35]}>
        <boxGeometry args={[2.4, 1.6, 0.08]} />
        <meshStandardMaterial color="#7ecbff" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, 0.62, -1.5]}>
        <boxGeometry args={[2.2, 0.08, 1.1]} />
        <meshStandardMaterial color="#f4ead8" />
      </mesh>
      <mesh position={[0, 0.32, -1.5]}>
        <boxGeometry args={[0.12, 0.6, 0.12]} />
        <meshStandardMaterial color="#5a3a28" />
      </mesh>
      <mesh position={[-0.7, 0.42, -0.7]}>
        <boxGeometry args={[0.42, 0.08, 0.42]} />
        <meshStandardMaterial color="#c4a070" />
      </mesh>
      <mesh position={[0.7, 0.42, -0.7]}>
        <boxGeometry args={[0.42, 0.08, 0.42]} />
        <meshStandardMaterial color="#c4a070" />
      </mesh>
      <mesh position={[-0.45, 0.72, -1.35]}>
        <cylinderGeometry args={[0.03, 0.03, 0.18, 8]} />
        <meshStandardMaterial color="#f4ead8" />
      </mesh>
      <mesh position={[-0.45, 0.84, -1.35]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffb020" emissive="#ff8a00" emissiveIntensity={1.3} />
      </mesh>
      <Lantern position={[0, 2.4, 0]} />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function PostSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#1c1824" fog={['#1c1824', 10, 20]} />
      <Floor half={half} color="#4a4034" />
      <WallRing half={half} color="#d8d0c0" height={3.2} />
      <mesh position={[0, 1.05, -2.4]}>
        <boxGeometry args={[4.4, 1.1, 0.7]} />
        <meshStandardMaterial color="#3a5a8a" />
      </mesh>
      <mesh position={[-1.6, 2.2, -2.5]}>
        <boxGeometry args={[1.4, 1.2, 0.2]} />
        <meshStandardMaterial color="#2a3a5a" />
      </mesh>
      {[-0.4, 0.1, 0.6].map((x) => (
        <mesh key={x} position={[x, 2.15, -2.45]}>
          <boxGeometry args={[0.35, 0.28, 0.12]} />
          <meshStandardMaterial color="#f4ead8" />
        </mesh>
      ))}
      <Kit file="ticket-machine.glb" position={[1.8, 0, -1.4]} scale={1} />
      <mesh position={[-2.2, 0.7, 0.4]}>
        <boxGeometry args={[0.7, 1.1, 0.5]} />
        <meshStandardMaterial color="#3a5a8a" />
      </mesh>
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function CampusSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#b8c8d8" fog={['#b8c8d8', 16, 32]} />
      <Floor half={half} color="#6a6a60" />
      <mesh position={[0, 2.2, -5.1]}>
        <boxGeometry args={[9.2, 4, 1.4]} />
        <meshStandardMaterial color="#d8cbb0" roughness={0.78} />
      </mesh>
      {[-2.4, -0.8, 0.8, 2.4].map((x) => (
        <mesh key={x} position={[x, 1.5, -4.2]}>
          <cylinderGeometry args={[0.18, 0.18, 3, 12]} />
          <meshStandardMaterial color="#efe6d2" />
        </mesh>
      ))}
      <RuSign text="КУБГУ" position={[0, 3.2, -4.2]} size={0.24} color="#3a4a6a" />
      <mesh position={[0, 0.02, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 20]} />
        <meshStandardMaterial color="#3a6a3a" />
      </mesh>
      <Kit file="vending-machine.glb" position={[3.2, 0, 2.2]} scale={0.9} />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function StaffSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#1a2420" fog={['#1a2420', 10, 20]} />
      <Floor half={half} color="#3a4a38" />
      <WallRing half={half} color="#1a4a32" height={3} />
      <mesh position={[0, 1.2, -3.4]}>
        <boxGeometry args={[3.2, 2.2, 0.8]} />
        <meshStandardMaterial color="#245a3c" />
      </mesh>
      <mesh position={[-0.7, 1.7, -2.95]}>
        <boxGeometry args={[0.14, 0.7, 0.08]} />
        <meshStandardMaterial color="#f0c040" emissive="#f0c040" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.5, 1.7, -2.95]}>
        <boxGeometry args={[0.14, 0.7, 0.08]} />
        <meshStandardMaterial color="#f0c040" emissive="#f0c040" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.15, 1.65, -2.92]}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color="#e05030" />
      </mesh>
      <mesh position={[1.6, 0.7, -1.6]}>
        <boxGeometry args={[1.1, 1.2, 0.4]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <Kit file="vending-machine.glb" position={[2.4, 0, 0.6]} scale={1} />
      <RuSign text="ПЕРСОНАЛ" position={[0, 2.6, -2.9]} size={0.16} color="#f4ead8" />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export { Archway }
