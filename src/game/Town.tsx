import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { Float, Sparkles, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { districtOpen } from '../logic'
import { useInvite } from '../state'
import { Kit } from './Kit'
import { GATES, WORLD } from './layout'
import { Kanji, Machiya, SkylineBlock, StoneLantern, StreetGate, Torii } from './TownProps'

function PaperLantern({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.05} floatIntensity={0.1} rotationIntensity={0.05}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color="#ffb020" emissive="#ff8a00" emissiveIntensity={1.65} />
        </mesh>
        <pointLight color="#ffb020" intensity={0.55} distance={3.8} />
      </group>
    </Float>
  )
}

const LEFT_SHOPS: { z: number; noren: string; accent: string; stories: 2 | 3 }[] = [
  { z: 18.4, noren: '祭', accent: '#c44536', stories: 2 },
  { z: 16.0, noren: '茶', accent: '#6a3a28', stories: 2 },
  { z: 13.6, noren: '花', accent: '#a33a5c', stories: 3 },
  { z: 11.2, noren: '麺', accent: '#8a2a2a', stories: 2 },
  { z: 8.8, noren: '音', accent: '#4a2a6a', stories: 2 },
  { z: 6.4, noren: '店', accent: '#c44536', stories: 3 },
  { z: 4.0, noren: '酒', accent: '#6a2a2a', stories: 2 },
  { z: 1.6, noren: '試合', accent: '#2a5a3a', stories: 2 },
  { z: -0.8, noren: '球', accent: '#2a4a6a', stories: 3 },
  { z: -3.2, noren: '門', accent: '#c44536', stories: 2 },
  { z: -5.6, noren: '願', accent: '#6a3a28', stories: 2 },
  { z: -8.0, noren: '夜', accent: '#2a2a6a', stories: 3 },
  { z: -10.4, noren: '灯', accent: '#c44536', stories: 2 },
  { z: -12.8, noren: '社', accent: '#8a2a2a', stories: 2 },
  { z: -15.2, noren: '和', accent: '#4a2a6a', stories: 3 },
  { z: -17.6, noren: '届', accent: '#6a3a28', stories: 2 },
  { z: -20.0, noren: '縁', accent: '#c44536', stories: 2 },
]

const RIGHT_ALT: Record<string, string> = {
  祭: '灯',
  茶: '甘',
  花: '桜',
  麺: '丼',
  音: '歌',
  店: '屋',
  酒: '肴',
  試合: '勝',
  球: '網',
  門: '開',
  願: '祈',
  夜: '月',
  灯: '火',
  社: '守',
  和: '心',
  届: '便',
  縁: '結',
}

