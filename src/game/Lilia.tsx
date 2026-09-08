import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const SKIN = '#f4c4b0'
const HAIR = '#1a0c0a'
const HAIR_LIT = '#3a2018'
const YUKATA = '#d42a62'
const YUKATA_DARK = '#8a143c'
const LINING = '#f7e6d8'
const OBI = '#e8c96a'

function makeFaceTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, 512, 512)
  ctx.fillStyle = SKIN
  ctx.beginPath()
  ctx.ellipse(256, 270, 200, 230, 0, 0, Math.PI * 2)
  ctx.fill()
  const blush = ctx.createRadialGradient(150, 330, 4, 150, 330, 70)
  blush.addColorStop(0, 'rgba(232, 110, 130, 0.5)')
  blush.addColorStop(1, 'rgba(232, 110, 130, 0)')
  ctx.fillStyle = blush
  ctx.beginPath()
  ctx.ellipse(150, 328, 72, 40, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(362, 328, 72, 40, 0, 0, Math.PI * 2)
  ctx.fill()
  const eye = (cx: number) => {
    ctx.fillStyle = '#1a1210'
    ctx.beginPath()
    ctx.ellipse(cx, 238, 58, 18, 0, Math.PI, 0)
    ctx.fill()
    ctx.fillStyle = '#fffdf8'
    ctx.beginPath()
    ctx.ellipse(cx, 258, 52, 38, 0, 0, Math.PI * 2)
    ctx.fill()
    const iris = ctx.createRadialGradient(cx, 262, 4, cx, 262, 28)
    iris.addColorStop(0, '#8a4a28')
    iris.addColorStop(0.5, '#5a2c18')
    iris.addColorStop(1, '#1a0c08')
    ctx.fillStyle = iris
    ctx.beginPath()
    ctx.ellipse(cx, 262, 26, 28, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#090604'
    ctx.beginPath()
    ctx.ellipse(cx, 264, 12, 14, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.ellipse(cx - 10, 250, 8, 10, -0.3, 0, Math.PI * 2)
    ctx.fill()
  }
  eye(168)
  eye(344)
  ctx.strokeStyle = '#2a1810'
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(110, 208)
  ctx.quadraticCurveTo(168, 188, 220, 202)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(402, 208)
  ctx.quadraticCurveTo(344, 188, 292, 202)
  ctx.stroke()
  ctx.fillStyle = '#d46a7a'
  ctx.beginPath()
  ctx.ellipse(256, 368, 22, 10, 0, 0, Math.PI * 2)
  ctx.fill()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
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
  const lArm = useRef<THREE.Group>(null)
  const rArm = useRef<THREE.Group>(null)
  const hair = useRef<THREE.Group>(null)
  const face = useMemo(() => makeFaceTexture(), [])
  const squash = useRef(1)
  const wasAir = useRef(false)

  useFrame((state, dt) => {
    if (!g.current || !deform.current) return
    const t = state.clock.elapsedTime
    const move = walking.current
    const air = !grounded.current
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
    const swing = move && !air ? Math.sin(t * 10.5) : 0
    g.current.position.y = move && !air ? Math.abs(Math.sin(t * 10.5)) * 0.045 : Math.sin(t * 2.4) * 0.012
    if (lLeg.current) lLeg.current.rotation.x = swing * 0.5
    if (rLeg.current) rLeg.current.rotation.x = -swing * 0.5
    if (lArm.current) lArm.current.rotation.x = -swing * 0.32
    if (rArm.current) rArm.current.rotation.x = swing * 0.32
    if (hair.current) hair.current.rotation.x = air ? 0.12 : move ? Math.sin(t * 10.5) * 0.08 : Math.sin(t * 1.4) * 0.03
  })

  return (
    <group ref={g} scale={1.05}>
      <group ref={deform}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[0.26, 16]} />
          <meshBasicMaterial color="#000" transparent opacity={0.28} />
        </mesh>
        <group ref={lLeg} position={[-0.09, 0.3, 0]}>
          <mesh position={[0, -0.1, 0]}>
            <capsuleGeometry args={[0.055, 0.24, 6, 10]} />
            <meshStandardMaterial color={SKIN} roughness={0.5} />
          </mesh>
          <mesh position={[0.02, -0.24, 0.05]} rotation={[0.25, 0, 0]}>
            <boxGeometry args={[0.1, 0.05, 0.18]} />
            <meshStandardMaterial color="#2a1810" />
          </mesh>
        </group>
        <group ref={rLeg} position={[0.09, 0.3, 0]}>
          <mesh position={[0, -0.1, 0]}>
            <capsuleGeometry args={[0.055, 0.24, 6, 10]} />
            <meshStandardMaterial color={SKIN} roughness={0.5} />
          </mesh>
          <mesh position={[-0.02, -0.24, 0.05]} rotation={[0.25, 0, 0]}>
            <boxGeometry args={[0.1, 0.05, 0.18]} />
            <meshStandardMaterial color="#2a1810" />
          </mesh>
        </group>
        <mesh position={[0, 0.44, 0.02]} scale={[1.2, 0.72, 0.98]}>
          <sphereGeometry args={[0.2, 20, 16]} />
          <meshStandardMaterial color={YUKATA} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.4, 0.02]}>
          <cylinderGeometry args={[0.23, 0.3, 0.48, 16]} />
          <meshStandardMaterial color={YUKATA} roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.66, 0.01]} scale={[0.78, 0.52, 0.7]}>
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshStandardMaterial color={YUKATA_DARK} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.84, 0.05]} scale={[1.08, 0.58, 0.74]}>
          <sphereGeometry args={[0.18, 18, 14]} />
          <meshStandardMaterial color={YUKATA} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.62, 0.02]}>
          <boxGeometry args={[0.34, 0.11, 0.28]} />
          <meshStandardMaterial color={OBI} roughness={0.3} metalness={0.16} />
        </mesh>
        <mesh position={[0, 0.64, -0.15]}>
          <boxGeometry args={[0.18, 0.2, 0.09]} />
          <meshStandardMaterial color="#8a5a18" />
        </mesh>
        <mesh position={[-0.05, 0.98, 0.1]} rotation={[0.4, 0.45, 0]}>
          <boxGeometry args={[0.13, 0.08, 0.03]} />
          <meshStandardMaterial color={LINING} />
        </mesh>
        <mesh position={[0.05, 0.98, 0.1]} rotation={[0.4, -0.45, 0]}>
          <boxGeometry args={[0.13, 0.08, 0.03]} />
          <meshStandardMaterial color={LINING} />
        </mesh>
        <group ref={lArm} position={[-0.22, 0.92, 0.02]}>
          <mesh rotation={[0.12, 0, 0.55]}>
            <capsuleGeometry args={[0.07, 0.28, 6, 10]} />
            <meshStandardMaterial color={YUKATA} roughness={0.42} />
          </mesh>
          <mesh position={[-0.14, -0.22, 0.04]} rotation={[0.12, 0, 0.55]}>
            <capsuleGeometry args={[0.038, 0.1, 4, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.48} />
          </mesh>
        </group>
        <group ref={rArm} position={[0.22, 0.92, 0.02]}>
          <mesh rotation={[0.12, 0, -0.55]}>
            <capsuleGeometry args={[0.07, 0.28, 6, 10]} />
            <meshStandardMaterial color={YUKATA} roughness={0.42} />
          </mesh>
          <mesh position={[0.14, -0.22, 0.04]} rotation={[0.12, 0, -0.55]}>
            <capsuleGeometry args={[0.038, 0.1, 4, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.48} />
          </mesh>
        </group>
        <mesh position={[0, 1.08, 0.01]}>
          <cylinderGeometry args={[0.04, 0.05, 0.1, 10]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
        <mesh position={[0, 1.28, 0.04]} scale={[0.95, 1.05, 0.88]}>
          <sphereGeometry args={[0.16, 28, 22]} />
          <meshStandardMaterial color={SKIN} roughness={0.45} />
        </mesh>
        <mesh position={[0, 1.27, 0.155]}>
          <planeGeometry args={[0.3, 0.34]} />
          <meshStandardMaterial map={face} transparent depthWrite={false} roughness={0.42} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.4, 0.02]} scale={[1.22, 0.72, 1.2]}>
          <sphereGeometry args={[0.18, 22, 16]} />
          <meshStandardMaterial color={HAIR} roughness={0.3} />
        </mesh>
        <mesh position={[-0.11, 1.32, 0.12]} rotation={[0.4, 0.4, 0.15]} scale={[0.55, 1, 0.32]}>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial color={HAIR} />
        </mesh>
        <mesh position={[0.11, 1.32, 0.12]} rotation={[0.4, -0.4, -0.15]} scale={[0.55, 1, 0.32]}>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial color={HAIR} />
        </mesh>
        <group ref={hair}>
          <mesh position={[0, 0.88, -0.13]} rotation={[0.2, 0, 0]}>
            <capsuleGeometry args={[0.12, 0.62, 8, 12]} />
            <meshStandardMaterial color={HAIR} roughness={0.28} />
          </mesh>
          <mesh position={[-0.11, 0.78, -0.1]} rotation={[0.25, 0.2, 0.12]}>
            <capsuleGeometry args={[0.08, 0.55, 6, 10]} />
            <meshStandardMaterial color={HAIR_LIT} />
          </mesh>
          <mesh position={[0.11, 0.78, -0.1]} rotation={[0.25, -0.2, -0.12]}>
            <capsuleGeometry args={[0.08, 0.55, 6, 10]} />
            <meshStandardMaterial color={HAIR} />
          </mesh>
        </group>
        <mesh position={[-0.11, 1.44, 0.08]}>
          <sphereGeometry args={[0.038, 12, 10]} />
          <meshStandardMaterial color="#ffb7c9" emissive="#ff8aaa" emissiveIntensity={0.55} />
        </mesh>
      </group>
    </group>
  )
}
