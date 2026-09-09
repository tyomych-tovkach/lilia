import { useFrame } from '@react-three/fiber'
import { useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { crashVisualT, type CrashStage } from '../logic'
import { useInvite } from '../state'
import {
  Archway,
  Bench,
  Cornice,
  GroundSkirt,
  HedgeRing,
  IndoorSkirting,
  Kanji,
  Lantern,
  Mat,
  Planter,
  RoomBounds,
  RoomLights,
  RuSign,
} from './Craft'
import {
  Ball,
  Beam,
  Candle,
  CityBlock,
  Column,
  FairyWire,
  GetaPair,
  GymFixture,
  GymHoop,
  HungChochin,
  Koi,
  Kotoji,
  Lockers,
  Mailbox,
  Maple,
  PlaceSetting,
  Pot,
  StoneLantern,
  Tsuitate,
  VolleyNet,
  VkusnoLogo,
  Zabuton,
} from './Dress'
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

function TatamiGrid({ half }: { half: number }) {
  const tiles = []
  const w = 1.82
  const d = 0.91
  let n = 0
  for (let x = -half + 0.95; x < half - 0.7; x += w) {
    for (let z = -half + 0.55; z < half - 0.55; z += d) {
      const odd = n % 2 === 0
      tiles.push(
        <mesh key={`${x}:${z}`} position={[x, 0.035, z]}>
          <boxGeometry args={[w - 0.02, 0.07, d - 0.02]} />
          <Mat color={odd ? '#c4a86a' : '#b89858'} kind="tatami" />
        </mesh>,
      )
      n += 1
      if (n > 90) break
    }
  }
  return <group>{tiles}</group>
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

export function FoyerSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights
        sky="#2a1824"
        fog={['#3a2430', 14, 34]}
        ambient={0.38}
        dirIntensity={0.42}
        dirColor="#ffd0dc"
        hemiSky="#ffd4e4"
        hemiGround="#5a2838"
        hemiIntensity={0.16}
        dirPosition={[-1.5, 10, 7]}
      />
      <Floor half={half} color="#e8d4c8" kind="wood" />
      <IndoorSkirting half={half} color="#8a4a58" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0.15]}>
        <planeGeometry args={[2.15, half * 1.78]} />
        <Mat color="#d4849a" kind="carpet" repeat={[1, 6]} roughness={0.78} />
      </mesh>
      {[-1.12, 1.12].map((x) => (
        <mesh key={x} position={[x, 0.035, 0.15]}>
          <boxGeometry args={[0.08, 0.01, half * 1.78]} />
          <meshStandardMaterial color="#c45c7a" />
        </mesh>
      ))}
      <mesh position={[0, 4.35, 0]}>
        <boxGeometry args={[half * 2 + 0.2, 0.18, half * 2 + 0.2]} />
        <Mat color="#f0d8d0" kind="wood" repeat={[8, 8]} />
      </mesh>
      <Cornice half={half} y={4.22} color="#e8c0c8" />
      {[-5.2, -2.4, 0.6, 3.4].map((z) => (
        <Beam key={z} z={z} half={half} />
      ))}
      <mesh position={[0, 4.05, 0]}>
        <sphereGeometry args={[0.32, 32, 24]} />
        <meshStandardMaterial color="#ffd0dc" emissive="#f4b6c8" emissiveIntensity={1.35} />
      </mesh>
      <pointLight position={[0, 3.7, 0]} color="#ffb8c8" intensity={0.95} distance={16} />
      <pointLight position={[0, 3.15, half - 1.4]} color="#ffc8a0" intensity={0.45} distance={8} />
      <WallRing half={half} color="#f3ddd6" height={4.28} kind="plaster" />
      <mesh position={[-2.35, 2.15, -half + 1.15]}>
        <cylinderGeometry args={[0.16, 0.2, 4.2, 32]} />
        <Mat color="#efe0d4" kind="plaster" repeat={[1, 3]} />
      </mesh>
      <mesh position={[2.35, 2.15, -half + 1.15]}>
        <cylinderGeometry args={[0.16, 0.2, 4.2, 32]} />
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
      <Kakemono position={[-half + 0.48, 0.2, -1.6]} rotationY={Math.PI / 2} kind="sakura" kanji="桜" />
      <Kakemono position={[-half + 0.48, 0.15, 2.2]} rotationY={Math.PI / 2} kind="wave" kanji="春" />
      <Kakemono position={[half - 0.48, 0.2, -1.2]} rotationY={-Math.PI / 2} kind="crane" kanji="鶴" />
      <Kakemono position={[half - 0.48, 0.15, 2.8]} rotationY={-Math.PI / 2} kind="sakura" kanji="夢" />
      <Byobu position={[-3.15, 0, 0.35]} rotationY={0.32} />
      <LowTable position={[-2.55, 0, 1.85]} />
      <Ikebana position={[-2.55, 0.35, 1.85]} />
      <Tsuitate position={[-3.35, 0, 3.15]} />
      <Tsukubai position={[1.72, 0, -2.85]} />
      <Toro position={[-1.72, 0, -2.85]} />
      <FanWall position={[-half + 0.5, 1.8, 0.8]} rotationY={Math.PI / 2} />
      <FanWall position={[half - 0.5, 1.9, -5.2]} rotationY={-Math.PI / 2} />
      <OrigamiString position={[-1.15, 0, -half + 2.35]} />
      <OrigamiString position={[1.2, 0, -half + 2.2]} />
      <OrigamiString position={[-1.4, 0, -2]} />
      <OrigamiString position={[1.5, 0, -1.6]} />
      <HungChochin position={[-2.1, 2.55, -1.1]} lit />
      <HungChochin position={[2.1, 2.55, -1.1]} lit />
      <HungChochin position={[0, 2.45, 4.3]} />
      <HungChochin position={[-4.2, 2.35, 2.2]} />
      <HungChochin position={[4.3, 2.35, 2.4]} />
      <Chochin position={[-3.2, 2.2, -3.4]} />
      <Chochin position={[3.4, 2.2, -3.2]} />
      <Chochin position={[0, 2.3, -4.6]} lit />
      <Noren position={[-4.8, 0, 6.6]} rotationY={Math.PI} label="桜" />
      <Noren position={[4.8, 0, 6.6]} rotationY={Math.PI} label="春" />
      <Bench position={[-2.7, 0, 4.55]} rotationY={0.15} />
      <Bench position={[2.7, 0, 4.55]} rotationY={-0.15} />
      <GetaPair position={[-0.95, 0, -half + 2.15]} />
      <GetaPair position={[0.95, 0, -half + 2.15]} />
      <Zabuton position={[0, 0.04, 0.35]} color="#c45c7a" />
      <Petals />
      <Kanji text="桜" position={[0, 0.08, -2.2]} rotation={[-Math.PI / 2, 0, 0]} size={0.55} color="#e8a0b4" />
      <RoomBounds half={half} wallH={4.3} />
      {children}
    </>
  )
}

