import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { crashPulse } from './crashFx'

const SKIN = '#e8b49a'
const SKIN_EAR = '#e0a090'
const LIP = '#c45a6a'
const LIP_DEEP = '#a84858'
const SCLERA = '#fffdf8'
const IRIS_OUTER = '#3a1810'
const PUPIL = '#090604'
const HAIR = '#1a0c0a'
const HAIR_LIT = '#3a2018'
const HAIR_HI = '#4a281c'
const YUKATA = '#d42a62'
const YUKATA_MID = '#c41e58'
const YUKATA_DARK = '#8a143c'
const LINING = '#f7e6d8'
const OBI = '#e8c96a'
const OBI_DARK = '#b8882a'
const OBI_KNOT = '#8a5a18'
const TABI = '#f4eee6'
const GETA = '#5a3010'
const GOLD = '#e8c96a'

function makeFaceTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const ctx = c.getContext('2d')!
  ctx.fillStyle = SKIN
  ctx.fillRect(0, 0, 512, 512)
  const zone = ctx.createRadialGradient(256, 140, 20, 256, 140, 140)
  zone.addColorStop(0, '#f0c4b0')
  zone.addColorStop(1, SKIN)
  ctx.fillStyle = zone
  ctx.fillRect(80, 40, 352, 200)
  const blush = (cx: number) => {
    const g = ctx.createRadialGradient(cx, 280, 4, cx, 280, 55)
    g.addColorStop(0, 'rgba(232, 110, 130, 0.42)')
    g.addColorStop(1, 'rgba(232, 110, 130, 0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(cx, 280, 48, 28, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  blush(190)
  blush(322)
  ctx.strokeStyle = '#1a1210'
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(150, 215)
  ctx.quadraticCurveTo(195, 200, 228, 214)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(362, 215)
  ctx.quadraticCurveTo(317, 200, 284, 214)
  ctx.stroke()
  ctx.fillStyle = '#1a1210'
  ctx.beginPath()
  ctx.ellipse(195, 250, 26, 5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(317, 250, 26, 5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = LIP
  ctx.beginPath()
  ctx.ellipse(256, 345, 14, 6, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = LIP_DEEP
  ctx.beginPath()
  ctx.ellipse(256, 351, 13, 5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = HAIR
  ctx.beginPath()
  ctx.moveTo(40, 90)
  ctx.quadraticCurveTo(256, 128, 472, 90)
  ctx.lineTo(512, 0)
  ctx.lineTo(0, 0)
  ctx.fill()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

type Strand = { r: number; len: number; p: [number, number, number]; rot: [number, number, number]; c: string }

const BANGS: Strand[] = [
  { r: 0.018, len: 0.11, p: [0, 0.02, 0.1], rot: [1.15, 0, 0], c: HAIR },
  { r: 0.016, len: 0.12, p: [-0.028, 0.02, 0.095], rot: [1.1, 0.18, 0.08], c: HAIR_LIT },
  { r: 0.016, len: 0.12, p: [0.028, 0.02, 0.095], rot: [1.1, -0.18, -0.08], c: HAIR },
  { r: 0.015, len: 0.13, p: [-0.052, 0, 0.085], rot: [1, 0.4, 0.15], c: HAIR },
  { r: 0.015, len: 0.13, p: [0.052, 0, 0.085], rot: [1, -0.4, -0.15], c: HAIR_LIT },
  { r: 0.014, len: 0.1, p: [-0.015, 0.03, 0.1], rot: [1.2, 0.08, 0], c: HAIR_HI },
  { r: 0.014, len: 0.1, p: [0.015, 0.03, 0.1], rot: [1.2, -0.08, 0], c: HAIR },
]

const SIDES: Strand[] = [
  { r: 0.022, len: 0.28, p: [-0.08, -0.06, 0.04], rot: [0.35, 0.15, 0.55], c: HAIR },
  { r: 0.02, len: 0.32, p: [-0.09, -0.08, 0], rot: [0.25, 0.2, 0.48], c: HAIR_LIT },
  { r: 0.018, len: 0.36, p: [-0.085, -0.1, -0.03], rot: [0.2, 0.1, 0.4], c: HAIR },
  { r: 0.016, len: 0.22, p: [-0.07, -0.04, 0.07], rot: [0.55, 0.25, 0.35], c: HAIR_HI },
  { r: 0.022, len: 0.28, p: [0.08, -0.06, 0.04], rot: [0.35, -0.15, -0.55], c: HAIR },
  { r: 0.02, len: 0.32, p: [0.09, -0.08, 0], rot: [0.25, -0.2, -0.48], c: HAIR_LIT },
  { r: 0.018, len: 0.36, p: [0.085, -0.1, -0.03], rot: [0.2, -0.1, -0.4], c: HAIR },
  { r: 0.016, len: 0.22, p: [0.07, -0.04, 0.07], rot: [0.55, -0.25, -0.35], c: HAIR_HI },
]

const BACK: Strand[] = [
  { r: 0.032, len: 0.62, p: [0, -0.28, -0.08], rot: [0.22, 0, 0], c: HAIR },
  { r: 0.028, len: 0.58, p: [-0.04, -0.26, -0.07], rot: [0.25, 0.12, 0.1], c: HAIR_LIT },
  { r: 0.028, len: 0.58, p: [0.04, -0.26, -0.07], rot: [0.25, -0.12, -0.1], c: HAIR },
  { r: 0.024, len: 0.55, p: [-0.07, -0.24, -0.05], rot: [0.28, 0.22, 0.16], c: HAIR },
  { r: 0.024, len: 0.55, p: [0.07, -0.24, -0.05], rot: [0.28, -0.22, -0.16], c: HAIR_LIT },
  { r: 0.022, len: 0.5, p: [-0.09, -0.2, -0.02], rot: [0.3, 0.3, 0.22], c: HAIR },
  { r: 0.022, len: 0.5, p: [0.09, -0.2, -0.02], rot: [0.3, -0.3, -0.22], c: HAIR },
  { r: 0.026, len: 0.64, p: [0, -0.3, -0.11], rot: [0.18, 0, 0], c: HAIR },
  { r: 0.02, len: 0.48, p: [-0.03, -0.22, -0.12], rot: [0.15, 0.08, 0.06], c: HAIR_HI },
  { r: 0.02, len: 0.48, p: [0.03, -0.22, -0.12], rot: [0.15, -0.08, -0.06], c: HAIR },
  { r: 0.018, len: 0.42, p: [-0.06, -0.18, -0.1], rot: [0.2, 0.18, 0.12], c: HAIR_LIT },
  { r: 0.018, len: 0.42, p: [0.06, -0.18, -0.1], rot: [0.2, -0.18, -0.12], c: HAIR },
]

function HairLock({ s }: { s: Strand }) {
  return (
    <mesh position={s.p} rotation={s.rot}>
      <capsuleGeometry args={[s.r, s.len, 6, 10]} />
      <meshStandardMaterial color={s.c} roughness={0.28} />
    </mesh>
  )
}

function Hand({ side }: { side: 1 | -1 }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.058, 0.078, 0.022]} />
        <meshStandardMaterial color={SKIN} roughness={0.48} />
      </mesh>
      <mesh position={[0, -0.01, 0.008]} scale={[1.1, 1.3, 0.55]}>
        <sphereGeometry args={[0.028, 10, 8]} />
        <meshStandardMaterial color={SKIN} roughness={0.48} />
      </mesh>
      {(
        [
          [0.018 * side, -0.058, 0.006, 0.0075, 0.034, 0.2, 0.08 * side],
          [0.004 * side, -0.062, 0.008, 0.008, 0.038, 0.18, 0],
          [-0.012 * side, -0.058, 0.006, 0.0072, 0.034, 0.2, -0.06 * side],
          [-0.026 * side, -0.048, 0.002, 0.0062, 0.026, 0.25, -0.12 * side],
        ] as const
      ).map((f, i) => (
        <mesh key={i} position={[f[0], f[1], f[2]]} rotation={[f[5], 0, f[6]]}>
          <capsuleGeometry args={[f[3], f[4], 3, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.48} />
        </mesh>
      ))}
      <mesh position={[0.03 * side, -0.018, 0.016]} rotation={[0.55, 0.95 * side, 1.05 * side]}>
        <capsuleGeometry args={[0.0085, 0.026, 3, 8]} />
        <meshStandardMaterial color={SKIN} roughness={0.48} />
      </mesh>
    </group>
  )
}

function Leg() {
  return (
    <>
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.052, 0.24, 8, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.32, 0.01]}>
        <sphereGeometry args={[0.046, 16, 12]} />
        <meshStandardMaterial color={SKIN} roughness={0.5} />
      </mesh>
    </>
  )
}

export function Lilia({
  walking,
  grounded,
  vy,
}: {
  walking: { current: boolean }
  grounded: { current: boolean }
  vy: { current: number }
}) {
  const g = useRef<THREE.Group>(null)
  const deform = useRef<THREE.Group>(null)
  const lLeg = useRef<THREE.Group>(null)
  const rLeg = useRef<THREE.Group>(null)
  const lShin = useRef<THREE.Group>(null)
  const rShin = useRef<THREE.Group>(null)
  const lArm = useRef<THREE.Group>(null)
  const rArm = useRef<THREE.Group>(null)
  const hair = useRef<THREE.Group>(null)
  const torso = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const face = useMemo(() => makeFaceTexture(), [])
  const squash = useRef(1)
  const wasAir = useRef(false)
  const flinch = useRef(0)

  useFrame((state, dt) => {
    if (!g.current || !deform.current) return
    const t = state.clock.elapsedTime
    const move = walking.current
    const air = !grounded.current
    const since = typeof performance !== 'undefined' ? performance.now() - crashPulse.at : 9999
    if (crashPulse.at > 0 && since < 420) {
      flinch.current = since / 420
      const u = flinch.current
      const sx = u < 0.17 ? 1.08 : u < 0.43 ? 0.94 : 1
      const sy = u < 0.17 ? 0.86 : u < 0.43 ? 1.06 : 1
      const rz = u < 0.17 ? -0.14 : u < 0.43 ? 0.08 : 0
      const px = u < 0.17 ? -0.06 : u < 0.43 ? 0.03 : 0
      deform.current.scale.set(sx, sy, sx)
      g.current.rotation.z = rz
      g.current.position.x = px
    } else {
      g.current.rotation.z = 0
      g.current.position.x = 0
      if (air) {
        wasAir.current = true
        const stretch = 1 + Math.min(0.12, Math.max(0, vy.current) * 0.02)
        deform.current.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch))
      } else {
        if (wasAir.current) {
          squash.current = 0.84
          wasAir.current = false
        }
        squash.current += (1 - squash.current) * Math.min(1, dt * 8)
        const y = squash.current
        deform.current.scale.set(Math.sqrt(1 / y), y, Math.sqrt(1 / y))
      }
    }
    const swing = move && !air ? Math.sin(t * 10.5) : 0
    g.current.position.y = move && !air ? Math.abs(Math.sin(t * 10.5)) * 0.045 : Math.sin(t * 2.4) * 0.012
    if (lLeg.current) lLeg.current.rotation.x = swing * 0.5
    if (rLeg.current) rLeg.current.rotation.x = -swing * 0.5
    if (lShin.current) lShin.current.rotation.x = move && !air ? Math.max(0, -swing) * 0.55 : 0
    if (rShin.current) rShin.current.rotation.x = move && !air ? Math.max(0, swing) * 0.55 : 0
    if (lArm.current) {
      lArm.current.rotation.x = -swing * 0.32
      lArm.current.rotation.z = 0.22
      lArm.current.rotation.y = 0.06
    }
    if (rArm.current) {
      rArm.current.rotation.x = swing * 0.32
      rArm.current.rotation.z = -0.22
      rArm.current.rotation.y = -0.06
    }
    if (torso.current) {
      torso.current.rotation.y = swing * 0.07
      torso.current.rotation.x = air ? -0.1 : Math.sin(t * 2.4) * 0.015
    }
    if (head.current) {
      head.current.rotation.x = air ? 0.08 : Math.sin(t * 2.4) * 0.02
      head.current.rotation.y = swing * 0.04
    }
    if (hair.current) hair.current.rotation.x = air ? 0.14 : move ? Math.sin(t * 10.5) * 0.08 : Math.sin(t * 1.4) * 0.03
  })

  return (
    <group ref={g} scale={1.05}>
      <group ref={deform}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[0.26, 24]} />
          <meshBasicMaterial color="#000" transparent opacity={0.28} />
        </mesh>
        <group ref={lLeg} position={[-0.1, 0.74, 0]}>
          <Leg />
          <group ref={lShin} position={[0, -0.32, 0.02]}>
            <mesh position={[0, -0.15, 0]}>
              <capsuleGeometry args={[0.04, 0.22, 8, 16]} />
              <meshStandardMaterial color={SKIN} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.3, 0.02]}>
              <sphereGeometry args={[0.03, 12, 10]} />
              <meshStandardMaterial color={SKIN} />
            </mesh>
            <mesh position={[0, -0.328, 0.045]} rotation={[0.18, 0, 0]}>
              <boxGeometry args={[0.072, 0.038, 0.155]} />
              <meshStandardMaterial color={TABI} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.355, 0.05]} rotation={[0.12, 0, 0]}>
              <boxGeometry args={[0.088, 0.022, 0.175]} />
              <meshStandardMaterial color={GETA} roughness={0.55} />
            </mesh>
            <mesh position={[0, -0.375, 0.1]}>
              <boxGeometry args={[0.07, 0.028, 0.022]} />
              <meshStandardMaterial color={GETA} />
            </mesh>
            <mesh position={[0, -0.375, 0]}>
              <boxGeometry args={[0.07, 0.028, 0.022]} />
              <meshStandardMaterial color={GETA} />
            </mesh>
          </group>
        </group>
        <group ref={rLeg} position={[0.1, 0.74, 0]}>
          <Leg />
          <group ref={rShin} position={[0, -0.32, 0.02]}>
            <mesh position={[0, -0.15, 0]}>
              <capsuleGeometry args={[0.04, 0.22, 8, 16]} />
              <meshStandardMaterial color={SKIN} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.3, 0.02]}>
              <sphereGeometry args={[0.03, 12, 10]} />
              <meshStandardMaterial color={SKIN} />
            </mesh>
            <mesh position={[0, -0.328, 0.045]} rotation={[0.18, 0, 0]}>
              <boxGeometry args={[0.072, 0.038, 0.155]} />
              <meshStandardMaterial color={TABI} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.355, 0.05]} rotation={[0.12, 0, 0]}>
              <boxGeometry args={[0.088, 0.022, 0.175]} />
              <meshStandardMaterial color={GETA} roughness={0.55} />
            </mesh>
            <mesh position={[0, -0.375, 0.1]}>
              <boxGeometry args={[0.07, 0.028, 0.022]} />
              <meshStandardMaterial color={GETA} />
            </mesh>
            <mesh position={[0, -0.375, 0]}>
              <boxGeometry args={[0.07, 0.028, 0.022]} />
              <meshStandardMaterial color={GETA} />
            </mesh>
          </group>
        </group>
        <mesh position={[0, 0.5, 0.02]}>
          <cylinderGeometry args={[0.125, 0.255, 0.84, 48]} />
          <meshStandardMaterial color={YUKATA} roughness={0.4} />
        </mesh>
        <mesh position={[0.01, 0.5, 0.03]}>
          <cylinderGeometry args={[0.128, 0.248, 0.82, 32, 1, true, 0.35, 2.05]} />
          <meshStandardMaterial color={YUKATA_MID} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.5, -0.01]}>
          <cylinderGeometry args={[0.122, 0.25, 0.83, 32, 1, true, 3.4, 2.2]} />
          <meshStandardMaterial color={YUKATA_DARK} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.085, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.248, 0.012, 8, 48]} />
          <meshStandardMaterial color={YUKATA_DARK} />
        </mesh>
        <mesh position={[-0.08, 0.48, 0.2]} rotation={[0, 0.35, 0.04]}>
          <boxGeometry args={[0.02, 0.62, 0.002]} />
          <meshStandardMaterial color={GOLD} metalness={0.2} roughness={0.35} />
        </mesh>
        <mesh position={[0.1, 0.48, 0.18]} rotation={[0, -0.55, -0.03]}>
          <boxGeometry args={[0.02, 0.62, 0.002]} />
          <meshStandardMaterial color={GOLD} metalness={0.2} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.74, 0.01]} scale={[1.15, 0.55, 0.85]}>
          <sphereGeometry args={[0.14, 32, 24]} />
          <meshStandardMaterial color={YUKATA} roughness={0.4} />
        </mesh>
        <group ref={torso} position={[0, 0.93, 0]}>
          <mesh position={[0, 0.02, 0.01]}>
            <cylinderGeometry args={[0.12, 0.128, 0.16, 32]} />
            <meshStandardMaterial color={YUKATA} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.18, 0.02]} scale={[1.05, 0.85, 0.78]}>
            <sphereGeometry args={[0.145, 32, 24]} />
            <meshStandardMaterial color={YUKATA} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.22, 0.05]} scale={[1.12, 0.55, 0.7]}>
            <sphereGeometry args={[0.13, 32, 24]} />
            <meshStandardMaterial color={YUKATA} roughness={0.4} />
          </mesh>
          <mesh position={[-0.055, 0.2, 0.08]} scale={[1.15, 0.85, 0.9]}>
            <sphereGeometry args={[0.055, 16, 12]} />
            <meshStandardMaterial color={YUKATA} roughness={0.4} />
          </mesh>
          <mesh position={[0.055, 0.2, 0.08]} scale={[1.15, 0.85, 0.9]}>
            <sphereGeometry args={[0.055, 16, 12]} />
            <meshStandardMaterial color={YUKATA} roughness={0.4} />
          </mesh>
          <mesh position={[-0.07, 0.3, 0.06]} rotation={[0.15, 0, 1.15]}>
            <capsuleGeometry args={[0.012, 0.1, 4, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.48} />
          </mesh>
          <mesh position={[0.07, 0.3, 0.06]} rotation={[0.15, 0, -1.15]}>
            <capsuleGeometry args={[0.012, 0.1, 4, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.48} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.155, 0.155, 0.145, 32]} />
            <meshStandardMaterial color={OBI} roughness={0.3} metalness={0.16} />
          </mesh>
          <mesh position={[0, 0.072, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.155, 0.01, 8, 32]} />
            <meshStandardMaterial color={OBI_DARK} />
          </mesh>
          <mesh position={[0, -0.072, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.155, 0.01, 8, 32]} />
            <meshStandardMaterial color={OBI_DARK} />
          </mesh>
          <mesh position={[0, 0.02, -0.18]}>
            <boxGeometry args={[0.16, 0.18, 0.1]} />
            <meshStandardMaterial color={OBI_KNOT} />
          </mesh>
          <mesh position={[-0.1, 0.04, -0.2]} rotation={[0, 0.4, 0.2]}>
            <boxGeometry args={[0.09, 0.14, 0.04]} />
            <meshStandardMaterial color={OBI} />
          </mesh>
          <mesh position={[0.1, 0.04, -0.2]} rotation={[0, -0.4, -0.2]}>
            <boxGeometry args={[0.09, 0.14, 0.04]} />
            <meshStandardMaterial color={OBI} />
          </mesh>
          <mesh position={[-0.04, 0.34, 0.11]} rotation={[0.55, 0.55, 0]}>
            <boxGeometry args={[0.055, 0.16, 0.012]} />
            <meshStandardMaterial color={LINING} />
          </mesh>
          <mesh position={[0.04, 0.34, 0.11]} rotation={[0.55, -0.55, 0]}>
            <boxGeometry args={[0.055, 0.16, 0.012]} />
            <meshStandardMaterial color={LINING} />
          </mesh>
          <mesh position={[-0.035, 0.335, 0.122]} rotation={[0.55, 0.5, 0]}>
            <boxGeometry args={[0.048, 0.15, 0.012]} />
            <meshStandardMaterial color={YUKATA_DARK} />
          </mesh>
          <mesh position={[0.04, 0.33, 0.118]} rotation={[0.55, -0.62, 0]}>
            <boxGeometry args={[0.048, 0.14, 0.012]} />
            <meshStandardMaterial color={YUKATA} />
          </mesh>
          <group ref={lArm} position={[-0.17, 0.32, 0.02]}>
            <mesh>
              <sphereGeometry args={[0.048, 16, 12]} />
              <meshStandardMaterial color={YUKATA} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.14, 0.02]} rotation={[0.1, 0, 0.08]}>
              <cylinderGeometry args={[0.072, 0.085, 0.28, 24]} />
              <meshStandardMaterial color={YUKATA} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.28, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.085, 0.012, 8, 20]} />
              <meshStandardMaterial color={LINING} />
            </mesh>
            <mesh position={[0, -0.3, 0.04]} rotation={[0.12, 0, 0]}>
              <capsuleGeometry args={[0.03, 0.14, 6, 12]} />
              <meshStandardMaterial color={SKIN} roughness={0.48} />
            </mesh>
            <group position={[0, -0.38, 0.05]}>
              <Hand side={-1} />
            </group>
          </group>
          <group ref={rArm} position={[0.17, 0.32, 0.02]}>
            <mesh>
              <sphereGeometry args={[0.048, 16, 12]} />
              <meshStandardMaterial color={YUKATA} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.14, 0.02]} rotation={[0.1, 0, -0.08]}>
              <cylinderGeometry args={[0.072, 0.085, 0.28, 24]} />
              <meshStandardMaterial color={YUKATA} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.28, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.085, 0.012, 8, 20]} />
              <meshStandardMaterial color={LINING} />
            </mesh>
            <mesh position={[0, -0.3, 0.04]} rotation={[0.12, 0, 0]}>
              <capsuleGeometry args={[0.03, 0.14, 6, 12]} />
              <meshStandardMaterial color={SKIN} roughness={0.48} />
            </mesh>
            <group position={[0, -0.38, 0.05]}>
              <Hand side={1} />
            </group>
          </group>
        </group>
        <mesh position={[0, 1.3, 0.025]}>
          <cylinderGeometry args={[0.036, 0.042, 0.1, 20]} />
          <meshStandardMaterial color={SKIN} roughness={0.48} />
        </mesh>
        <group ref={head} position={[0, 1.428, 0.03]}>
          <mesh scale={[0.88, 1.02, 0.9]}>
            <sphereGeometry args={[0.1, 48, 36]} />
            <meshStandardMaterial map={face} roughness={0.46} />
          </mesh>
          <mesh position={[-0.032, -0.055, 0.02]} scale={[0.85, 0.7, 0.8]}>
            <sphereGeometry args={[0.038, 16, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.48} />
          </mesh>
          <mesh position={[0.032, -0.055, 0.02]} scale={[0.85, 0.7, 0.8]}>
            <sphereGeometry args={[0.038, 16, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.48} />
          </mesh>
          <mesh position={[0, -0.088, 0.028]} scale={[0.85, 0.55, 0.75]}>
            <sphereGeometry args={[0.032, 16, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.48} />
          </mesh>
          <mesh position={[-0.048, -0.01, 0.055]} scale={[0.75, 0.65, 0.55]}>
            <sphereGeometry args={[0.036, 16, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.48} />
          </mesh>
          <mesh position={[0.048, -0.01, 0.055]} scale={[0.75, 0.65, 0.55]}>
            <sphereGeometry args={[0.036, 16, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.48} />
          </mesh>
          <mesh position={[-0.09, 0, -0.008]} rotation={[0, 0.35, -0.15]} scale={[0.38, 0.72, 0.5]}>
            <sphereGeometry args={[0.028, 16, 12]} />
            <meshStandardMaterial color={SKIN_EAR} roughness={0.5} />
          </mesh>
          <mesh position={[0.09, 0, -0.008]} rotation={[0, -0.35, 0.15]} scale={[0.38, 0.72, 0.5]}>
            <sphereGeometry args={[0.028, 16, 12]} />
            <meshStandardMaterial color={SKIN_EAR} roughness={0.5} />
          </mesh>
          {([-1, 1] as const).map((s) => (
            <group key={s}>
              <mesh position={[0.031 * s, 0.008, 0.078]} scale={[1.15, 1, 0.55]}>
                <sphereGeometry args={[0.0165, 16, 12]} />
                <meshStandardMaterial color={SCLERA} roughness={0.2} />
              </mesh>
              <mesh position={[0.031 * s, 0.007, 0.088]} scale={[1, 1.05, 0.45]}>
                <sphereGeometry args={[0.0105, 16, 12]} />
                <meshStandardMaterial color={IRIS_OUTER} roughness={0.25} />
              </mesh>
              <mesh position={[0.031 * s, 0.007, 0.093]}>
                <sphereGeometry args={[0.0048, 10, 8]} />
                <meshStandardMaterial color={PUPIL} />
              </mesh>
              <mesh position={[0.031 * s - 0.005, 0.013, 0.096]}>
                <sphereGeometry args={[0.0032, 8, 6]} />
                <meshStandardMaterial color="#fff" />
              </mesh>
              <mesh position={[0.031 * s, 0.018, 0.08]} scale={[1.2, 0.28, 0.6]}>
                <sphereGeometry args={[0.018, 12, 8]} />
                <meshStandardMaterial color={SKIN} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 0, 0.088]} rotation={[0.55, 0, 0]}>
            <capsuleGeometry args={[0.007, 0.026, 4, 10]} />
            <meshStandardMaterial color={SKIN} />
          </mesh>
          <mesh position={[0, -0.018, 0.095]} scale={[0.95, 0.8, 0.9]}>
            <sphereGeometry args={[0.011, 12, 10]} />
            <meshStandardMaterial color={SKIN} />
          </mesh>
          <mesh position={[0, -0.048, 0.086]} scale={[1.55, 0.32, 0.5]}>
            <sphereGeometry args={[0.012, 12, 8]} />
            <meshStandardMaterial color={LIP} />
          </mesh>
          <mesh position={[0, -0.058, 0.084]} scale={[1.4, 0.4, 0.55]}>
            <sphereGeometry args={[0.011, 12, 8]} />
            <meshStandardMaterial color={LIP_DEEP} />
          </mesh>
          <mesh position={[0, 0.04, -0.01]} scale={[0.96, 0.7, 0.94]}>
            <sphereGeometry args={[0.108, 32, 24]} />
            <meshStandardMaterial color={HAIR} roughness={0.28} />
          </mesh>
          <group ref={hair} position={[0, 0.06, -0.02]}>
            {BANGS.map((s, i) => (
              <HairLock key={`b${i}`} s={s} />
            ))}
            {SIDES.map((s, i) => (
              <HairLock key={`s${i}`} s={s} />
            ))}
            {BACK.map((s, i) => (
              <HairLock key={`k${i}`} s={s} />
            ))}
          </group>
          <mesh position={[-0.07, 0.08, 0.06]}>
            <sphereGeometry args={[0.016, 12, 10]} />
            <meshStandardMaterial color="#ffb7c9" emissive="#ff8aaa" emissiveIntensity={0.55} />
          </mesh>
          <mesh position={[-0.055, 0.09, 0.07]}>
            <sphereGeometry args={[0.011, 10, 8]} />
            <meshStandardMaterial color="#ffe0ea" />
          </mesh>
          <mesh position={[-0.08, 0.07, 0.05]}>
            <sphereGeometry args={[0.008, 8, 6]} />
            <meshStandardMaterial color={GOLD} metalness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
