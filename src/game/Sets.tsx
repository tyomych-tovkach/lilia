import type { ReactNode } from 'react'
import { Archway, Bench, Kanji, Lantern, Mat, Planter, RoomBounds, RoomLights, RuSign } from './Craft'
import {
  Byobu,
  Chochin,
  FanWall,
  Ikebana,
  Kakemono,
  LowTable,
  Noren,
  OrigamiString,
  Petals,
  SakuraTree,
  Shoji,
  Toro,
  Tsukubai,
} from './FoyerJapan'
import { Kit } from './Kit'
import type { SkinKind } from './skin'

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

function WallRing({
  half,
  color,
  height = 3.6,
  thick = 0.4,
  kind = 'plaster',
}: {
  half: number
  color: string
  height?: number
  thick?: number
  kind?: SkinKind
}) {
  return (
    <>
      <mesh position={[0, height / 2, -half]}>
        <boxGeometry args={[half * 2 + 0.4, height, thick]} />
        <Mat color={color} kind={kind} repeat={[6, 2]} roughness={0.84} />
      </mesh>
      <mesh position={[0, height / 2, half]}>
        <boxGeometry args={[half * 2 + 0.4, height, thick]} />
        <Mat color={color} kind={kind} repeat={[6, 2]} roughness={0.84} />
      </mesh>
      <mesh position={[-half, height / 2, 0]}>
        <boxGeometry args={[thick, height, half * 2]} />
        <Mat color={color} kind={kind} repeat={[6, 2]} roughness={0.84} />
      </mesh>
      <mesh position={[half, height / 2, 0]}>
        <boxGeometry args={[thick, height, half * 2]} />
        <Mat color={color} kind={kind} repeat={[6, 2]} roughness={0.84} />
      </mesh>
    </>
  )
}

function Floor({ half, color, kind = 'stone' }: { half: number; color: string; kind?: SkinKind }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[half * 2 + 2, half * 2 + 2]} />
      <Mat color={color} kind={kind} repeat={[8, 8]} roughness={0.95} />
    </mesh>
  )
}

function Chair({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[0.48, 0.07, 0.48]} />
        <Mat color="#c4a070" kind="wood" repeat={[1, 1]} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.42, 0.04, 0.42]} />
        <Mat color="#7a2030" kind="cloth" repeat={[1, 1]} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.86, -0.21]}>
        <boxGeometry args={[0.48, 0.72, 0.07]} />
        <Mat color="#b48a58" kind="wood" repeat={[1, 2]} roughness={0.62} />
      </mesh>
      {[
        [-0.18, -0.18],
        [0.18, -0.18],
        [-0.18, 0.18],
        [0.18, 0.18],
      ].map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 0.22, z]}>
          <boxGeometry args={[0.07, 0.44, 0.07]} />
          <Mat color="#5a3a28" kind="wood" repeat={[1, 2]} />
        </mesh>
      ))}
    </group>
  )
}

function Place({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 18]} />
        <Mat color="#f4ead8" kind="paper" repeat={[1, 1]} roughness={0.45} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <Mat color="#e8d5b8" kind="paper" repeat={[1, 1]} roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0.04, 0.02]}>
        <cylinderGeometry args={[0.035, 0.03, 0.09, 12]} />
        <meshStandardMaterial color="#c8dce8" roughness={0.18} metalness={0.28} transparent opacity={0.55} />
      </mesh>
      <mesh position={[-0.2, 0.01, 0]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.04, 0.01, 0.16]} />
        <Mat color="#f7f0e4" kind="cloth" repeat={[1, 1]} />
      </mesh>
    </group>
  )
}

