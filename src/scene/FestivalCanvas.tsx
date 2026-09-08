import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Grid, Sparkles, Stars, Text } from '@react-three/drei'
import { useMemo, useRef, type ComponentProps, type ReactNode } from 'react'
import * as THREE from 'three'
import type { Act, DoorId, MachineId, PortalId } from '../logic'

type WorldHandlers = {
  onEnvelope: () => void
  onCabinet: (id: MachineId) => void
  onDoor: (id: DoorId) => void
  onPortal: (id: PortalId) => void
}

type WorldProps = WorldHandlers & {
  act: Act
  crashed: boolean
  celebrate: boolean
  reducedMotion: boolean
  arcadeDone: Record<MachineId, boolean>
  portalSelectable: boolean
}

const STATIONS: Record<Act, { pos: [number, number, number]; look: [number, number, number] }> = {
  envelope: { pos: [0, 3.1, 18.4], look: [0, 1.7, 11] },
  letter: { pos: [0, 2.7, 11.2], look: [0, 0.8, 5.4] },
  arcade: { pos: [0, 2.9, 5.2], look: [0, 1.15, -1.2] },
  scoreboard: { pos: [0, 3.4, -5.6], look: [0, 2.4, -14] },
  portals: { pos: [0, 2.8, -15.4], look: [0, 1.5, -24] },
  finale: { pos: [0, 4.2, -13.5], look: [0, 1.6, -23] },
  sent: { pos: [0, 5.2, -10], look: [0, 2, -22] },
}

function CrashGroup({
  crashed,
  reduced,
  children,
  seed,
}: {
  crashed: boolean
  reduced: boolean
  seed: number
  children: ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    if (!crashed) {
      ref.current.rotation.set(0, 0, 0)
      ref.current.position.y = 0
      return
    }
    const t = state.clock.elapsedTime
    const amp = reduced ? 0.04 : 0.22
    ref.current.rotation.z = Math.sin(t * 9 + seed) * amp
    ref.current.rotation.x = Math.cos(t * 7 + seed) * amp * 0.4
    ref.current.position.y = Math.sin(t * 11 + seed) * (reduced ? 0.05 : 0.28)
  })
  return <group ref={ref}>{children}</group>
}

function CameraRig({ act, crashed, reduced }: { act: Act; crashed: boolean; reduced: boolean }) {
  const { camera } = useThree()
  const station = STATIONS[act]
  const pos = useRef(new THREE.Vector3(...station.pos))
  const look = useRef(new THREE.Vector3(...station.look))

  useFrame((state, dt) => {
    const k = 1 - Math.exp(-(reduced ? 6 : 2.15) * dt)
    pos.current.lerp(new THREE.Vector3(...station.pos), k)
    look.current.lerp(new THREE.Vector3(...station.look), k)
    const p = pos.current.clone()
    if (crashed && !reduced) {
      p.x += Math.sin(state.clock.elapsedTime * 27) * 0.09
      p.y += Math.cos(state.clock.elapsedTime * 23) * 0.06
    }
    camera.position.copy(p)
    camera.lookAt(look.current)
  })
  return null
}

function EmissiveBox(
  props: ComponentProps<'mesh'> & { color: string; emissive?: string; opacity?: number },
) {
  const { color, emissive = color, opacity = 1, children, ...rest } = props
  return (
    <mesh {...rest}>
      <boxGeometry />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.55}
        roughness={0.35}
        metalness={0.2}
        transparent={opacity < 1}
        opacity={opacity}
      />
      {children}
    </mesh>
  )
}

function Torii() {
  const vermillion = '#c44536'
  return (
    <group position={[0, 0, 12.2]}>
      <EmissiveBox color={vermillion} position={[-2.4, 2.2, 0]} scale={[0.28, 4.4, 0.28]} />
      <EmissiveBox color={vermillion} position={[2.4, 2.2, 0]} scale={[0.28, 4.4, 0.28]} />
      <EmissiveBox color={vermillion} position={[0, 4.45, 0]} scale={[5.6, 0.28, 0.5]} />
      <EmissiveBox color="#1a1210" position={[0, 3.85, 0]} scale={[5.1, 0.16, 0.32]} />
      <EmissiveBox color="#f0c14a" position={[0, 4.72, 0.02]} scale={[0.5, 0.12, 0.55]} />
      <Text position={[0, 5.15, 0.1]} fontSize={0.28} color="#ffd27a" anchorX="center">
        2ND HALF
      </Text>
    </group>
  )
}

