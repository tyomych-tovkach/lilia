import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { maxDistrict } from '../logic'
import { useInvite } from '../state'
import { control } from './input'
import { Lilia } from './Lilia'
import { GATES, SPAWN, WORLD } from './layout'
import { gateFloor, wishXZ } from './move'
import { playerPos, playerYaw } from './playerRef'

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const walking = useRef(false)
  const { camera } = useThree()
  const camYaw = useRef(0.42)
  const lookY = useRef(0.22)
  const dragging = useRef(false)
  const booted = useRef(false)
  const { state } = useInvite()
  const look = useRef(new THREE.Vector3())

  useEffect(() => {
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest?.('.stick, input, textarea, .custom, .hud')) return
      dragging.current = true
    }
    const up = () => {
      dragging.current = false
    }
    const move = (e: PointerEvent) => {
      if (!dragging.current) return
      camYaw.current -= e.movementX * 0.006
      lookY.current = THREE.MathUtils.clamp(lookY.current - e.movementY * 0.003, 0.1, 0.48)
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
    const open = maxDistrict(state)
    const floor = gateFloor(open, GATES, WORLD.zMin)
    const clamped = {
      x: Math.min(WORLD.x, Math.max(-WORLD.x, t.x)),
      z: Math.min(WORLD.zMax, Math.max(Math.max(WORLD.zMin, floor), t.z)),
    }
    if (clamped.x !== t.x || clamped.z !== t.z) {
      rb.setTranslation({ x: clamped.x, y: t.y, z: clamped.z }, true)
      rb.setLinvel({ x: 0, y: Math.max(rb.linvel().y, -18), z: 0 }, true)
    }
    playerPos.set(clamped.x, t.y, clamped.z)

    camera.getWorldDirection(look.current)
    const wish = wishXZ(look.current.x, look.current.z, control.x, control.z)
    walking.current = wish.x * wish.x + wish.z * wish.z > 0.01
    const speed = 4.6
    const v = rb.linvel()
    rb.setLinvel({ x: wish.x * speed, y: Math.max(v.y, -18), z: wish.z * speed }, true)
    if (walking.current) playerYaw.current = Math.atan2(wish.x, wish.z)

    const camDist = 4.15
    const camH = 1.55 + lookY.current * 2.8
    const desired = new THREE.Vector3(
      clamped.x + Math.sin(camYaw.current) * camDist,
      t.y + camH,
      clamped.z + Math.cos(camYaw.current) * camDist,
    )
    desired.x = THREE.MathUtils.clamp(desired.x, -WORLD.x + 0.15, WORLD.x - 0.15)
    desired.z = THREE.MathUtils.clamp(desired.z, WORLD.zMin + 0.4, WORLD.zMax - 0.2)
    if (!booted.current) {
      camera.position.copy(desired)
      booted.current = true
    } else {
      camera.position.lerp(desired, 1 - Math.exp(-dt * 10))
    }
    camera.lookAt(clamped.x, t.y + 1.12, clamped.z)
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
      <CapsuleCollider args={[0.36, 0.22]} position={[0, 0.58, 0]} />
      <Yawed walking={walking} />
    </RigidBody>
  )
}

function Yawed({ walking }: { walking: { current: boolean } }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (ref.current) ref.current.rotation.y = playerYaw.current
  })
  return (
    <group ref={ref}>
      <Lilia walking={walking} />
    </group>
  )
}