export function FoyerSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#2a1824" fog={['#3a2430', 12, 32]} ambient={0.42} dirIntensity={0.55} dirColor="#ffd0dc" />
      <Floor half={half} color="#e8d4c8" kind="wood" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0.3]}>
        <planeGeometry args={[2.2, half * 1.65]} />
        <Mat color="#d4849a" kind="carpet" repeat={[1, 6]} roughness={0.78} />
      </mesh>
      <mesh position={[0, 4.35, 0]}>
        <boxGeometry args={[half * 2, 0.16, half * 2]} />
        <Mat color="#f0d8d0" kind="wood" repeat={[8, 8]} />
      </mesh>
      <mesh position={[0, 4.05, 0]}>
        <sphereGeometry args={[0.32, 14, 12]} />
        <meshStandardMaterial color="#ffd0dc" emissive="#f4b6c8" emissiveIntensity={1.35} />
      </mesh>
      <pointLight position={[0, 3.7, 0]} color="#ffb8c8" intensity={1.15} distance={16} />
      <WallRing half={half} color="#f3ddd6" kind="plaster" />
      <mesh position={[-2.35, 1.8, -half + 1.15]}>
        <cylinderGeometry args={[0.16, 0.2, 3.5, 12]} />
        <Mat color="#efe0d4" kind="plaster" repeat={[1, 3]} />
      </mesh>
      <mesh position={[2.35, 1.8, -half + 1.15]}>
        <cylinderGeometry args={[0.16, 0.2, 3.5, 12]} />
        <Mat color="#efe0d4" kind="plaster" repeat={[1, 3]} />
      </mesh>
      <Shoji position={[-6.6, 0, -half + 0.45]} width={2.2} height={2.8} />
      <Shoji position={[6.6, 0, -half + 0.45]} width={2.2} height={2.8} />
      <Shoji position={[-half + 0.42, 0, -5.4]} rotationY={Math.PI / 2} width={2.4} height={2.6} />
      <Shoji position={[-half + 0.42, 0, 5.6]} rotationY={Math.PI / 2} width={2.2} height={2.6} />
      <SakuraTree position={[-6.35, 0, -4.6]} scale={1.15} rotationY={0.4} />
      <SakuraTree position={[6.4, 0, -4.4]} scale={1.2} rotationY={-0.5} />
      <SakuraTree position={[-6.2, 0, 4.8]} scale={1.05} />
      <SakuraTree position={[6.15, 0, 5]} scale={0.95} rotationY={0.7} />
      <SakuraTree position={[-5.4, 0, 0.4]} scale={0.78} rotationY={1.1} />
      <SakuraTree position={[5.35, 0, 1.6]} scale={0.72} />
      <Kakemono position={[-6.5, 0.2, -1.6]} rotationY={Math.PI / 2} kind="sakura" kanji="桜" />
      <Kakemono position={[-6.5, 0.15, 2.2]} rotationY={Math.PI / 2} kind="wave" kanji="春" />
      <Kakemono position={[6.5, 0.2, -1.2]} rotationY={-Math.PI / 2} kind="crane" kanji="鶴" />
      <Kakemono position={[6.5, 0.15, 2.8]} rotationY={-Math.PI / 2} kind="sakura" kanji="夢" />
      <Byobu position={[-2.6, 0, 0.4]} rotationY={0.35} />
      <LowTable position={[0, 0, 2.55]} />
      <Ikebana position={[0.45, 0.35, 2.55]} />
      <Tsukubai position={[1.7, 0, 3.4]} />
      <Toro position={[-1.85, 0, 3.5]} />
      <Kakemono position={[-3.55, 0.1, 3.15]} kind="sakura" />
      <RuSign text="ВЕЧЕР В СЕМИ АКТАХ" position={[-3.55, 2.45, 3.22]} size={0.1} color="#c45c7a" />
      <RuSign text="Афиша" position={[-3.55, 2.18, 3.22]} size={0.09} color="#5a3a28" />
      <FanWall position={[-half + 0.5, 1.8, 0.8]} rotationY={Math.PI / 2} />
      <FanWall position={[half - 0.5, 1.9, -5.2]} rotationY={-Math.PI / 2} />
      <OrigamiString position={[-1.4, 0, -2]} />
      <OrigamiString position={[1.5, 0, -1.6]} />
      <Chochin position={[-2.1, 2.55, -1.1]} />
      <Chochin position={[2.1, 2.55, -1.1]} />
      <Chochin position={[0, 2.45, 4.3]} />
      <Chochin position={[-4.2, 2.35, 2.2]} />
      <Chochin position={[4.3, 2.35, 2.4]} />
      <Noren position={[-4.8, 0, 6.6]} rotationY={Math.PI} label="桜" />
      <Noren position={[4.8, 0, 6.6]} rotationY={Math.PI} label="春" />
      <Bench position={[-2.7, 0, 4.55]} rotationY={0.15} />
      <Bench position={[2.7, 0, 4.55]} rotationY={-0.15} />
      <Petals />
      <Kanji text="桜" position={[0, 0.08, -2.2]} rotation={[-Math.PI / 2, 0, 0]} size={0.55} color="#e8a0b4" />
      <RoomBounds half={half} wallH={4} />
      {children}
    </>
  )
}