export function GardenSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights
        sky="#c48a58"
        fog={['#d4a878', 16, 40]}
        ambient={0.36}
        dirIntensity={1.05}
        dirColor="#ffc878"
        hemiSky="#f0c890"
        hemiGround="#3a4028"
        hemiIntensity={0.28}
        dirPosition={[9, 9, -5]}
        skyDome
      />
      <GroundSkirt radius={34} color="#2a4a28" y={-0.06} />
      <HedgeRing half={half} />
      <Floor half={half} color="#3a5a32" kind="grass" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.42, 0.02, 1.35]}>
        <planeGeometry args={[1.45, 6.4]} />
        <meshStandardMaterial color="#c4b8a0" roughness={0.92} />
      </mesh>
      <mesh position={[-1.55, 0.05, -1.45]}>
        <cylinderGeometry args={[2.52, 2.52, 0.22, 48]} />
        <meshStandardMaterial color="#7a7468" roughness={0.88} />
      </mesh>
      <mesh position={[-1.55, -0.04, -1.45]}>
        <cylinderGeometry args={[2.22, 2.22, 0.08, 48]} />
        <meshStandardMaterial color="#4a8898" transparent opacity={0.62} roughness={0.1} metalness={0.28} />
      </mesh>
      <Kotoji position={[0.12, 0, -1.22]} letter />
      {[
        [0.02, 0.2, 0.52, 0.12],
        [-0.45, 0.2, 0.05, 0.4],
        [-0.95, 0.2, -0.5, 0.7],
        [-1.5, 0.2, -1.1, 1.0],
        [-2.12, 0.2, -1.78, 1.2],
      ].map(([x, y, z, rot], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, rot, 0]}>
          <mesh>
            <boxGeometry args={[0.92, 0.07, 0.34]} />
            <Mat color="#6a5a48" kind="wood" />
          </mesh>
          {[-0.3, 0.3].map((px) => (
            <mesh key={px} position={[px, -0.12, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.22, 16]} />
              <Mat color="#5a4a38" kind="wood" />
            </mesh>
          ))}
        </group>
      ))}
      <Maple position={[-3.6, 0, -2.8]} />
      <Maple position={[3.4, 0, -2.4]} scale={1.12} />
      <Maple position={[-4.1, 0, 2.2]} scale={0.88} />
      <Maple position={[3.9, 0, 2.8]} scale={0.95} />
      <Maple position={[0.2, 0, 3.55]} scale={0.82} />
      <SakuraTree position={[4.6, 0, -0.4]} scale={0.7} />
      <SakuraTree position={[-5.1, 0, 3.9]} scale={0.62} />
      <Koi position={[-1.2, 0.02, -0.8]} />
      <Koi position={[-2.1, 0.01, -1.8]} color="#c45c4a" />
      <Koi position={[-0.7, 0.02, -2.2]} color="#e8a060" />
      <StoneLantern position={[1.15, 0, -3.4]} />
      <StoneLantern position={[-2.4, 0, 3.6]} />
      <mesh position={[0.85, 0.07, 0.38]} scale={[1, 0.35, 1]}>
        <sphereGeometry args={[0.55, 32, 20]} />
        <meshStandardMaterial color="#2a4a28" roughness={0.9} />
      </mesh>
      <mesh position={[1.35, 0.08, 1.15]}>
        <boxGeometry args={[0.45, 0.16, 0.32]} />
        <Mat color="#6a655c" kind="stone" />
      </mesh>
      <Tsukubai position={[-3.6, 0, -0.4]} />
      <Tsukubai position={[3.15, 0, 1.55]} />
      <Bench position={[2.15, 0, 4.05]} rotationY={-0.4} />
      <Bench position={[-3.35, 0, 4.2]} rotationY={0.35} />
      <Planter position={[5.2, 0, 2.1]} />
      <Planter position={[-5.35, 0, 1.2]} />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function TeaSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights
        sky="#140c0a"
        fog={['#1c100c', 8, 18]}
        ambient={0.14}
        dirIntensity={0.06}
        dirColor="#ffb070"
        hemiSky="#f0d0a8"
        hemiGround="#3a2418"
        hemiIntensity={0.12}
        dirPosition={[2, 8, 4]}
      />
      <Floor half={half} color="#6a5230" kind="wood" />
      <TatamiGrid half={half} />
      <WallRing half={half} color="#f0e0d0" height={2.9} kind="plaster" />
      <IndoorSkirting half={half} color="#4a3020" height={0.18} />
      {[-half + 0.28, half - 0.28].map((_, i) => (
        <mesh key={`dado${i}`} position={[0, 0.95, i === 0 ? -half + 0.28 : half - 0.28]}>
          <boxGeometry args={[half * 2 - 0.4, 0.08, 0.04]} />
          <Mat color="#5a3a28" kind="wood" />
        </mesh>
      ))}
      <mesh position={[-half + 0.28, 0.95, 0]}>
        <boxGeometry args={[0.04, 0.08, half * 2 - 0.4]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <mesh position={[half - 0.28, 0.95, 0]}>
        <boxGeometry args={[0.04, 0.08, half * 2 - 0.4]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <mesh position={[0, 2.78, 0]}>
        <boxGeometry args={[half * 2 + 0.15, 0.14, half * 2 + 0.15]} />
        <Mat color="#3a281c" kind="wood" repeat={[6, 6]} roughness={0.7} />
      </mesh>
      <Cornice half={half} y={2.68} color="#4a3224" />
      {[-2.4, 0, 2.4].map((x) => (
        <mesh key={x} position={[x, 2.62, 0]}>
          <boxGeometry args={[0.16, 0.14, half * 2]} />
          <Mat color="#3a2418" kind="wood" repeat={[1, 8]} />
        </mesh>
      ))}
      <Noren position={[0, 0, 1.35]} label="茶" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 2.55]}>
        <planeGeometry args={[2.4, 2.1]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </mesh>
      <GetaPair position={[-0.35, 0, 1.55]} />
      <GetaPair position={[0.4, 0, 1.55]} />
      <mesh position={[0, 0.3, -1.12]}>
        <boxGeometry args={[0.92, 0.05, 0.92]} />
        <Mat color="#2a1810" kind="lacquer" />
      </mesh>
      <mesh position={[0, 0.18, -1.72]}>
        <boxGeometry args={[0.42, 0.08, 0.42]} />
        <Mat color="#3a2418" kind="wood" />
      </mesh>
      <mesh position={[0, 0.42, -1.72]}>
        <sphereGeometry args={[0.14, 32, 24]} />
        <meshStandardMaterial color="#2a2420" metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.55, -1.72]}>
        <cylinderGeometry args={[0.05, 0.08, 0.08, 24]} />
        <meshStandardMaterial color="#1a1816" />
      </mesh>
      <pointLight position={[0.02, 0.42, -1.72]} color="#ff8a40" intensity={0.7} distance={3.2} />
      <mesh position={[-0.22, 0.36, -0.95]}>
        <cylinderGeometry args={[0.07, 0.08, 0.07, 32]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <mesh position={[0.22, 0.36, -0.95]}>
        <cylinderGeometry args={[0.07, 0.08, 0.07, 32]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <Zabuton position={[-0.82, 0.04, -0.52]} />
      <Zabuton position={[0.82, 0.04, -0.52]} />
      <mesh position={[-1.55, 1.15, -3.15]}>
        <boxGeometry args={[1.15, 2.2, 0.08]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <mesh position={[-1.55, 1.35, -3.08]}>
        <boxGeometry args={[0.42, 1.35, 0.02]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <Kanji text="和" position={[-1.55, 1.55, -3.04]} size={0.28} color="#5a1a28" />
      <mesh position={[-2.45, 0.55, -2.05]}>
        <boxGeometry args={[0.7, 0.7, 0.08]} />
        <Mat color="#2a1810" kind="wood" />
      </mesh>
      <mesh position={[2.55, 0.85, -1.65]}>
        <boxGeometry args={[0.9, 1.7, 0.32]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      {[0.45, 0.85, 1.25].map((y) => (
        <group key={y}>
          <mesh position={[2.42, y, -1.48]}>
            <cylinderGeometry args={[0.07, 0.08, 0.16, 24]} />
            <Mat color="#5a1a28" kind="lacquer" />
          </mesh>
          <mesh position={[2.62, y, -1.48]}>
            <cylinderGeometry args={[0.07, 0.08, 0.16, 24]} />
            <Mat color="#1a4a32" kind="lacquer" />
          </mesh>
        </group>
      ))}
      {[-2.8, -0.9, 0.9, 2.8].map((x) => (
        <mesh key={x} position={[x, 1.4, -half + 0.28]}>
          <boxGeometry args={[1.7, 2.4, 0.05]} />
          <Mat color="#f4ead8" kind="paper" repeat={[2, 3]} roughness={0.7} />
        </mesh>
      ))}
      <Shoji position={[-half + 0.42, 0, -1.4]} rotationY={Math.PI / 2} width={2.2} height={2.4} />
      <Shoji position={[half - 0.42, 0, -1.2]} rotationY={-Math.PI / 2} width={2.2} height={2.4} />
      <Shoji position={[-half + 0.42, 0, 2.4]} rotationY={Math.PI / 2} width={2} height={2.3} />
      <pointLight position={[0, 1.6, -6.4]} color="#f0d8b0" intensity={0.45} distance={7} />
      <Lantern position={[-1.7, 1.4, 0.15]} />
      <Lantern position={[1.7, 1.4, 0.15]} />
      <Lantern position={[-0.4, 1.35, -2.85]} />
      <Bench position={[-2.6, 0, 3.35]} />
      <Ikebana position={[2.4, 0, 2.85]} />
      <RoomBounds half={half} wallH={3} />
      {children}
    </>
  )
}

export function CourtSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights
        sky="#141820"
        fog={['#2a3038', 12, 30]}
        ambient={0.22}
        dirIntensity={0.18}
        dirColor="#c8d4e0"
        hemiSky="#3a4450"
        hemiGround="#1a1810"
        hemiIntensity={0.08}
        dirPosition={[4, 12, 2]}
      />
      <Floor half={half} color="#c4a060" kind="wood" />
      <IndoorSkirting half={half} color="#4a4030" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -0.35]}>
        <planeGeometry args={[6.4, 11.2]} />
        <meshStandardMaterial color="#b89458" roughness={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.55, 0.013, -4.85]}>
        <circleGeometry args={[0.85, 24]} />
        <meshStandardMaterial color="#8a7048" roughness={0.95} />
      </mesh>
      <WallRing half={half} color="#e8dcc8" height={5.28} kind="plaster" />
      <mesh position={[0, 5.4, 0]}>
        <boxGeometry args={[14.9, 0.16, 14.9]} />
        <meshStandardMaterial color="#3a4038" />
      </mesh>
      {[-5.2, -2.6, 0, 2.6, 5.2].map((z) => (
        <mesh key={z} position={[0, 5.22, z]}>
          <boxGeometry args={[14.2, 0.18, 0.18]} />
          <meshStandardMaterial color="#2a3028" />
        </mesh>
      ))}
      {[
        [-3.2, 4.15, 3.2],
        [3.2, 4.15, 3.2],
        [-3.2, 4.15, -0.4],
        [3.2, 4.15, -0.4],
        [-3.2, 4.15, -3.8],
        [3.2, 4.15, -3.8],
      ].map(([x, y, z]) => (
        <GymFixture key={`${x}:${z}`} position={[x, y, z]} />
      ))}
      {[
        [0, 0.021, 4.85, 5.4, 0.045],
        [0, 0.021, -5.55, 5.4, 0.045],
        [0, 0.021, 1.55, 5.4, 0.04],
        [0, 0.021, -2.25, 5.4, 0.04],
      ].map(([x, y, z, w, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, 0.012, d]} />
          <meshStandardMaterial color="#f4f0e0" />
        </mesh>
      ))}
      {[-2.7, 2.7, -3.15, 3.15].map((x) => (
        <mesh key={x} position={[x, 0.021, -0.35]}>
          <boxGeometry args={[0.04, 0.012, 10.4]} />
          <meshStandardMaterial color="#f4f0e0" />
        </mesh>
      ))}
      <VolleyNet />
      <GymHoop position={[0, 0, -half + 0.28]} />
      <RuSign text="0 : 0" position={[0, 3.85, -half + 0.25]} size={0.22} color="#6a6858" />
      <RuSign text="ВОЛЕЙБОЛ" position={[-half + 0.35, 2.6, -3.2]} size={0.14} color="#7dffb3" />
      <RuSign text="БРОСОК" position={[half - 0.35, 2.6, -3.2]} size={0.14} color="#e8782c" />
      {[-4.4, -1.5, 1.4, 4.3].map((z) => (
        <mesh key={`wL${z}`} position={[-half + 0.22, 3.35, z]}>
          <boxGeometry args={[0.06, 1.6, 2.1]} />
          <meshStandardMaterial color="#7ecbff" transparent opacity={0.18} roughness={0.08} />
        </mesh>
      ))}
      {[-4.4, -1.5, 1.4, 4.3].map((z) => (
        <mesh key={`wR${z}`} position={[half - 0.22, 3.35, z]}>
          <boxGeometry args={[0.06, 1.6, 2.1]} />
          <meshStandardMaterial color="#7ecbff" transparent opacity={0.18} roughness={0.08} />
        </mesh>
      ))}
      <Bench position={[-5.55, 0, 3.4]} rotationY={Math.PI / 2} />
      <Bench position={[-5.55, 0, 1.1]} rotationY={Math.PI / 2} />
      <Bench position={[-5.55, 0, -2.15]} rotationY={Math.PI / 2} />
      <Bench position={[-5.55, 0, -4.35]} rotationY={Math.PI / 2} />
      <Bench position={[5.55, 0, 3.4]} rotationY={-Math.PI / 2} />
      <Bench position={[5.55, 0, 1.1]} rotationY={-Math.PI / 2} />
      <Bench position={[5.55, 0, -2.15]} rotationY={-Math.PI / 2} />
      <Ball position={[-5.5, 0.14, -4.4]} color="#f4f0e0" />
      <Ball position={[-5.35, 0.14, -4.55]} color="#f4ead8" />
      <Ball position={[5.5, 0.12, -4.2]} color="#e8782c" r={0.12} />
      <Ball position={[5.35, 0.12, -4.4]} color="#e05030" r={0.12} />
      <Ball position={[5.4, 0.055, 4.5]} color="#c8e030" r={0.055} />
      <Ball position={[1.85, 0.11, 0.15]} color="#f4f0e0" />
      <Ball position={[-1.55, 0.12, 2.55]} color="#e8782c" r={0.12} />
      <mesh position={[4.15, 0.48, 5.35]}>
        <cylinderGeometry args={[0.22, 0.22, 0.95, 32]} />
        <meshStandardMaterial color="#d8e4ec" />
      </mesh>
      <RoomBounds half={half} wallH={5.2} />
      {children}
    </>
  )
}

