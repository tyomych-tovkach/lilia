import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { Float, Grid, Sparkles, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Kit } from './Kit'
import { SPOTS } from './layout'
import { useInvite } from '../state'

function Lantern({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.2} floatIntensity={0.15} rotationIntensity={0.08}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#ffb020" emissive="#ff8a00" emissiveIntensity={1.8} />
        </mesh>
        <pointLight color="#ffb020" intensity={1.1} distance={5} />
      </group>
    </Float>
  )
}

function Dancer({ file, position, phase }: { file: string; position: [number, number, number]; phase: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + phase
    ref.current.position.y = Math.abs(Math.sin(t * 3)) * 0.12
    ref.current.rotation.y = t * 0.6
  })
  return (
    <group ref={ref} position={position}>
      <Kit file={file} scale={1.15} />
    </group>
  )
}

export function Plaza() {
  const crashed = useInvite().state.crashed
  const tilt = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!tilt.current) return
    if (!crashed) {
      tilt.current.rotation.set(0, 0, 0)
      return
    }
    const t = state.clock.elapsedTime
    tilt.current.rotation.z = Math.sin(t * 9) * 0.08
    tilt.current.rotation.x = Math.cos(t * 7) * 0.05
  })

  return (
    <>
      <color attach="background" args={['#07061a']} />
      <fog attach="fog" args={['#07061a', 16, 42]} />
      <ambientLight intensity={0.28} />
      <hemisphereLight args={['#89a7ff', '#1a1020', 0.7]} />
      <directionalLight position={[8, 14, 6]} intensity={0.7} color="#ffe6c4" />
      <Stars radius={70} depth={28} count={400} factor={3} fade speed={0.35} />
      <Grid
        infiniteGrid
        fadeDistance={34}
        cellSize={0.7}
        sectionSize={3.5}
        cellColor="#1a3550"
        sectionColor="#ff2d95"
        position={[0, 0.001, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#080616" />
      </mesh>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[16, 0.2, 20]} position={[0, -0.2, -3]} />
        <CuboidCollider args={[16, 3, 0.4]} position={[0, 2, 14.2]} />
        <CuboidCollider args={[16, 3, 0.4]} position={[0, 2, -24.6]} />
        <CuboidCollider args={[0.4, 3, 20]} position={[-14.5, 2, -3]} />
        <CuboidCollider args={[0.4, 3, 20]} position={[14.5, 2, -3]} />
      </RigidBody>
      <Sparkles count={50} scale={[22, 5, 30]} size={2.5} speed={0.45} color="#ffd27a" position={[0, 2.4, -4]} />

      <group ref={tilt}>
        <Kit file="column.glb" position={[-7.5, 0, 8.2]} scale={1.8} />
        <Kit file="column.glb" position={[7.5, 0, 8.2]} scale={1.8} />
        <mesh position={[0, 2.7, 8.2]}>
          <boxGeometry args={[5.8, 0.28, 0.45]} />
          <meshStandardMaterial color="#c44536" emissive="#5a1810" emissiveIntensity={0.4} />
        </mesh>
        <Kit file="dance-machine.glb" position={SPOTS.dance} scale={1.6} rotation={[0, Math.PI, 0]} />
        <RigidBody type="fixed" colliders={false} position={SPOTS.dance}>
          <CuboidCollider args={[0.7, 0.8, 0.7]} position={[0, 0.8, 0]} />
        </RigidBody>
        <Dancer file="character-gamer.glb" position={[-1.3, 0, 3.6]} phase={0} />
        <Dancer file="character-employee.glb" position={[1.4, 0, 2.6]} phase={1.2} />
        <Kit file="air-hockey.glb" position={[-8.5, 0, 4.2]} scale={1.4} rotation={[0, 0.4, 0]} />
        <Kit file="pinball.glb" position={[8.6, 0, 4]} scale={1.45} rotation={[0, -0.5, 0]} />
        <Kit file="prizes.glb" position={[-3.2, 0, 6.2]} scale={1.5} />
        <Kit file="column.glb" position={[-11, 0, -8]} scale={1.7} />
        <Kit file="column.glb" position={[11, 0, -8]} scale={1.7} />
        <Kit file="wall.glb" position={[-13.2, 0, -1]} scale={[2.2, 1.8, 1.8]} rotation={[0, Math.PI / 2, 0]} />
        <Kit file="wall.glb" position={[13.2, 0, -1]} scale={[2.2, 1.8, 1.8]} rotation={[0, -Math.PI / 2, 0]} />
      </group>

      <Lantern position={[-4.2, 3.2, 9]} />
      <Lantern position={[4.2, 3.3, 8.6]} />
      <Lantern position={[-6.4, 3.1, 2]} />
      <Lantern position={[6.5, 3.4, 1.6]} />
      <Lantern position={[-6.2, 3.2, -6]} />
      <Lantern position={[6.2, 3.3, -6.4]} />
      <Lantern position={[-4.8, 3.1, -13]} />
      <Lantern position={[4.8, 3.4, -13.4]} />
      <Lantern position={[0, 3.6, -10]} />
      <Lantern position={[0, 3.5, 10.4]} />
    </>
  )
}
