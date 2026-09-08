import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useInvite } from '../state'
import { control } from './input'
import { Lilia } from './Lilia'
import { nearInteract } from './Interactable'
import { wishXZ } from './move'
import { groundedRef, PLACE, playerPos, playerYaw, talkLock, vyRef } from './playerRef'

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const walking = useRef(false)
  const { camera } = useThree()
  const { state } = useInvite()
  const camYaw = useRef(0.35)
  const camPitch = useRef(-0.22)
  const booted = useRef(false)
  const look = useRef(new THREE.Vector3())
  const coyote = useRef(0)
  const loc = state.location
  const spawn = PLACE[loc].spawn
  const half = PLACE[loc].half

  useEffect(() => {
    const rb = body.current
    if (rb) {
      rb.setTranslation({ x: spawn[0], y: spawn[1], z: spawn[2] }, true)
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }
    playerPos.set(...spawn)
    playerYaw.current = Math.PI
    booted.current = false
  }, [loc, spawn])

  useEffect(() => {
    const down = (e: PointerEvent) => {
      const el = e.target as HTMLElement
      if (el.closest?.('input, textarea, button, .talk')) return
      if (talkLock.current || nearInteract.current) return
      if (el.tagName === 'CANVAS') el.requestPointerLock()
    }
    const move = (e: PointerEvent) => {
      if (talkLock.current) return
      if (document.pointerLockElement) {
        camYaw.current -= e.movementX * 0.0028
        camPitch.current = THREE.MathUtils.clamp(camPitch.current - e.movementY * 0.0022, -0.42, 0.38)
      }
    }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  useFrame((_, dt) => {
    const rb = body.current
    if (!rb) return
    const t = rb.translation()
    const v = rb.linvel()
    const floor = 0.12
    const grounded = t.y <= floor + 0.22 && v.y <= 0.4
    groundedRef.current = grounded
    vyRef.current = v.y
    coyote.current = grounded ? 0.11 : Math.max(0, coyote.current - dt)

    let x = THREE.MathUtils.clamp(t.x, -half + 0.45, half - 0.45)
    let z = THREE.MathUtils.clamp(t.z, -half + 0.45, half - 0.45)
    if (x !== t.x || z !== t.z) rb.setTranslation({ x, y: t.y, z }, true)
    playerPos.set(x, t.y, z)

    camera.getWorldDirection(look.current)
    const locked = talkLock.current
    const wish = locked ? { x: 0, z: 0 } : wishXZ(look.current.x, look.current.z, control.x, control.z)
    walking.current = wish.x * wish.x + wish.z * wish.z > 0.01
    const speed = 2.85
    let vy = v.y
    if (!locked && control.jumpQueued && coyote.current > 0) {
      vy = 8.1
      control.jumpQueued = false
      coyote.current = 0
    }
    if (!control.jump && vy > 1.2) vy *= 0.92
    rb.setLinvel({ x: wish.x * speed, y: Math.max(vy, -22), z: wish.z * speed }, true)
    if (walking.current) playerYaw.current = Math.atan2(wish.x, wish.z)

    const boom = 6.4
    const lookY = 1.18
    const desired = new THREE.Vector3(
      x + Math.sin(camYaw.current) * Math.cos(camPitch.current) * boom,
      t.y + lookY + Math.sin(-camPitch.current) * boom * 0.62 + 1.35,
      z + Math.cos(camYaw.current) * Math.cos(camPitch.current) * boom,
    )
    desired.y = THREE.MathUtils.clamp(desired.y, 1.6, 9.5)
    if (!booted.current) {
      camera.position.copy(desired)
      booted.current = true
    } else {
      camera.position.lerp(desired, 1 - Math.exp(-dt * 9))
    }
    camera.lookAt(x, t.y + lookY, z)
  })

  return (
    <RigidBody
      ref={body}
      position={spawn}
      colliders={false}
      lockRotations
      friction={0}
      restitution={0}
      canSleep={false}
      mass={42}
    >
      <CapsuleCollider args={[0.52, 0.28]} position={[0, 0.8, 0]} />
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
      <Lilia walking={walking} grounded={groundedRef} vy={vyRef} />
    </group>
  )
}