export function RoofSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights
        sky="#0a0e1c"
        fog={['#101628', 12, 34]}
        ambient={0.12}
        dirIntensity={0.28}
        dirColor="#c8d4ff"
        hemiSky="#2a3458"
        hemiGround="#121018"
        hemiIntensity={0.1}
        dirPosition={[-8, 16, -6]}
        skyDome
      />
      <GroundSkirt radius={40} color="#0c1018" y={-2.05} />
      <mesh position={[0, -1.95, -16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[48, 28]} />
        <meshStandardMaterial color="#12141c" roughness={0.98} />
      </mesh>
      <Floor half={half} color="#2a2438" kind="stone" />
      {[-4.5, -1.5, 1.5, 4.5].map((z) => (
        <mesh key={z} position={[0, 0.015, z]}>
          <boxGeometry args={[12, 0.01, 0.04]} />
          <meshStandardMaterial color="#1a1428" />
        </mesh>
      ))}
      <mesh position={[0, 0.52, -half + 0.22]}>
        <boxGeometry args={[half * 2, 1.04, 0.28]} />
        <meshStandardMaterial color="#4a4460" />
      </mesh>
      <mesh position={[-half + 0.22, 0.52, 0]}>
        <boxGeometry args={[0.28, 1.04, half * 2]} />
        <meshStandardMaterial color="#4a4460" />
      </mesh>
      <mesh position={[half - 0.22, 0.52, 0]}>
        <boxGeometry args={[0.28, 1.04, half * 2]} />
        <meshStandardMaterial color="#4a4460" />
      </mesh>
      <mesh position={[-(half / 2 + 0.9), 0.52, half - 0.22]}>
        <boxGeometry args={[half - 1.7, 1.04, 0.28]} />
        <meshStandardMaterial color="#4a4460" />
      </mesh>
      <mesh position={[half / 2 + 0.9, 0.52, half - 0.22]}>
        <boxGeometry args={[half - 1.7, 1.04, 0.28]} />
        <meshStandardMaterial color="#4a4460" />
      </mesh>
      <mesh position={[-1.55, 0.22, -2.15]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[2.15, 0.28, 0.85]} />
        <Mat color="#3a2a6a" kind="cloth" />
      </mesh>
      <mesh position={[-1.55, 0.42, -2.28]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[2.05, 0.18, 0.28]} />
        <Mat color="#4a3a7a" kind="cloth" />
      </mesh>
      <mesh position={[0.15, 0.28, -2.05]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 32]} />
        <Mat color="#2a1810" kind="lacquer" />
      </mesh>
      <mesh position={[0.05, 0.4, -1.92]}>
        <cylinderGeometry args={[0.035, 0.035, 0.16, 16]} />
        <meshStandardMaterial color="#3a1a14" />
      </mesh>
      <group position={[2.55, 0, -2.95]} rotation={[0, -0.35, 0]}>
        {[-0.18, 0.18, 0].map((x, i) => (
          <mesh key={x} position={[i === 2 ? 0 : x, 0.45, i === 2 ? -0.16 : 0.12]} rotation={[0.45, 0, i ? 0.3 : -0.3]}>
            <cylinderGeometry args={[0.02, 0.02, 1.1, 12]} />
            <meshStandardMaterial color="#3a3a40" />
          </mesh>
        ))}
        <mesh position={[0, 1.05, -0.2]} rotation={[-0.42, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.95, 32]} />
          <meshStandardMaterial color="#2a2a30" metalness={0.4} />
        </mesh>
      </group>
      {[
        [-5.4, -5.5],
        [-4.2, -5.85],
        [3.9, -5.7],
        [5.35, -4.1],
        [-5.6, -1.2],
        [5.55, -0.4],
        [-2.8, 3.6],
        [2.6, 3.85],
      ].map(([x, z]) => (
        <Pot key={`${x}:${z}`} position={[x, 0, z]} />
      ))}
      <mesh position={[-5.85, 0.32, 4.9]}>
        <boxGeometry args={[0.7, 0.55, 0.85]} />
        <meshStandardMaterial color="#3a3a48" />
      </mesh>
      <mesh position={[4.55, 1.08, 4.85]}>
        <boxGeometry args={[1.8, 2.15, 1.2]} />
        <meshStandardMaterial color="#2a2438" />
      </mesh>
      {[-4.8, 4.8].map((x) => (
        <mesh key={x} position={[x, 1.15, 3.2]}>
          <cylinderGeometry args={[0.03, 0.03, 2.3, 12]} />
          <meshStandardMaterial color="#2a2a30" />
        </mesh>
      ))}
      <FairyWire from={[-4.8, 2.22, 3.2]} to={[4.8, 2.22, 3.2]} />
      <mesh position={[10, 14, -18]}>
        <sphereGeometry args={[1.15, 32, 24]} />
        <meshStandardMaterial color="#f4ead8" emissive="#f0e8d0" emissiveIntensity={0.85} />
      </mesh>
      <CityBlock position={[-6.2, 0, -9.2]} size={[2.2, 3.4, 1.4]} />
      <CityBlock position={[-4.1, 0, -9.6]} size={[2.4, 4.8, 1.5]} />
      <CityBlock position={[-2, 0, -8.8]} size={[1.8, 2.6, 1.2]} />
      <CityBlock position={[0.2, 0, -10]} size={[2.6, 5.4, 1.6]} />
      <CityBlock position={[2.3, 0, -9.1]} size={[2, 3.1, 1.3]} />
      <CityBlock position={[4.4, 0, -9.5]} size={[2.2, 4.2, 1.4]} />
      <CityBlock position={[6.5, 0, -8.9]} size={[1.8, 2.8, 1.2]} />
      <CityBlock position={[-11.2, 0, -4.2]} size={[2.4, 4.1, 1.6]} />
      <CityBlock position={[-10.6, 0, 1.4]} size={[2, 3.2, 1.4]} />
      <CityBlock position={[11.1, 0, -3.8]} size={[2.2, 4.6, 1.5]} />
      <CityBlock position={[10.4, 0, 2.2]} size={[1.9, 2.9, 1.3]} />
      <Lantern position={[-1.6, 1.5, -1.8]} />
      <Lantern position={[1.6, 1.5, -1.8]} />
      <pointLight position={[0, 2.4, 3.2]} color="#ffc070" intensity={0.35} distance={9} />
      <RoomBounds half={half} wallH={1.6} />
      {children}
    </>
  )
}