export function GardenSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#c8dce8" fog={['#c8dce8', 22, 40]} ambient={0.5} dirIntensity={1.25} dirColor="#fff4d8" />
      <Floor half={half} color="#3a6a3a" kind="grass" />
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
      <RoomLights sky="#2a1818" fog={['#2a1818', 6, 16]} ambient={0.22} dirIntensity={0.14} dirColor="#ffc070" />
      <Floor half={half} color="#8a6a3a" kind="tatami" />
      <WallRing half={half} color="#f0e0d0" height={3.2} kind="plaster" />
      <mesh position={[0, 3.3, 0]}>
        <boxGeometry args={[half * 2, 0.12, half * 2]} />
        <Mat color="#4a3024" kind="wood" repeat={[6, 6]} roughness={0.7} />
      </mesh>
      {[-2.4, 0, 2.4].map((x) => (
        <mesh key={`beam-${x}`} position={[x, 3.18, 0]}>
          <boxGeometry args={[0.16, 0.14, half * 2]} />
          <Mat color="#3a2418" kind="wood" repeat={[1, 8]} />
        </mesh>
      ))}
      {[-2.8, -0.9, 0.9, 2.8].map((x) => (
        <mesh key={`shoji-${x}`} position={[x, 1.55, -half + 0.28]}>
          <boxGeometry args={[1.7, 2.6, 0.05]} />
          <Mat color="#f4ead8" kind="paper" repeat={[2, 3]} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[-2.2, 1.7, -half + 0.62]}>
        <boxGeometry args={[1.5, 2.4, 0.42]} />
        <Mat color="#5a3a28" kind="wood" repeat={[2, 3]} />
      </mesh>
      <mesh position={[-2.2, 1.85, -half + 0.86]}>
        <boxGeometry args={[1.05, 1.5, 0.04]} />
        <Mat color="#5a1a28" kind="cloth" repeat={[1, 2]} />
      </mesh>
      <Kanji text="茶" position={[-2.2, 1.95, -half + 0.9]} size={0.42} color="#f4e4c1" />
      <mesh position={[-2.2, 0.62, -half + 0.92]}>
        <cylinderGeometry args={[0.12, 0.14, 0.18, 10]} />
        <Mat color="#6a3a2a" kind="lacquer" />
      </mesh>
      <mesh position={[-2.2, 0.86, -half + 0.92]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#2a6a3a" roughness={0.7} />
      </mesh>
      <mesh position={[-2.14, 0.98, -half + 0.94]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#c45c4a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.12, -1.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 3.2]} />
        <Mat color="#c4a060" kind="tatami" repeat={[4, 4]} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.28, -1.35]}>
        <cylinderGeometry args={[0.78, 0.84, 0.16, 20]} />
        <Mat color="#4a3020" kind="wood" repeat={[2, 1]} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.38, -1.35]}>
        <cylinderGeometry args={[0.72, 0.72, 0.04, 20]} />
        <Mat color="#2a1810" kind="lacquer" repeat={[1, 1]} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.48, -1.35]}>
        <cylinderGeometry args={[0.12, 0.14, 0.16, 14]} />
        <Mat color="#3a1a14" kind="lacquer" roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.6, -1.35]}>
        <cylinderGeometry args={[0.06, 0.08, 0.1, 10]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <mesh position={[-0.28, 0.44, -1.18]}>
        <cylinderGeometry args={[0.07, 0.08, 0.07, 12]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <mesh position={[0.28, 0.44, -1.18]}>
        <cylinderGeometry args={[0.07, 0.08, 0.07, 12]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <mesh position={[0.02, 0.42, -1.55]}>
        <boxGeometry args={[0.16, 0.04, 0.12]} />
        <Mat color="#e8d5b8" kind="paper" />
      </mesh>
      <mesh position={[-0.85, 0.1, -0.55]}>
        <boxGeometry args={[0.62, 0.08, 0.62]} />
        <Mat color="#8a143c" kind="cloth" repeat={[1, 1]} />
      </mesh>
      <mesh position={[0.85, 0.1, -0.55]}>
        <boxGeometry args={[0.62, 0.08, 0.62]} />
        <Mat color="#8a143c" kind="cloth" repeat={[1, 1]} />
      </mesh>
      <mesh position={[2.6, 0.95, -1.8]}>
        <boxGeometry args={[0.9, 1.7, 0.32]} />
        <Mat color="#5a3a28" kind="wood" repeat={[1, 3]} />
      </mesh>
      {[0.55, 0.95, 1.35].map((y) => (
        <group key={y}>
          <mesh position={[2.48, y, -1.62]}>
            <cylinderGeometry args={[0.07, 0.08, 0.16, 10]} />
            <Mat color="#5a1a28" kind="lacquer" />
          </mesh>
          <mesh position={[2.68, y, -1.62]}>
            <cylinderGeometry args={[0.07, 0.08, 0.16, 10]} />
            <Mat color="#1a4a32" kind="lacquer" />
          </mesh>
        </group>
      ))}
      <mesh position={[-3.1, 1.15, 1.4]}>
        <boxGeometry args={[0.08, 2.2, 1.8]} />
        <Mat color="#5a1a28" kind="cloth" repeat={[1, 2]} />
      </mesh>
      <mesh position={[-2.95, 1.15, 1.4]}>
        <boxGeometry args={[0.08, 2.2, 1.8]} />
        <Mat color="#5a1a28" kind="cloth" repeat={[1, 2]} />
      </mesh>
      <Kanji text="和" position={[-2.86, 1.7, 1.4]} rotation={[0, Math.PI / 2, 0]} size={0.28} color="#f4e4c1" />
      <Lantern position={[-1.8, 1.8, -1.2]} />
      <Lantern position={[1.8, 1.8, -1.2]} />
      <Lantern position={[0, 2.2, 1.6]} />
      <Lantern position={[-2.2, 2.4, -half + 1.1]} />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function CourtSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#8ec8f0" fog={['#8ec8f0', 22, 40]} ambient={0.55} dirIntensity={1.3} dirColor="#e8f0ff" />
      <Floor half={half} color="#4a8a4a" kind="grass" />
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
      <RoomLights sky="#12122a" fog={['#12122a', 8, 22]} ambient={0.16} dirIntensity={0.4} dirColor="#a0b0ff" />
      <Floor half={half} color="#3a3450" kind="stone" />
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
      <RoomLights sky="#1c2438" fog={['#1c2438', 8, 20]} ambient={0.18} dirIntensity={0.3} dirColor="#7090c8" />
      <Floor half={half} color="#1a3850" kind="stone" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[half * 2, half * 2]} />
        <meshStandardMaterial color="#16344c" roughness={0.18} metalness={0.28} transparent opacity={0.72} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[2.2, 0.1, 8.6]} />
        <Mat color="#6a5a48" kind="wood" repeat={[2, 6]} roughness={0.7} />
      </mesh>
      <mesh position={[-1.05, 0.55, 0]}>
        <boxGeometry args={[0.08, 0.9, 8.4]} />
        <Mat color="#4a3a2c" kind="wood" repeat={[1, 6]} />
      </mesh>
      <mesh position={[1.05, 0.55, 0]}>
        <boxGeometry args={[0.08, 0.9, 8.4]} />
        <Mat color="#4a3a2c" kind="wood" repeat={[1, 6]} />
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
      <RoomLights sky="#241818" fog={['#241818', 8, 16]} ambient={0.22} dirIntensity={0.12} dirColor="#ffc070" />
      <Floor half={half} color="#5a4034" kind="wood" />
      <WallRing half={half} color="#f0e4d0" height={3.3} kind="plaster" />
      <mesh position={[0, 0.46, -half + 0.22]}>
        <boxGeometry args={[half * 2 - 0.2, 0.92, 0.1]} />
        <Mat color="#7a4a32" kind="wood" repeat={[8, 1]} roughness={0.7} />
      </mesh>
      <mesh position={[-half + 0.22, 0.46, 0]}>
        <boxGeometry args={[0.1, 0.92, half * 2 - 0.2]} />
        <Mat color="#7a4a32" kind="wood" repeat={[8, 1]} roughness={0.7} />
      </mesh>
      <mesh position={[half - 0.22, 0.46, 0]}>
        <boxGeometry args={[0.1, 0.92, half * 2 - 0.2]} />
        <Mat color="#7a4a32" kind="wood" repeat={[8, 1]} roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.38, 0]}>
        <boxGeometry args={[half * 2, 0.12, half * 2]} />
        <Mat color="#4a3024" kind="wood" repeat={[6, 6]} />
      </mesh>
      <mesh position={[2.2, 1.7, -half + 0.22]}>
        <boxGeometry args={[2.6, 1.8, 0.08]} />
        <meshStandardMaterial color="#7ecbff" transparent opacity={0.22} roughness={0.08} metalness={0.12} />
      </mesh>
      <mesh position={[2.2, 2.62, -half + 0.2]}>
        <boxGeometry args={[2.76, 0.1, 0.1]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <mesh position={[2.2, 0.78, -half + 0.2]}>
        <boxGeometry args={[2.76, 0.1, 0.1]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <mesh position={[1.15, 1.7, -half + 0.42]} rotation={[0, 0.12, 0]}>
        <boxGeometry args={[0.7, 2.4, 0.06]} />
        <Mat color="#7a2030" kind="cloth" repeat={[1, 3]} />
      </mesh>
      <mesh position={[3.25, 1.7, -half + 0.42]} rotation={[0, -0.12, 0]}>
        <boxGeometry args={[0.7, 2.4, 0.06]} />
        <Mat color="#7a2030" kind="cloth" repeat={[1, 3]} />
      </mesh>
      <mesh position={[-2.6, 1.7, -half + 0.32]}>
        <boxGeometry args={[1.4, 1.6, 0.06]} />
        <Mat color="#3a2418" kind="wood" />
      </mesh>
      <mesh position={[-2.6, 1.7, -half + 0.36]}>
        <boxGeometry args={[1.15, 1.25, 0.02]} />
        <Mat color="#c9a227" kind="cloth" repeat={[1, 1]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -1.2]}>
        <planeGeometry args={[4.4, 3.6]} />
        <Mat color="#6a2030" kind="carpet" repeat={[3, 3]} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.58, -1.55]}>
        <boxGeometry args={[2.35, 0.08, 1.15]} />
        <Mat color="#5a3a28" kind="wood" repeat={[3, 2]} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.64, -1.55]}>
        <boxGeometry args={[2.28, 0.04, 1.08]} />
        <Mat color="#f4ead8" kind="cloth" repeat={[3, 2]} roughness={0.78} />
      </mesh>
      {[
        [-1, -0.45],
        [1, -0.45],
        [-1, 0.45],
        [1, 0.45],
      ].map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 0.3, -1.55 + z]}>
          <boxGeometry args={[0.1, 0.56, 0.1]} />
          <Mat color="#5a3a28" kind="wood" />
        </mesh>
      ))}
      <Place position={[-0.45, 0.7, -1.4]} />
      <Place position={[0.45, 0.7, -1.7]} />
      <mesh position={[0, 0.72, -1.55]} rotation={[-0.4, 0.2, 0]}>
        <boxGeometry args={[0.16, 0.01, 0.22]} />
        <Mat color="#efe0c8" kind="paper" />
      </mesh>
      <mesh position={[0.02, 0.78, -1.52]}>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 10]} />
        <Mat color="#6a3a2a" kind="wood" />
      </mesh>
      <mesh position={[0.02, 0.92, -1.52]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color="#c45c4a" roughness={0.45} />
      </mesh>
      <mesh position={[-0.7, 0.78, -1.35]}>
        <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <mesh position={[-0.7, 0.9, -1.35]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffb020" emissive="#ff8a00" emissiveIntensity={1.3} />
      </mesh>
      <mesh position={[0.7, 0.78, -1.72]}>
        <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <mesh position={[0.7, 0.9, -1.72]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffb020" emissive="#ff8a00" emissiveIntensity={1.3} />
      </mesh>
      <Chair position={[0, 0, -0.62]} />
      <Chair position={[0.15, 0, -2.48]} rotationY={Math.PI} />
      <mesh position={[-2.8, 0.7, 0.2]}>
        <boxGeometry args={[1.1, 1.15, 0.42]} />
        <Mat color="#5a3a28" kind="wood" repeat={[1, 2]} />
      </mesh>
      <mesh position={[-2.8, 1.32, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.28, 10]} />
        <meshStandardMaterial color="#c8dce8" roughness={0.2} metalness={0.25} transparent opacity={0.45} />
      </mesh>
      <mesh position={[-2.55, 1.28, 0.28]}>
        <cylinderGeometry args={[0.04, 0.045, 0.22, 10]} />
        <meshStandardMaterial color="#5a1a28" roughness={0.3} />
      </mesh>
      <Planter position={[3.2, 0, 1.2]} />
      <Planter position={[-3.4, 0, 2.2]} />
      <RuSign text="СТОЛ НА ДВОИХ" position={[0, 2.85, -half + 0.4]} size={0.14} color="#ffd27a" />
      <Lantern position={[-1.4, 2.35, -0.2]} />
      <Lantern position={[1.4, 2.35, -0.2]} />
      <Lantern position={[0, 2.5, -1.55]} />
      <pointLight position={[0, 3.1, -1.2]} color="#ffc070" intensity={0.7} distance={9} />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function PostSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#1c1824" fog={['#1c1824', 8, 18]} ambient={0.24} dirIntensity={0.25} dirColor="#6070a0" />
      <Floor half={half} color="#6a6258" kind="tile" />
      <WallRing half={half} color="#d8d0c0" height={3.2} kind="plaster" />
      <mesh position={[0, 3.28, 0]}>
        <boxGeometry args={[half * 2, 0.1, half * 2]} />
        <Mat color="#3a3450" kind="stone" repeat={[6, 6]} />
      </mesh>
      <mesh position={[0, 1.02, -2.45]}>
        <boxGeometry args={[4.6, 1.04, 0.78]} />
        <Mat color="#3a5a8a" kind="wood" repeat={[4, 1]} roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.56, -2.45]}>
        <boxGeometry args={[4.7, 0.08, 0.88]} />
        <Mat color="#c4a070" kind="wood" repeat={[4, 1]} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.08, -1.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.4]} />
        <Mat color="#3a2a4a" kind="carpet" repeat={[2, 1]} />
      </mesh>
      {[-1.5, -0.5, 0.5, 1.5].map((x) =>
        [1.95, 2.35, 2.75].map((y) => (
          <mesh key={`${x}:${y}`} position={[x, y, -2.62]}>
            <boxGeometry args={[0.72, 0.32, 0.22]} />
            <Mat color="#2a3a5a" kind="wood" />
          </mesh>
        )),
      )}
      {[-1.35, -0.35, 0.4, 1.2, 1.55].map((x, i) => (
        <mesh key={`let-${x}`} position={[x, 2.12 + (i % 3) * 0.4, -2.5]} rotation={[0.1, 0.08 * (i - 2), 0]}>
          <boxGeometry args={[0.28, 0.2, 0.04]} />
          <Mat color={i % 2 ? '#f4ead8' : '#e8d5c4'} kind="paper" />
        </mesh>
      ))}
      <mesh position={[-1.2, 1.68, -2.05]}>
        <cylinderGeometry args={[0.12, 0.14, 0.08, 12]} />
        <meshStandardMaterial color="#8a8a90" roughness={0.35} metalness={0.45} />
      </mesh>
      <mesh position={[-0.7, 1.66, -2.05]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 10]} />
        <meshStandardMaterial color="#c9a227" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.2, 1.64, -2.1]} rotation={[-0.2, 0.3, 0]}>
        <boxGeometry args={[0.32, 0.02, 0.22]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <mesh position={[0.55, 1.64, -2.05]}>
        <boxGeometry args={[0.18, 0.06, 0.14]} />
        <Mat color="#5a1a28" kind="lacquer" />
      </mesh>
      <mesh position={[-2.4, 2.55, -2.55]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
      </mesh>
      <mesh position={[-2.4, 2.55, -2.52]}>
        <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
        <meshStandardMaterial color="#f4ead8" />
      </mesh>
      <mesh position={[2.4, 2.2, -2.55]}>
        <boxGeometry args={[1.2, 1.1, 0.08]} />
        <Mat color="#2a3a5a" kind="paper" />
      </mesh>
      <RuSign text="ПОЧТА" position={[2.4, 2.45, -2.5]} size={0.16} color="#ffd27a" />
      <RuSign text="Одно письмо" position={[2.4, 2.15, -2.5]} size={0.1} color="#f4ead8" />
      <Kit file="ticket-machine.glb" position={[2.2, 0, -1.15]} scale={1} />
      <mesh position={[-2.4, 0.42, 0.6]}>
        <boxGeometry args={[0.9, 0.55, 0.7]} />
        <Mat color="#3a5a8a" kind="cloth" repeat={[1, 1]} />
      </mesh>
      <mesh position={[-2.4, 0.72, 0.6]} rotation={[0.2, 0.3, 0.1]}>
        <boxGeometry args={[0.5, 0.08, 0.36]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <mesh position={[-2.15, 0.78, 0.45]} rotation={[-0.1, -0.2, 0.2]}>
        <boxGeometry args={[0.4, 0.06, 0.28]} />
        <Mat color="#e8d5c4" kind="paper" />
      </mesh>
      <Bench position={[2.4, 0, 1.8]} rotationY={-0.4} />
      <mesh position={[-2.6, 1.7, -half + 0.32]}>
        <boxGeometry args={[1.8, 1.4, 0.08]} />
        <meshStandardMaterial color="#7ecbff" transparent opacity={0.2} roughness={0.1} />
      </mesh>
      <mesh position={[0, 3.05, -0.4]}>
        <cylinderGeometry args={[0.18, 0.22, 0.12, 12]} />
        <meshStandardMaterial color="#c9a227" emissive="#ffb020" emissiveIntensity={0.4} />
      </mesh>
      <pointLight position={[0, 2.9, -0.4]} color="#ffd27a" intensity={0.55} distance={8} />
      <Lantern position={[-1.8, 2.4, -1.2]} />
      <Lantern position={[1.6, 2.4, -1.2]} />
      <RuSign text="ШТЕМПЕЛЬ — ТОЛЬКО С ТВОЕЙ РУКИ" position={[0, 2.95, -2.35]} size={0.1} color="#ffd27a" />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function CampusSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights sky="#b8c8d8" fog={['#b8c8d8', 16, 32]} />
      <Floor half={half} color="#6a6a60" kind="stone" />
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
      <Floor half={half} color="#3a4a38" kind="tile" />
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