function Envelope({ onClick, hot }: { onClick: () => void; hot: boolean }) {
  return (
    <Float speed={hot ? 2.2 : 1} floatIntensity={hot ? 0.45 : 0.15} rotationIntensity={0.08}>
      <group
        position={[0, 1.55, 11.6]}
        rotation={[0.12, 0.35, 0.04]}
        onClick={(e) => {
          e.stopPropagation()
          if (hot) onClick()
        }}
        onPointerOver={() => {
          if (hot) document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <EmissiveBox color="#f4e4c1" emissive="#c9a227" scale={[1.8, 1.15, 0.08]} />
        <mesh position={[0, 0.18, 0.06]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[1.15, 1.15]} />
          <meshStandardMaterial color="#e8c96a" emissive="#aa7a12" emissiveIntensity={0.4} />
        </mesh>
        <Text position={[0, -0.08, 0.08]} fontSize={0.16} color="#6b2a22" anchorX="center">
          ЛИЛИЯ
        </Text>
      </group>
    </Float>
  )
}

function DanceFloor({ celebrate }: { celebrate: boolean }) {
  const light = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (light.current) light.current.rotation.y += dt * 0.6
  })
  return (
    <group position={[0, 0, 6.2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[3.4, 48]} />
        <meshStandardMaterial
          color="#14102a"
          emissive={celebrate ? '#ff4d9a' : '#2a1850'}
          emissiveIntensity={celebrate ? 1.2 : 0.35}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[3.35, 3.55, 48]} />
        <meshStandardMaterial
          color="#2de2ff"
          emissive="#2de2ff"
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={light}>
        <pointLight position={[2.2, 1.6, 0]} color="#ff2d95" intensity={2.4} distance={8} />
        <pointLight position={[-1.6, 1.4, 1.6]} color="#2de2ff" intensity={2} distance={8} />
        <pointLight position={[0.2, 1.5, -2]} color="#ffb020" intensity={1.6} distance={8} />
      </group>
      <Float speed={1.4} floatIntensity={0.3}>
        <mesh position={[-1.1, 1.15, 0.4]}>
          <capsuleGeometry args={[0.16, 0.7, 4, 8]} />
          <meshStandardMaterial color="#ffd1ea" emissive="#ff6bb5" emissiveIntensity={0.4} />
        </mesh>
      </Float>
      <Float speed={1.7} floatIntensity={0.35}>
        <mesh position={[1.05, 1.2, -0.2]}>
          <capsuleGeometry args={[0.16, 0.75, 4, 8]} />
          <meshStandardMaterial color="#c9f4ff" emissive="#2de2ff" emissiveIntensity={0.4} />
        </mesh>
      </Float>
    </group>
  )
}