const PLANK = 8.6 / 7
const PLANK_Z = (i: number) => 3.685714 - i * PLANK

const FALL: Record<number, { p: [number, number, number]; r: [number, number, number] }> = {
  0: { p: [0.2, -0.18, 3.7], r: [0.12, 0.05, 0.18] },
  1: { p: [-0.15, -0.35, 2.5], r: [0.28, -0.1, -0.22] },
  2: { p: [0.55, -0.95, 1.2], r: [0.9, 0.4, 0.7] },
  3: { p: [-0.4, -1.4, 0.1], r: [1.2, -0.5, -0.9] },
  4: { p: [0.25, -0.55, -1.2], r: [0.45, 0.2, 0.35] },
  5: { p: [-0.8, -1.8, -2.5], r: [1.45, 0.6, -1.1] },
  6: { p: [0.9, -2.4, -3.8], r: [1.8, -0.4, 1.2] },
}

export function BridgeSet({ half, children }: { half: number; children?: ReactNode }) {
  const { state } = useInvite()
  const planks = useRef<(THREE.Group | null)[]>([])
  const railL = useRef<THREE.Group>(null)
  const railR = useRef<THREE.Group>(null)
  const water = useRef<THREE.Mesh>(null)
  const ghost = useRef<THREE.Mesh>(null)
  const chips = useRef<THREE.InstancedMesh>(null)
  const dummy = useRef(new THREE.Object3D())
  const visual = useRef(crashVisualT((state.crashStage ?? 0) as CrashStage))
  const stage = (state.saidYes ? 0 : state.crashStage ?? 0) as CrashStage
  const target = crashVisualT(stage)

  useFrame((st, dt) => {
    const k = state.saidYes ? 1.7 : 2.6
    visual.current += (target - visual.current) * Math.min(1, dt * k)
    const t = visual.current
    planks.current.forEach((g, i) => {
      if (!g) return
      const restZ = PLANK_Z(i)
      const fall = FALL[i]
      g.position.set(fall.p[0] * t, 0.04 + (fall.p[1] - 0.04) * t, restZ + (fall.p[2] - restZ) * t)
      g.rotation.set(fall.r[0] * t, fall.r[1] * t, fall.r[2] * t)
    })
    if (railL.current) {
      railL.current.position.set(-1.05 - 0.35 * t, 0.55 - 0.75 * t, 0.4 * t)
      railL.current.rotation.set(0.4 * t, 0.2 * t, 1.15 * t)
    }
    if (railR.current) {
      railR.current.position.set(1.05 + 0.45 * t, 0.55 - 1.15 * t, -0.5 * t)
      railR.current.rotation.set(-0.5 * t, -0.2 * t, -1.35 * t)
    }
    if (water.current) {
      water.current.position.y = -0.38 - 0.16 * t
      const mat = water.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.72 + 0.23 * t
      mat.color.set(t > 0.5 ? '#120018' : '#16344c')
    }
    if (ghost.current) ghost.current.visible = t > 0.35
    if (chips.current && t > 0.35) {
      const n = t > 0.85 ? 40 : 24
      for (let i = 0; i < 40; i++) {
        dummy.current.position.set(((i * 17) % 11) * 0.12 - 0.6, 0.4 - ((st.clock.elapsedTime * (1.4 + (i % 5) * 0.2) + i) % 2.6) * t, ((i * 13) % 9) * 0.18 - 0.8)
        dummy.current.rotation.set(i, i * 0.4, i * 0.2)
        dummy.current.scale.setScalar(i < n ? 1 : 0)
        dummy.current.updateMatrix()
        chips.current.setMatrixAt(i, dummy.current.matrix)
      }
      chips.current.instanceMatrix.needsUpdate = true
    }
  })

  const sky = stage >= 2 ? '#241018' : '#141c30'
  return (
    <>
      <RoomLights
        sky={sky}
        fog={[stage >= 2 ? '#1a0810' : '#1c2438', stage >= 2 ? 7 : 11, stage >= 2 ? 20 : 28]}
        ambient={stage >= 2 ? 0.08 : 0.12}
        dirIntensity={stage >= 2 ? 0.16 : 0.32}
        dirColor={stage >= 2 ? '#c070ff' : '#d0d8ff'}
        hemiSky={stage >= 2 ? '#3a1830' : '#2a3858'}
        hemiGround="#0a1218"
        hemiIntensity={0.1}
        dirPosition={[4, 12, -8]}
        skyDome
      />
      <GroundSkirt radius={38} color={stage >= 2 ? '#080410' : '#0c1824'} y={-0.55} />
      <mesh ref={water} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.38, 0]}>
        <planeGeometry args={[half * 2.4, half * 2.4]} />
        <meshStandardMaterial color="#16344c" roughness={0.18} metalness={0.28} transparent opacity={0.72} />
      </mesh>
      <mesh ref={ghost} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, 0]} visible={false}>
        <planeGeometry args={[half * 2.4, half * 2.4]} />
        <meshStandardMaterial color="#ff4ad2" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <pointLight position={[0, -0.18, 0]} color="#4ad0c8" intensity={0.28} distance={9} />
      <mesh position={[2.8, 5.6, -9.2]}>
        <sphereGeometry args={[0.55, 32, 24]} />
        <meshStandardMaterial color="#f4ead8" emissive="#f4ead8" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 4.05]}>
        <boxGeometry args={[3.4, 0.12, 2.6]} />
        <Mat color="#8a8580" kind="stone" />
      </mesh>
      <mesh position={[0, 0.05, -5.15]}>
        <boxGeometry args={[3.4, 0.12, 2.4]} />
        <Mat color="#8a8580" kind="stone" />
      </mesh>
      <mesh position={[-3.4, 0.02, 0.2]}>
        <boxGeometry args={[3.15, 0.06, 8.6]} />
        <meshStandardMaterial color="#1a3040" />
      </mesh>
      <mesh position={[3.4, 0.02, 0.2]}>
        <boxGeometry args={[3.15, 0.06, 8.6]} />
        <meshStandardMaterial color="#1a3040" />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <group key={i} ref={(el) => { planks.current[i] = el }} position={[0, 0.04, PLANK_Z(i)]}>
          <mesh>
            <boxGeometry args={[1.7, 0.1, PLANK - 0.04]} />
            <Mat color="#c44536" kind="wood" repeat={[2, 1]} roughness={0.65} />
          </mesh>
        </group>
      ))}
      <group ref={railL} position={[-0.88, 0.55, 0]}>
        <mesh>
          <boxGeometry args={[0.07, 0.85, 8.2]} />
          <Mat color="#8a2030" kind="wood" />
        </mesh>
        {[-3, -1, 1, 3].map((z) => (
          <mesh key={z} position={[0, 0.52, z]}>
            <sphereGeometry args={[0.07, 16, 12]} />
            <meshStandardMaterial color="#ffd27a" emissive="#ffb020" emissiveIntensity={1.1} />
          </mesh>
        ))}
      </group>
      <group ref={railR} position={[0.88, 0.55, 0]}>
        <mesh>
          <boxGeometry args={[0.07, 0.85, 8.2]} />
          <Mat color="#8a2030" kind="wood" />
        </mesh>
        {[-3, -1, 1, 3].map((z) => (
          <mesh key={z} position={[0, 0.52, z]}>
            <sphereGeometry args={[0.07, 16, 12]} />
            <meshStandardMaterial color="#ffd27a" emissive="#ffb020" emissiveIntensity={1.1} />
          </mesh>
        ))}
      </group>
      <mesh position={[-3.4, 0.28, 0.2]}>
        <boxGeometry args={[3.1, 0.72, 8.4]} />
        <Mat color="#5a5e58" kind="stone" />
      </mesh>
      <mesh position={[3.4, 0.28, 0.2]}>
        <boxGeometry args={[3.1, 0.72, 8.4]} />
        <Mat color="#5a5e58" kind="stone" />
      </mesh>
      <Koi position={[1.8, -0.22, 0.4]} />
      <Koi position={[-2.1, -0.24, -0.8]} color="#c45c4a" />
      <Koi position={[0.6, -0.21, -2.6]} />
      <StoneLantern position={[-3.1, 0.64, -2.8]} />
      <StoneLantern position={[3.15, 0.64, 2.4]} />
      <group position={[0, 0, -5.55]}>
        <mesh position={[-0.85, 1.15, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 2.3, 24]} />
          <meshStandardMaterial color="#c44536" />
        </mesh>
        <mesh position={[0.85, 1.15, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 2.3, 24]} />
          <meshStandardMaterial color="#c44536" />
        </mesh>
        <mesh position={[0, 2.38, 0]}>
          <boxGeometry args={[2.3, 0.1, 0.18]} />
          <meshStandardMaterial color="#c44536" />
        </mesh>
        <mesh position={[0, 1.55, 0]}>
          <boxGeometry args={[1.85, 0.08, 0.1]} />
          <meshStandardMaterial color="#c44536" />
        </mesh>
      </group>
      <instancedMesh ref={chips} args={[undefined, undefined, 40]}>
        <boxGeometry args={[0.045, 0.02, 0.03]} />
        <meshBasicMaterial color="#6a5a48" />
      </instancedMesh>
      {tCrack(stage)}
      <RoomBounds half={half} wallH={2} />
      {children}
    </>
  )
}