export function Town() {
  const { state } = useInvite()
  const crashed = state.crashed
  const tilt = useRef<THREE.Group>(null)
  useFrame((st) => {
    if (!tilt.current) return
    if (!crashed) {
      tilt.current.rotation.set(0, 0, 0)
      return
    }
    const t = st.clock.elapsedTime
    tilt.current.rotation.z = Math.sin(t * 9) * 0.04
    tilt.current.rotation.x = Math.cos(t * 7) * 0.025
  })

  return (
    <>
      <color attach="background" args={['#1a1028']} />
      <fog attach="fog" args={['#1a1028', 22, 48]} />
      <ambientLight intensity={0.72} />
      <hemisphereLight args={['#c4d0f0', '#3a2818', 0.85]} />
      <directionalLight position={[4, 14, 8]} intensity={1.15} color="#ffe2c4" />
      <pointLight position={[0, 4.2, 16]} intensity={1.6} distance={14} color="#ffc878" />
      <pointLight position={[0, 4.2, 6]} intensity={1.3} distance={12} color="#ffb070" />
      <pointLight position={[0, 4.2, -4]} intensity={1.2} distance={12} color="#ffc090" />
      <pointLight position={[0, 4.2, -12]} intensity={1.2} distance={12} color="#ffa8c8" />
      <pointLight position={[0, 4.2, -19]} intensity={1.1} distance={11} color="#ffd27a" />
      <Stars radius={55} depth={22} count={260} factor={2.3} fade speed={0.22} />
      <mesh position={[7, 13.5, -8]}>
        <sphereGeometry args={[1.35, 16, 16]} />
        <meshBasicMaterial color="#f4e4c1" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.2]}>
        <planeGeometry args={[7.2, 46]} />
        <meshStandardMaterial color="#4a3c32" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -1.2]}>
        <planeGeometry args={[1.7, 46]} />
        <meshStandardMaterial color="#6a5848" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.05, 0.02, -1.2]}>
        <planeGeometry args={[0.12, 46]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.05, 0.02, -1.2]}>
        <planeGeometry args={[0.12, 46]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[8, 0.2, 24]} position={[0, -0.2, -1]} />
        <CuboidCollider args={[8, 3, 0.4]} position={[0, 2, WORLD.zMax + 0.7]} />
        <CuboidCollider args={[8, 3, 0.4]} position={[0, 2, WORLD.zMin - 0.7]} />
        <CuboidCollider args={[0.28, 3, 24]} position={[-WORLD.x - 0.28, 2, -1]} />
        <CuboidCollider args={[0.28, 3, 24]} position={[WORLD.x + 0.28, 2, -1]} />
      </RigidBody>

      <Sparkles count={42} scale={[5, 3.5, 38]} size={2} speed={0.32} color="#ffd27a" position={[0, 2.1, -2]} />

      <group ref={tilt}>
        <Torii z={19.55} w={1.9} />
        <Kanji text="第二ハーフ" position={[0, 3.55, 19.55]} size={0.18} color="#ffd27a" />
        <Kanji text="横丁" position={[0, 0.04, 14.2]} rotation={[-Math.PI / 2, 0, 0]} size={0.55} color="#4a3a28" />
        <Kanji text="祭" position={[0, 0.04, 6.2]} rotation={[-Math.PI / 2, 0, 0]} size={0.7} color="#5a3020" />
        <Kanji text="試合" position={[0, 0.04, -3.1]} rotation={[-Math.PI / 2, 0, 0]} size={0.5} color="#2a4a38" />
        <Kanji text="鳥居" position={[0, 0.04, -10.4]} rotation={[-Math.PI / 2, 0, 0]} size={0.5} color="#5a2030" />
        <Kanji text="社" position={[0, 0.04, -18.8]} rotation={[-Math.PI / 2, 0, 0]} size={0.65} color="#4a3a28" />

        {LEFT_SHOPS.map((s) => (
          <Machiya
            key={`L${s.z}`}
            position={[-3.82, 0, s.z]}
            face="left"
            noren={s.noren}
            accent={s.accent}
            stories={s.stories}
          />
        ))}
        {LEFT_SHOPS.map((s) => (
          <Machiya
            key={`R${s.z}`}
            position={[3.82, 0, s.z - 0.35]}
            face="right"
            noren={RIGHT_ALT[s.noren] ?? s.noren}
            accent={s.accent}
            stories={s.stories === 3 ? 2 : 3}
          />
        ))}

        {LEFT_SHOPS.map((s, i) => (
          <SkylineBlock
            key={`SL${s.z}`}
            position={[-6.7, 0, s.z + 0.4]}
            h={4.2 + (i % 3) * 0.7}
            lit={s.accent}
          />
        ))}
        {LEFT_SHOPS.map((s, i) => (
          <SkylineBlock
            key={`SR${s.z}`}
            position={[6.7, 0, s.z - 0.2]}
            h={4.0 + ((i + 1) % 3) * 0.75}
            lit={s.accent}
          />
        ))}

        {[-18, -12, -6, 0, 6, 12, 17].map((z) => (
          <group key={`wire${z}`}>
            <mesh position={[0, 3.15, z]} rotation={[0, 0, 0.08]}>
              <boxGeometry args={[5.1, 0.015, 0.015]} />
              <meshBasicMaterial color="#1a1010" />
            </mesh>
            <PaperLantern position={[-1.7, 2.85, z]} />
            <PaperLantern position={[0, 2.95, z + 0.15]} />
            <PaperLantern position={[1.7, 2.88, z - 0.1]} />
          </group>
        ))}

        <StoneLantern position={[-1.9, 0, 18.6]} />
        <StoneLantern position={[1.9, 0, 18.5]} />
        <StoneLantern position={[-1.85, 0, -18.4]} />
        <StoneLantern position={[1.85, 0, -18.55]} />

        <Kit file="castle/flag-banner-long.glb" position={[-2.15, 0, 18.9]} scale={1.05} />
        <Kit file="castle/flag-banner-long.glb" position={[2.15, 0, 18.9]} scale={1.05} />
        <Kit file="vending-machine.glb" position={[-2.2, 0, 12.7]} scale={0.95} rotation={[0, Math.PI / 2, 0]} />
        <Kit file="vending-machine.glb" position={[2.2, 0, 4.15]} scale={0.95} rotation={[0, -Math.PI / 2, 0]} />
        <Kit file="column.glb" position={[-2.15, 0, -2.1]} scale={0.85} />
        <Kit file="column.glb" position={[2.15, 0, -2.3]} scale={0.85} />

        <StreetGate z={GATES.toArcade} open={districtOpen(state, 1)} seal="封" />
        <StreetGate z={GATES.toMatch} open={districtOpen(state, 2)} seal="待" />
        <StreetGate z={GATES.toPortals} open={districtOpen(state, 3)} seal="未" />
        <StreetGate z={GATES.toMail} open={districtOpen(state, 4)} seal="届" />

        <Kanji text="横丁" position={[0, 3.4, GATES.toArcade]} size={0.16} color="#ffb020" />
        <Kanji text="試合" position={[0, 3.4, GATES.toMatch]} size={0.16} color="#7dffb3" />
        <Kanji text="鳥居" position={[0, 3.4, GATES.toPortals]} size={0.16} color="#ff8ad4" />
        <Kanji text="社務" position={[0, 3.4, GATES.toMail]} size={0.16} color="#ffd27a" />
      </group>
    </>
  )
}