function Cabinet({
  id,
  position,
  color,
  label,
  done,
  hot,
  onClick,
}: {
  id: MachineId
  position: [number, number, number]
  color: string
  label: string
  done: boolean
  hot: boolean
  onClick: (id: MachineId) => void
}) {
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        if (hot) onClick(id)
      }}
      onPointerOver={() => {
        if (hot) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <EmissiveBox color="#12101c" position={[0, 1.15, 0]} scale={[1.35, 2.3, 1.05]} />
      <EmissiveBox
        color={color}
        emissive={color}
        position={[0, 1.55, 0.54]}
        scale={[1.05, 0.85, 0.08]}
      />
      <EmissiveBox color="#0b0a12" position={[0, 0.55, 0.42]} scale={[1.15, 0.18, 0.5]} />
      {done && (
        <mesh position={[0, 2.45, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#7dffb3" emissive="#3dff8a" emissiveIntensity={2} />
        </mesh>
      )}
      <Text position={[0, 2.18, 0.56]} fontSize={0.16} color="#fff7e8" anchorX="center">
        {label}
      </Text>
    </group>
  )
}

function SideDoor({
  id,
  position,
  label,
  hot,
  onClick,
}: {
  id: DoorId
  position: [number, number, number]
  label: string
  hot: boolean
  onClick: (id: DoorId) => void
}) {
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        if (hot) onClick(id)
      }}
      onPointerOver={() => {
        if (hot) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <EmissiveBox color="#1a1528" position={[0, 1.4, 0]} scale={[1.5, 2.8, 0.18]} />
      <EmissiveBox color="#3a2a18" position={[0, 2.55, 0.12]} scale={[1.2, 0.28, 0.08]} />
      <Text position={[0, 1.55, 0.12]} fontSize={0.18} color="#c9b48a" anchorX="center" maxWidth={1.3}>
        {label}
      </Text>
      <Text position={[0, 0.85, 0.12]} fontSize={0.12} color="#886" anchorX="center">
        ЗАКРЫТО
      </Text>
    </group>
  )
}

function ScoreboardMesh({ crashed, celebrate }: { crashed: boolean; celebrate: boolean }) {
  return (
    <group position={[0, 3.3, -13.6]}>
      <EmissiveBox color="#0c0b14" scale={[7.4, 3.4, 0.35]} />
      <mesh position={[0, 0, 0.2]}>
        <planeGeometry args={[6.8, 2.9]} />
        <meshStandardMaterial
          color={crashed ? '#3a0510' : '#07140f'}
          emissive={crashed ? '#ff2244' : celebrate ? '#2dff9a' : '#0b3d22'}
          emissiveIntensity={crashed ? 1.6 : celebrate ? 1.4 : 0.55}
        />
      </mesh>
      <Text position={[0, 0.85, 0.22]} fontSize={0.32} color={crashed ? '#ff6b7a' : '#7dffb3'} anchorX="center">
        {crashed ? 'ERROR / BUG' : 'SECOND HALF'}
      </Text>
      <Text position={[0, 0.15, 0.22]} fontSize={0.42} color="#f8ffe8" anchorX="center">
        ЛИЛИЯ   ?   ТЕМЫЧ
      </Text>
      <Text position={[0, -0.7, 0.22]} fontSize={0.22} color="#ffd27a" anchorX="center">
        {crashed ? 'BUG DETECTED' : '12.09 · KRASNODAR'}
      </Text>
    </group>
  )
}

function PortalArch({
  id,
  position,
  color,
  label,
  hot,
  onClick,
}: {
  id: PortalId
  position: [number, number, number]
  color: string
  label: string
  hot: boolean
  onClick: (id: PortalId) => void
}) {
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        if (hot) onClick(id)
      }}
      onPointerOver={() => {
        if (hot) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.35, 0.09, 12, 48]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Sparkles count={18} scale={[2.2, 2.2, 0.6]} size={3} speed={0.6} color={color} />
      <Text position={[0, -1.7, 0.1]} fontSize={0.22} color="#fff4dc" anchorX="center">
        {label}
      </Text>
    </group>
  )
}

function Lantern({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.1} floatIntensity={0.12} rotationIntensity={0.05}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#ffb020" emissive="#ff8a00" emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.12, 8]} />
          <meshStandardMaterial color="#6b2a16" />
        </mesh>
      </group>
    </Float>
  )
}

function GlitchKanji({ crashed }: { crashed: boolean }) {
  if (!crashed) return null
  return (
    <group>
      {['BUG', 'ERROR', 'HALT', 'CRASH'].map((t, i) => (
        <Text
          key={t}
          position={[Math.sin(i * 1.7) * 4.5, 2.4 + i * 0.55, -2 + i]}
          fontSize={0.4}
          color="#ff4d6d"
          anchorX="center"
        >
          {t}
        </Text>
      ))}
    </group>
  )
}