function tCrack(stage: CrashStage) {
  if (stage < 1) return null
  return (
    <group>
      <mesh position={[0, 0.055, 0.08]} rotation={[0, 0.38, 0]}>
        <boxGeometry args={[1.05, 0.008, 0.018]} />
        <meshStandardMaterial color="#1a100c" />
      </mesh>
      <mesh position={[0.32, 0.056, 0.22]} rotation={[0, -0.72, 0]}>
        <boxGeometry args={[0.58, 0.007, 0.016]} />
        <meshStandardMaterial color="#1a100c" />
      </mesh>
      <mesh position={[-0.28, 0.056, -0.12]} rotation={[0, 1.12, 0]}>
        <boxGeometry args={[0.44, 0.007, 0.014]} />
        <meshStandardMaterial color="#1a100c" />
      </mesh>
    </group>
  )
}

export function TableSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights
        sky="#1c1410"
        fog={['#241818', 9, 18]}
        ambient={0.16}
        dirIntensity={0.06}
        dirColor="#ffc070"
        hemiSky="#f0d0b0"
        hemiGround="#3a2418"
        hemiIntensity={0.1}
        dirPosition={[-3, 9, 5]}
      />
      <Floor half={half} color="#4a3228" kind="wood" />
      <WallRing half={half} color="#f0e4d0" height={3.34} kind="plaster" />
      <IndoorSkirting half={half} color="#5a3a28" />
      <mesh position={[0, 3.42, 0]}>
        <boxGeometry args={[half * 2 + 0.12, 0.14, half * 2 + 0.12]} />
        <Mat color="#4a3024" kind="wood" repeat={[6, 6]} />
      </mesh>
      <Cornice half={half} y={3.32} color="#6a4a38" />
      <mesh position={[0, 3.18, -1.55]}>
        <cylinderGeometry args={[0.22, 0.28, 0.08, 24]} />
        <meshStandardMaterial color="#c4a070" />
      </mesh>
      <mesh position={[0, 3.08, -1.55]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color="#ffd8a8" emissive="#ffc070" emissiveIntensity={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.2, 0.04, -1.55]}>
        <planeGeometry args={[4.6, 3.8]} />
        <Mat color="#6a2030" kind="carpet" repeat={[3, 3]} roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 1.05]}>
        <planeGeometry args={[1.55, 4.6]} />
        <Mat color="#6a2030" kind="carpet" repeat={[1, 4]} roughness={0.92} />
      </mesh>
      <mesh position={[-0.2, 0.58, -1.55]}>
        <boxGeometry args={[2.42, 0.08, 1.18]} />
        <Mat color="#5a3a28" kind="wood" repeat={[3, 2]} roughness={0.48} />
      </mesh>
      <mesh position={[-0.2, 0.645, -1.55]}>
        <boxGeometry args={[2.52, 0.035, 1.28]} />
        <Mat color="#f3ead8" kind="cloth" repeat={[3, 2]} roughness={0.78} />
      </mesh>
      {[-1.15, 0.75].map((x) =>
        [-0.42, 0.42].map((z) => (
          <mesh key={`${x}:${z}`} position={[x, 0.3, -1.55 + z]}>
            <boxGeometry args={[0.09, 0.56, 0.09]} />
            <Mat color="#5a3a28" kind="wood" />
          </mesh>
        )),
      )}
      <PlaceSetting position={[-0.55, 0.72, -1.22]} />
      <PlaceSetting position={[0.18, 0.72, -1.88]} rotY={Math.PI} />
      <Candle position={[-0.85, 0.8, -1.48]} />
      <Candle position={[0.48, 0.8, -1.62]} />
      <mesh position={[-0.18, 0.78, -1.55]}>
        <cylinderGeometry args={[0.045, 0.055, 0.14, 28]} />
        <meshStandardMaterial color="#2a2420" />
      </mesh>
      <mesh position={[-0.16, 0.95, -1.52]}>
        <sphereGeometry args={[0.04, 12, 10]} />
        <meshStandardMaterial color="#c45c4a" />
      </mesh>
      <mesh position={[0.05, 0.86, -1.42]}>
        <cylinderGeometry args={[0.035, 0.038, 0.28, 24]} />
        <meshStandardMaterial color="#3a0a14" transparent opacity={0.55} roughness={0.2} />
      </mesh>
      <Chair position={[-0.15, 0, -0.58]} />
      <Chair position={[-0.05, 0, -2.52]} rotationY={Math.PI} />
      <Byobu position={[-0.15, 0, -3.35]} />
      <mesh position={[2.35, 1.72, -half + 0.22]}>
        <boxGeometry args={[2.7, 1.85, 0.04]} />
        <meshStandardMaterial color="#9bb8d0" emissive="#7aa0c0" emissiveIntensity={0.35} transparent opacity={0.32} roughness={0.06} />
      </mesh>
      <pointLight position={[2.35, 1.7, -half + 0.8]} color="#a8c8e0" intensity={0.4} distance={7} />
      <pointLight position={[0, 2.2, half - 1.6]} color="#ffd0a0" intensity={0.32} distance={6} />
      <mesh position={[1.22, 1.7, -half + 0.42]} rotation={[0, 0.14, 0]}>
        <boxGeometry args={[0.78, 2.55, 0.07]} />
        <Mat color="#6a1828" kind="cloth" />
      </mesh>
      <mesh position={[3.48, 1.7, -half + 0.42]} rotation={[0, -0.14, 0]}>
        <boxGeometry args={[0.78, 2.55, 0.07]} />
        <Mat color="#6a1828" kind="cloth" />
      </mesh>
      <mesh position={[-3.15, 0.62, 0.15]}>
        <boxGeometry args={[1.35, 1.22, 0.48]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <Planter position={[3.4, 0, 1.4]} />
      <Planter position={[-3.5, 0, 2.4]} />
      <RuSign text="СТОЛ НА ДВОИХ" position={[0, 2.88, -half + 0.42]} size={0.14} color="#ffd27a" />
      <Lantern position={[-1.5, 2.4, -0.3]} />
      <Lantern position={[1.15, 2.4, -0.15]} />
      <pointLight position={[-0.2, 2.55, -1.55]} color="#ffd8a8" intensity={0.55} distance={7} />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function PostSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights
        sky="#181820"
        fog={['#1c1824', 9, 20]}
        ambient={0.22}
        dirIntensity={0.12}
        dirColor="#8a9cc0"
        hemiSky="#d8dce8"
        hemiGround="#2a2420"
        hemiIntensity={0.08}
        dirPosition={[2, 10, 4]}
      />
      <Floor half={half} color="#6a6258" kind="tile" />
      <WallRing half={half} color="#d8d0c0" height={3.24} kind="plaster" />
      <IndoorSkirting half={half} color="#4a4038" />
      <mesh position={[0, 3.32, 0]}>
        <boxGeometry args={[half * 2 + 0.1, 0.12, half * 2 + 0.1]} />
        <Mat color="#3a3450" kind="stone" repeat={[6, 6]} />
      </mesh>
      {[-1.8, 1.8].map((x) => (
        <group key={x}>
          <mesh position={[x, 3.12, -1.2]}>
            <boxGeometry args={[1.35, 0.05, 0.1]} />
            <meshStandardMaterial color="#e8f0ff" emissive="#dce8ff" emissiveIntensity={0.85} />
          </mesh>
          <pointLight position={[x, 3.05, -1.2]} color="#e8f0ff" intensity={0.42} distance={7} />
        </group>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -1.55]}>
        <planeGeometry args={[3, 1.6]} />
        <Mat color="#3a2a4a" kind="carpet" repeat={[2, 1]} />
      </mesh>
      <mesh position={[0.15, 1.02, -2.48]}>
        <boxGeometry args={[4.8, 1.04, 0.82]} />
        <Mat color="#6a4a32" kind="wood" repeat={[4, 1]} roughness={0.55} />
      </mesh>
      {[-1.9, 2.15].map((x) =>
        [-2.72, -2.24].map((z) => (
          <mesh key={`${x}:${z}`} position={[x, 0.26, z]}>
            <boxGeometry args={[0.14, 0.52, 0.16]} />
            <Mat color="#4a3224" kind="wood" />
          </mesh>
        )),
      )}
      <mesh position={[0.15, 1.56, -2.48]}>
        <boxGeometry args={[4.95, 0.07, 0.92]} />
        <Mat color="#c4a070" kind="wood" repeat={[4, 1]} roughness={0.5} />
      </mesh>
      {[-1.7, -0.85, 0, 0.85, 1.7].map((x) =>
        [1.92, 2.32, 2.72].map((y) => (
          <group key={`${x}:${y}`}>
            <mesh position={[x, y, -2.68]}>
              <boxGeometry args={[0.78, 0.36, 0.24]} />
              <Mat color="#2a2420" kind="wood" />
            </mesh>
            <mesh position={[x, y - 0.14, -2.58]} rotation={[0, 0.08, 0]}>
              <boxGeometry args={[0.22, 0.015, 0.16]} />
              <Mat color={y > 2.4 ? '#e8d5c4' : '#f4ead8'} kind="paper" />
            </mesh>
          </group>
        )),
      )}
      <mesh position={[-1.15, 1.68, -2.12]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 28]} />
        <meshStandardMaterial color="#b08a3a" metalness={0.72} roughness={0.3} />
      </mesh>
      <mesh position={[-1.15, 1.78, -2.12]}>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 12]} />
        <meshStandardMaterial color="#b08a3a" metalness={0.7} />
      </mesh>
      <mesh position={[-1.15, 1.72, -2.12]} rotation={[-0.1, 0.15, 0]}>
        <boxGeometry args={[0.16, 0.01, 0.12]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <mesh position={[0.52, 1.64, -2.1]}>
        <boxGeometry args={[0.2, 0.05, 0.14]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <mesh position={[0.52, 1.67, -2.1]}>
        <boxGeometry args={[0.16, 0.012, 0.1]} />
        <meshStandardMaterial color="#7a1020" />
      </mesh>
      <mesh position={[0.15, 1.64, -2.18]} rotation={[-0.18, 0.1, 0]}>
        <boxGeometry args={[0.28, 0.02, 0.2]} />
        <Mat color="#f4ead8" kind="paper" />
      </mesh>
      <Mailbox position={[-2.45, 0, 0.85]} />
      <pointLight position={[-2.45, 1.35, 0.85]} color="#ffd27a" intensity={0.28} distance={3.5} />
      <pointLight position={[0, 2.4, 1.8]} color="#e8e4d8" intensity={0.32} distance={6} />
      <Kit file="ticket-machine.glb" position={[2.15, 0, -1.05]} scale={0.9} />
      <Bench position={[2.35, 0, 1.65]} rotationY={-0.35} />
      {[-1.15, 1.15].map((x) => (
        <group key={x} position={[x, 0, 0.35]}>
          <mesh position={[0, 0.48, 0]}>
            <cylinderGeometry args={[0.035, 0.04, 0.96, 12]} />
            <meshStandardMaterial color="#c9a227" metalness={0.45} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.98, 0]}>
            <sphereGeometry args={[0.05, 12, 10]} />
            <meshStandardMaterial color="#c9a227" metalness={0.5} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.72, 0.35]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.012, 0.012, 2.3, 8]} />
        <meshStandardMaterial color="#8a2030" />
      </mesh>
      <mesh position={[-2.5, 0.42, -0.35]}>
        <boxGeometry args={[0.85, 0.52, 0.7]} />
        <Mat color="#5a3a28" kind="wood" />
      </mesh>
      <RuSign text="ПОЧТА" position={[2.45, 2.48, -2.48]} size={0.16} color="#ffd27a" />
      <RuSign text="Одно письмо" position={[2.45, 2.18, -2.48]} size={0.1} color="#f4ead8" />
      <RuSign text="ШТЕМПЕЛЬ — ТОЛЬКО С ТВОЕЙ РУКИ" position={[0.15, 2.98, -2.35]} size={0.09} color="#ffd27a" />
      <Kanji text="〒" position={[-2.9, 2.2, -2.5]} size={0.22} color="#c41e3a" />
      <pointLight position={[0.55, 1.85, -2.05]} color="#ffd27a" intensity={0.4} distance={4} />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function CampusSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights
        sky="#9eb8cc"
        fog={['#b8c8d4', 16, 38]}
        ambient={0.42}
        dirIntensity={0.85}
        dirColor="#fff1d2"
        hemiSky="#d0dce8"
        hemiGround="#4a4a38"
        hemiIntensity={0.32}
        dirPosition={[5, 8, 4]}
        skyDome
      />
      <GroundSkirt radius={36} color="#5a6a48" y={-0.05} />
      <HedgeRing half={half} height={1.15} color="#2a4a28" />
      <Floor half={half} color="#6a6a60" kind="stone" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0.4]}>
        <planeGeometry args={[2.4, 8.2]} />
        <meshStandardMaterial color="#c4b8a0" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.35, -6.15]}>
        <boxGeometry args={[12.4, 0.7, 2.2]} />
        <meshStandardMaterial color="#d9cbb0" roughness={0.78} />
      </mesh>
      <mesh position={[0, 2.55, -6.55]}>
        <boxGeometry args={[12.2, 4.4, 1.8]} />
        <meshStandardMaterial color="#d4c6a8" roughness={0.78} />
      </mesh>
      <mesh position={[0, 2.55, -7.85]}>
        <boxGeometry args={[12.4, 4.4, 1.4]} />
        <meshStandardMaterial color="#c8ba9c" roughness={0.8} />
      </mesh>
      <mesh position={[-6.55, 2.4, -7.1]}>
        <boxGeometry args={[1.4, 4.6, 3.4]} />
        <meshStandardMaterial color="#cfc0a4" roughness={0.8} />
      </mesh>
      <mesh position={[6.55, 2.4, -7.1]}>
        <boxGeometry args={[1.4, 4.6, 3.4]} />
        <meshStandardMaterial color="#cfc0a4" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.85, -6.15]}>
        <boxGeometry args={[12.6, 0.35, 2]} />
        <meshStandardMaterial color="#d9cbb0" />
      </mesh>
      {[-2.7, -0.9, 0.9, 2.7].map((x) => (
        <Column key={x} position={[x, 0, -5.35]} />
      ))}
      {[0.12, 0.24, 0.36].map((y, i) => (
        <mesh key={y} position={[0, y, -4.55 + i * 0.05]}>
          <boxGeometry args={[5.2, 0.12, 0.45]} />
          <meshStandardMaterial color="#c8c0b0" />
        </mesh>
      ))}
      <mesh position={[0, 1.55, -5.55]}>
        <boxGeometry args={[1.5, 2.4, 0.2]} />
        <meshStandardMaterial color="#3a3428" />
      </mesh>
      <RuSign text="КУБГУ" position={[0, 4.42, -5.22]} size={0.28} color="#2a3a58" />
      <RuSign text="СТАВРОПОЛЬСКАЯ, 149" position={[0, 4.12, -5.22]} size={0.09} color="#4a4a40" />
      <mesh position={[-4.35, 2.6, -5.62]}>
        <boxGeometry args={[2.6, 3.2, 0.06]} />
        <meshStandardMaterial color="#3a5a7a" />
      </mesh>
      <mesh position={[-4.35, 2.7, -5.56]}>
        <boxGeometry args={[0.7, 1.4, 0.04]} />
        <meshStandardMaterial color="#efe6d2" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 1.15]}>
        <circleGeometry args={[2.05, 48]} />
        <meshStandardMaterial color="#3a6a38" />
      </mesh>
      <mesh position={[0, 0.06, 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.85, 32]} />
        <meshStandardMaterial color="#6a8a3a" />
      </mesh>
      <Maple position={[-6.2, 0, 3.4]} scale={0.78} />
      <Maple position={[6.1, 0, 3.8]} scale={0.7} />
      <SakuraTree position={[-6.4, 0, -1.2]} scale={0.55} />
      <Bench position={[-3.35, 0, 0.25]} rotationY={0.4} />
      <Bench position={[3.45, 0, 0.55]} rotationY={-0.35} />
      <Bench position={[-2.6, 0, 3.35]} rotationY={0.15} />
      <Kit file="vending-machine.glb" position={[4.55, 0, 2.15]} scale={0.9} />
      <mesh position={[-4.9, 1.4, -2.2]}>
        <boxGeometry args={[1.3, 1.6, 0.08]} />
        <meshStandardMaterial color="#5a5040" />
      </mesh>
      <RuSign text="РАСПИСАНИЕ" position={[-4.9, 2.05, -2.14]} size={0.1} color="#f4ead8" />
      <mesh position={[-3.2, 0.48, 0.3]}>
        <boxGeometry args={[0.18, 0.22, 0.12]} />
        <meshStandardMaterial color="#2a3a5a" />
      </mesh>
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export function StaffSet({ half, children }: { half: number; children?: ReactNode }) {
  return (
    <>
      <RoomLights
        sky="#152018"
        fog={['#1a2420', 10, 22]}
        ambient={0.24}
        dirIntensity={0.1}
        dirColor="#c8d8c0"
        hemiSky="#c8d8c0"
        hemiGround="#1a2418"
        hemiIntensity={0.08}
        dirPosition={[3, 9, 2]}
      />
      <Floor half={half} color="#3a4a38" kind="tile" />
      <WallRing half={half} color="#1a4a32" height={3.02} />
      <IndoorSkirting half={half} color="#0e2a1c" height={0.22} />
      {[-half + 0.22, half - 0.22].map((x, i) => (
        <mesh key={`wain${i}`} position={[x, 0.55, 0]}>
          <boxGeometry args={[0.08, 1.1, half * 2 - 0.3]} />
          <meshStandardMaterial color="#0e301c" />
        </mesh>
      ))}
      <mesh position={[0, 0.55, -half + 0.22]}>
        <boxGeometry args={[half * 2 - 0.3, 1.1, 0.08]} />
        <meshStandardMaterial color="#0e301c" />
      </mesh>
      <mesh position={[0, 3.08, 0]}>
        <boxGeometry args={[half * 2 + 0.1, 0.12, half * 2 + 0.1]} />
        <meshStandardMaterial color="#2a3028" />
      </mesh>
      {[-2.2, 0, 2.2].map((x) => (
        <group key={x}>
          <mesh position={[x, 2.92, -1.4]}>
            <boxGeometry args={[1.15, 0.04, 0.08]} />
            <meshStandardMaterial color="#e8f0d8" emissive="#e8f4d0" emissiveIntensity={0.9} />
          </mesh>
          {x !== 0 && <pointLight position={[x, 2.85, -1.2]} color="#e8f4d0" intensity={0.42} distance={7} />}
        </group>
      ))}
      <VkusnoLogo position={[-0.15, 1.95, -half + 0.28]} />
      <RuSign text="ПЕРСОНАЛ" position={[1.15, 2.72, -half + 0.32]} size={0.15} color="#f4ead8" />
      <mesh position={[2.15, 1.55, -1.35]}>
        <boxGeometry args={[1.75, 0.08, 0.95]} />
        <meshStandardMaterial color="#3a4044" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[2.15, 1.85, -1.55]}>
        <boxGeometry args={[1.55, 0.55, 0.08]} />
        <meshStandardMaterial color="#2a3034" metalness={0.4} />
      </mesh>
      <mesh position={[2.15, 0.92, -1.35]}>
        <boxGeometry args={[1.55, 0.06, 0.78]} />
        <meshStandardMaterial color="#8a9094" metalness={0.72} roughness={0.28} />
      </mesh>
      {[-0.65, 0.65].map((x) =>
        [-0.32, 0.32].map((z) => (
          <mesh key={`${x}:${z}`} position={[2.15 + x, 0.45, -1.35 + z]}>
            <boxGeometry args={[0.06, 0.9, 0.06]} />
            <meshStandardMaterial color="#8a9094" metalness={0.6} />
          </mesh>
        )),
      )}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh key={i} position={[1.55, 0.98 + i * 0.025, -1.35]}>
          <boxGeometry args={[0.38, 0.02, 0.28]} />
          <meshStandardMaterial color="#e8d5b0" />
        </mesh>
      ))}
      <mesh position={[0.55, 0.55, -2.35]}>
        <boxGeometry args={[0.72, 1.05, 0.55]} />
        <meshStandardMaterial color="#4a5054" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0.55, 1.12, -2.35]}>
        <boxGeometry args={[0.62, 0.08, 0.42]} />
        <meshStandardMaterial color="#2a2e30" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.4, 0.02, 1.4]}>
        <circleGeometry args={[0.18, 16]} />
        <meshStandardMaterial color="#1a2018" />
      </mesh>
      <Lockers position={[-3.35, 0, -0.4]} />
      <mesh position={[-3.45, 1.85, 1.55]}>
        <boxGeometry args={[0.04, 0.04, 1.8]} />
        <meshStandardMaterial color="#8a9094" metalness={0.5} />
      </mesh>
      {[-0.7, -0.35, 0, 0.35, 0.7].map((z) => (
        <group key={z} position={[-3.45, 1.7, 1.55 + z]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 12]} />
            <meshStandardMaterial color="#1a4a32" />
          </mesh>
          <mesh position={[0.1, -0.04, 0]}>
            <boxGeometry args={[0.16, 0.02, 0.12]} />
            <meshStandardMaterial color="#1a4a32" />
          </mesh>
        </group>
      ))}
      <mesh position={[-2.2, 0.4, -2.45]}>
        <boxGeometry args={[1.1, 0.08, 0.7]} />
        <meshStandardMaterial color="#6a6a68" />
      </mesh>
      <mesh position={[2.4, 0.28, 1.55]}>
        <boxGeometry args={[1.4, 0.45, 0.55]} />
        <Mat color="#1a4a32" kind="cloth" />
      </mesh>
      <Kit file="vending-machine.glb" position={[2.5, 0, 0.55]} scale={0.95} />
      <RoomBounds half={half} />
      {children}
    </>
  )
}

export { Archway }
