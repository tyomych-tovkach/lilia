import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useEffect, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useInvite } from '../state'
import { control } from './input'
import { Lilia } from './Lilia'
import { nearInteract } from './Interactable'
import { wishXZ } from './move'
import { groundedRef, PLACE, playerPos, playerYaw, talkLock, vyRef } from './playerRef'

const BOOM = 3.7
const LOOK_Y = 1.18
const WARP_FRAMES = 10

function placeCamera(camera: THREE.Camera, x: number, y: number, z: number, yaw: number, pitch: number) {
  const desiredY = THREE.MathUtils.clamp(y + LOOK_Y + Math.sin(-pitch) * BOOM * 0.55 + 0.72, 1.5, 6.2)
  camera.position.set(
    x + Math.sin(yaw) * Math.cos(pitch) * BOOM,
    desiredY,
    z + Math.cos(yaw) * Math.cos(pitch) * BOOM,
  )
  camera.lookAt(x, y + LOOK_Y, z)
}

function live(rb: RapierRigidBody | null): rb is RapierRigidBody {
  try {
    return Boolean(rb && rb.isValid())
  } catch {
    return false
  }
}

function snapBody(rb: RapierRigidBody, spawn: [number, number, number]) {
  rb.setTranslation({ x: spawn[0], y: spawn[1], z: spawn[2] }, true)
  rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
}

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const walking = useRef(false)
  const { camera } = useThree()
  const { state } = useInvite()
  const camYaw = useRef(0.32)
  const camPitch = useRef(-0.28)
  const booted = useRef(false)
  const look = useRef(new THREE.Vector3())
  const coyote = useRef(0)
  const warp = useRef(0)
  const loc = state.location
  const spawn = PLACE[loc].spawn
  const half = PLACE[loc].half

  useLayoutEffect(() => {
    playerPos.set(...spawn)
    playerYaw.current = Math.PI
    camYaw.current = loc === 'hub' ? 0.32 : 0.18
    camPitch.current = -0.28
    booted.current = false
    warp.current = WARP_FRAMES
    placeCamera(camera, spawn[0], spawn[1], spawn[2], camYaw.current, camPitch.current)
  }, [loc, spawn, camera])

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
    if (warp.current > 0) {
      playerPos.set(...spawn)
      placeCamera(camera, spawn[0], spawn[1], spawn[2], camYaw.current, camPitch.current)
      walking.current = false
      if (live(rb)) {
        snapBody(rb, spawn)
        warp.current -= 1
        booted.current = true
      }
      return
    }
    if (!live(rb)) return
    const t = rb.translation()
    const v = rb.linvel()
    if (t.y < -0.6 || t.y > 7.5) {
      snapBody(rb, spawn)
      playerPos.set(...spawn)
      placeCamera(camera, spawn[0], spawn[1], spawn[2], camYaw.current, camPitch.current)
      return
    }
    const floor = 0.12
    const grounded = t.y <= floor + 0.22 && v.y <= 0.4
    groundedRef.current = grounded
    vyRef.current = v.y
    coyote.current = grounded ? 0.11 : Math.max(0, coyote.current - dt)

    let x = THREE.MathUtils.clamp(t.x, -half + 0.45, half - 0.45)
    let z = THREE.MathUtils.clamp(t.z, -half + 0.45, half - 0.45)
    if (loc === 'yesno' && z < 3.35 && z > -4.45 && Math.abs(x) < 2.15) {
      x = THREE.MathUtils.clamp(x, -0.92, 0.92)
    }
    if (x !== t.x || z !== t.z) rb.setTranslation({ x, y: t.y, z }, true)
    playerPos.set(x, t.y, z)

    camera.getWorldDirection(look.current)
    const locked = talkLock.current
    const wish = locked ? { x: 0, z: 0 } : wishXZ(look.current.x, look.current.z, control.x, control.z)
    walking.current = wish.x * wish.x + wish.z * wish.z > 0.01
    const speed = 2.85
    let vy = v.y
    if (!locked && control.jumpQueued && coyote.current > 0) {
      vy = 5.1
      control.jumpQueued = false
      coyote.current = 0
    }
    if (!control.jump && vy > 1.2) vy *= 0.92
    rb.setLinvel({ x: wish.x * speed, y: Math.max(vy, -22), z: wish.z * speed }, true)
    if (walking.current) playerYaw.current = Math.atan2(wish.x, wish.z)

    const desired = new THREE.Vector3(
      x + Math.sin(camYaw.current) * Math.cos(camPitch.current) * BOOM,
      t.y + LOOK_Y + Math.sin(-camPitch.current) * BOOM * 0.55 + 0.72,
      z + Math.cos(camYaw.current) * Math.cos(camPitch.current) * BOOM,
    )
    desired.y = THREE.MathUtils.clamp(desired.y, 1.5, 6.2)
    if (!booted.current) {
      camera.position.copy(desired)
      booted.current = true
    } else {
      camera.position.lerp(desired, 1 - Math.exp(-dt * 9))
    }
    camera.lookAt(x, t.y + LOOK_Y, z)
    if (loc === 'yesno' && !state.saidYes && state.crashStage > 0) {
      const stage = state.crashStage
      const amp = stage === 1 ? 0.014 : stage === 2 ? 0.055 : stage === 3 ? 0.08 : 0
      const f = stage === 1 ? 18 : stage === 2 ? 9 : 12
      const clock = performance.now() / 1000
      camera.position.x += Math.sin(clock * f) * amp
      camera.position.y += Math.cos(clock * f * 1.31) * amp * 0.62
    }
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
