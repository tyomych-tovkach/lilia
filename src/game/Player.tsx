import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { control } from './input'
import { SPAWN } from './layout'
import { playerPos, playerYaw } from './playerRef'

function Lilia({ walking }: { walking: { current: boolean } }) {
  const g = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!g.current) return
    const t = state.clock.elapsedTime
    const move = walking.current
    const bob = move ? Math.sin(t * 10) * 0.05 : Math.sin(t * 2) * 0.015
    g.current.position.y = bob
    g.current.rotation.z = move ? Math.sin(t * 10) * 0.04 : 0
  })
  return (
    <group ref={g}>
      <mesh position={[0, 0.42, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 6, 10]} />
        <meshStandardMaterial color="#3a1848" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.38, 0.12]} rotation={[0.15, 0, 0]}>
        <coneGeometry args={[0.28, 0.7, 8]} />
        <meshStandardMaterial color="#ff4d9a" emissive="#7a1848" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f3c7a8" />
      </mesh>
      <mesh position={[0, 1.16, 0]}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial color="#1a1218" />
      </mesh>
      <mesh position={[0.16, 1.22, 0.02]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#1a1218" />
      </mesh>
      <mesh position={[-0.16, 1.22, 0.02]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#1a1218" />
      </mesh>
      <mesh position={[0.08, 1.28, 0.04]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#ffb020" emissive="#ffb020" emissiveIntensity={1.4} />
      </mesh>
    </group>
  )
}

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const walking = useRef(false)
  const { camera } = useThree()
  const camYaw = useRef(0)
  const lookY = useRef(0.32)
  const dragging = useRef(false)

  useEffect(() => {
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest?.('.stick, .diegetic, input, textarea')) return
      dragging.current = true
    }
    const up = () => {
      dragging.current = false
    }
    const move = (e: PointerEvent) => {
      if (!dragging.current) return
      camYaw.current -= e.movementX * 0.005
      lookY.current = THREE.MathUtils.clamp(lookY.current + e.movementY * 0.003, 0.12, 0.55)
    }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  useFrame((_, dt) => {
    const rb = body.current
    if (!rb) return
    const t = rb.translation()
    playerPos.set(t.x, t.y, t.z)

    const fwd = new THREE.Vector3(-Math.sin(camYaw.current), 0, -Math.cos(camYaw.current))
    const right = new THREE.Vector3(fwd.z, 0, -fwd.x)
    const wish = new THREE.Vector3()
    wish.addScaledVector(fwd, control.z)
    wish.addScaledVector(right, control.x)
    if (wish.lengthSq() > 1) wish.normalize()
    walking.current = wish.lengthSq() > 0.01
    const speed = 5.4
    const v = rb.linvel()
    rb.setLinvel({ x: wish.x * speed, y: v.y, z: wish.z * speed }, true)

    if (walking.current) {
      playerYaw.current = Math.atan2(wish.x, wish.z)
    }

    const camDist = 6.4
    const camH = 2.2 + lookY.current * 4
    const desired = new THREE.Vector3(
      t.x - fwd.x * camDist,
      t.y + camH,
      t.z - fwd.z * camDist,
    )
    camera.position.lerp(desired, 1 - Math.exp(-dt * 8))
    const look = new THREE.Vector3(t.x, t.y + 1.25, t.z)
    camera.lookAt(look)
  })

  return (
    <RigidBody
      ref={body}
      position={SPAWN}
      colliders={false}
      lockRotations
      friction={0}
      restitution={0}
      canSleep={false}
    >
      <CapsuleCollider args={[0.42, 0.28]} position={[0, 0.7, 0]} />
      <group rotation-y={0}>
        <Yawed walking={walking} />
      </group>
    </RigidBody>
  )
}

function Yawed({ walking }: { walking: { current: boolean } }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y = playerYaw.current
  })
  return (
    <group ref={ref}>
      <Lilia walking={walking} />
    </group>
  )
}