function World(props: WorldProps) {
  const arcadeHot = props.act === 'arcade'
  const envelopeHot = props.act === 'envelope'
  const portalHot = props.portalSelectable
  const lanterns = useMemo<[number, number, number][]>(
    () => [
      [-4.2, 3.6, 10],
      [4.4, 3.4, 9.4],
      [-5.2, 3.8, 4],
      [5.1, 3.7, 3.2],
      [-4.8, 3.5, -2],
      [4.6, 3.9, -3.4],
      [-5.4, 3.6, -10],
      [5.5, 3.8, -11],
      [-3.8, 3.4, -18],
      [4.1, 3.7, -19.5],
      [0, 4.6, 8.4],
      [0, 4.2, -7.5],
    ],
    [],
  )

  return (
    <>
      <color attach="background" args={['#07061a']} />
      <fog attach="fog" args={['#07061a', 14, 42]} />
      <ambientLight intensity={0.22} />
      <hemisphereLight args={['#7aa7ff', '#1a1020', 0.55]} />
      <directionalLight position={[6, 10, 4]} intensity={0.55} color="#ffe6c2" />
      <Stars radius={60} depth={30} count={props.reducedMotion ? 80 : 280} factor={3} fade speed={0.4} />
      <Grid
        infiniteGrid
        fadeDistance={38}
        fadeStrength={1.4}
        cellSize={0.6}
        sectionSize={3.6}
        cellColor="#1d3a55"
        sectionColor="#ff2d95"
        position={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#050414" roughness={0.9} />
      </mesh>
      {lanterns.map((p, i) => (
        <Lantern key={i} position={p} />
      ))}
      <CrashGroup crashed={props.crashed} reduced={props.reducedMotion} seed={1}>
        <Torii />
        <Envelope onClick={props.onEnvelope} hot={envelopeHot} />
      </CrashGroup>
      <CrashGroup crashed={props.crashed} reduced={props.reducedMotion} seed={2}>
        <DanceFloor celebrate={props.celebrate} />
      </CrashGroup>
      <CrashGroup crashed={props.crashed} reduced={props.reducedMotion} seed={3}>
        <Cabinet
          id="japan"
          position={[-3.6, 0, -0.2]}
          color="#ff4d6d"
          label="JAPAN"
          done={props.arcadeDone.japan}
          hot={arcadeHot}
          onClick={props.onCabinet}
        />
        <Cabinet
          id="sport"
          position={[0, 0, -0.6]}
          color="#3dff8a"
          label="SPORT"
          done={props.arcadeDone.sport}
          hot={arcadeHot}
          onClick={props.onCabinet}
        />
        <Cabinet
          id="secret"
          position={[3.6, 0, -0.2]}
          color="#b14dff"
          label="SECRET"
          done={props.arcadeDone.secret}
          hot={arcadeHot}
          onClick={props.onCabinet}
        />
        <SideDoor
          id="kubgu"
          position={[-7.2, 0, 0.4]}
          label="КУБГУ"
          hot={arcadeHot}
          onClick={props.onDoor}
        />
        <SideDoor
          id="vkusno"
          position={[7.2, 0, 0.4]}
          label={'ВКУСНО\nИ ТОЧКА'}
          hot={arcadeHot}
          onClick={props.onDoor}
        />
      </CrashGroup>
      <CrashGroup crashed={props.crashed} reduced={props.reducedMotion} seed={4}>
        <ScoreboardMesh crashed={props.crashed} celebrate={props.celebrate} />
      </CrashGroup>
      <CrashGroup crashed={props.crashed} reduced={props.reducedMotion} seed={5}>
        <PortalArch
          id="calm"
          position={[-4.6, 1.7, -23.5]}
          color="#7ecbff"
          label="СПОКОЙНО"
          hot={portalHot}
          onClick={props.onPortal}
        />
        <PortalArch
          id="play"
          position={[0, 1.7, -24.2]}
          color="#7dffb3"
          label="ПОИГРАТЬ"
          hot={portalHot}
          onClick={props.onPortal}
        />
        <PortalArch
          id="japan"
          position={[4.6, 1.7, -23.5]}
          color="#ff8ad4"
          label="ЯПОНИЯ"
          hot={portalHot}
          onClick={props.onPortal}
        />
      </CrashGroup>
      <GlitchKanji crashed={props.crashed} />
      <Sparkles
        count={props.reducedMotion ? 12 : 40}
        scale={[18, 6, 30]}
        size={2.4}
        speed={0.4}
        color="#ffd27a"
        position={[0, 2.4, -4]}
      />
    </>
  )
}

export function FestivalCanvas({
  ready,
  onReady,
  ...world
}: WorldProps & { ready: boolean; onReady: () => void }) {
  return (
    <div className={`canvas-wrap ${ready ? 'is-ready' : ''}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        camera={{ fov: 42, position: [0, 3.1, 18.4], near: 0.1, far: 90 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#07061a')
          onReady()
        }}
      >
        <CameraRig act={world.act} crashed={world.crashed} reduced={world.reducedMotion} />
        <World {...world} />
      </Canvas>
    </div>
  )
}
