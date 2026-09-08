import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const SKIN = '#f4c4b0'
const HAIR = '#1a0c0a'
const HAIR_LIT = '#3a2018'
const YUKATA = '#c41d52'
const YUKATA_DARK = '#8a1438'
const LINING = '#f7e6d8'
const OBI = '#e0c56a'

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
  blush.addColorStop(0, 'rgba(232, 110, 130, 0.45)')
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
    iris.addColorStop(0.45, '#5a2c18')
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
    ctx.beginPath()
    ctx.ellipse(cx + 12, 270, 4, 5, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#1a0c0a'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx - 50, 252)
    ctx.quadraticCurveTo(cx, 218, cx + 50, 252)
    ctx.stroke()

    ctx.lineWidth = 3.5
    for (let i = 0; i < 5; i++) {
      const a = -0.9 + i * 0.35
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(a) * 48, 248 + Math.sin(a) * 10)
      ctx.lineTo(cx + Math.cos(a) * 58, 236 + Math.sin(a) * 16)
      ctx.stroke()
    }
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

  ctx.strokeStyle = 'rgba(90, 50, 40, 0.45)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(250, 300)
  ctx.quadraticCurveTo(256, 318, 262, 332)
  ctx.stroke()

  ctx.fillStyle = '#d46a7a'
  ctx.beginPath()
  ctx.ellipse(256, 368, 22, 10, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff0f2'
  ctx.beginPath()
  ctx.ellipse(256, 364, 10, 3.5, 0, 0, Math.PI * 2)
  ctx.fill()

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export function Lilia({ walking }: { walking: { current: boolean } }) {
  const g = useRef<THREE.Group>(null)
  const lLeg = useRef<THREE.Group>(null)
  const rLeg = useRef<THREE.Group>(null)
  const lArm = useRef<THREE.Group>(null)
  const rArm = useRef<THREE.Group>(null)
  const hair = useRef<THREE.Group>(null)
  const face = useMemo(() => makeFaceTexture(), [])

  useFrame((state) => {
    if (!g.current) return
    const t = state.clock.elapsedTime
    const move = walking.current
    const swing = move ? Math.sin(t * 10.5) : 0
    g.current.position.y = move ? Math.abs(Math.sin(t * 10.5)) * 0.045 : Math.sin(t * 1.7) * 0.01
    g.current.rotation.y = move ? 0 : Math.sin(t * 0.6) * 0.04
    if (lLeg.current) lLeg.current.rotation.x = swing * 0.45
    if (rLeg.current) rLeg.current.rotation.x = -swing * 0.45
    if (lArm.current) lArm.current.rotation.x = -swing * 0.35
    if (rArm.current) rArm.current.rotation.x = swing * 0.35
    if (hair.current) hair.current.rotation.x = move ? Math.sin(t * 10.5) * 0.06 : Math.sin(t * 1.4) * 0.02
  })

  return (
    <group ref={g} scale={1.12}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.28, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.3} />
      </mesh>

      <group ref={lLeg} position={[-0.09, 0.28, 0]}>
        <mesh position={[0, -0.08, 0]}>
          <capsuleGeometry args={[0.055, 0.22, 4, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
        <mesh position={[0.02, -0.22, 0.04]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.1, 0.05, 0.18]} />
          <meshStandardMaterial color="#2a1810" />
        </mesh>
      </group>
      <group ref={rLeg} position={[0.09, 0.28, 0]}>
        <mesh position={[0, -0.08, 0]}>
          <capsuleGeometry args={[0.055, 0.22, 4, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
        <mesh position={[-0.02, -0.22, 0.04]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.1, 0.05, 0.18]} />
          <meshStandardMaterial color="#2a1810" />
        </mesh>
      </group>

      <mesh position={[0, 0.42, 0.02]} scale={[1.15, 0.7, 0.95]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial color={YUKATA} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.38, 0.02]}>
        <cylinderGeometry args={[0.22, 0.28, 0.42, 12]} />
        <meshStandardMaterial color={YUKATA} roughness={0.44} />
      </mesh>
      <mesh position={[0, 0.62, 0.01]} scale={[0.78, 0.55, 0.7]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial color={YUKATA_DARK} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.78, 0.04]} scale={[1.05, 0.55, 0.72]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshStandardMaterial color={YUKATA} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.58, 0.02]}>
        <boxGeometry args={[0.32, 0.1, 0.26]} />
        <meshStandardMaterial color={OBI} roughness={0.32} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.6, -0.14]}>
        <boxGeometry args={[0.16, 0.18, 0.08]} />
        <meshStandardMaterial color="#8a5a18" />
      </mesh>
      <mesh position={[-0.05, 0.92, 0.08]} rotation={[0.35, 0.4, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.03]} />
        <meshStandardMaterial color={LINING} />
      </mesh>
      <mesh position={[0.05, 0.92, 0.08]} rotation={[0.35, -0.4, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.03]} />
        <meshStandardMaterial color={LINING} />
      </mesh>

      <group ref={lArm} position={[-0.2, 0.86, 0.02]}>
        <mesh rotation={[0.15, 0, 0.55]}>
          <capsuleGeometry args={[0.042, 0.34, 4, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.5} />
        </mesh>
      </group>
      <group ref={rArm} position={[0.2, 0.86, 0.02]}>
        <mesh rotation={[0.15, 0, -0.55]}>
          <capsuleGeometry args={[0.042, 0.34, 4, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.5} />
        </mesh>
      </group>

      <mesh position={[0, 1.02, 0.01]}>
        <cylinderGeometry args={[0.042, 0.05, 0.1, 8]} />
        <meshStandardMaterial color={SKIN} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.2, 0.03]} scale={[0.92, 1.02, 0.86]}>
        <sphereGeometry args={[0.155, 24, 18]} />
        <meshStandardMaterial color={SKIN} roughness={0.48} />
      </mesh>
      <mesh position={[0, 1.18, 0.155]}>
        <planeGeometry args={[0.26, 0.3]} />
        <meshStandardMaterial map={face} transparent depthWrite={false} roughness={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.13, 1.2, 0.02]} rotation={[0, 0, 0.3]} scale={[0.45, 0.7, 0.5]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={SKIN} />
      </mesh>
      <mesh position={[0.13, 1.2, 0.02]} rotation={[0, 0, -0.3]} scale={[0.45, 0.7, 0.5]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={SKIN} />
      </mesh>

      <mesh position={[0, 1.3, 0]} scale={[1.2, 0.72, 1.18]}>
        <sphereGeometry args={[0.175, 20, 14]} />
        <meshStandardMaterial color={HAIR} roughness={0.32} />
      </mesh>
      <mesh position={[0, 1.32, 0.1]} scale={[1.05, 0.4, 0.5]}>
        <sphereGeometry args={[0.16, 12, 10]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>
      <mesh position={[-0.1, 1.24, 0.12]} rotation={[0.35, 0.35, 0.15]} scale={[0.55, 0.95, 0.32]}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>
      <mesh position={[0.1, 1.24, 0.12]} rotation={[0.35, -0.35, -0.15]} scale={[0.55, 0.95, 0.32]}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>

      <group ref={hair}>
        <mesh position={[0, 0.82, -0.12]} rotation={[0.18, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.55, 6, 10]} />
          <meshStandardMaterial color={HAIR} roughness={0.3} />
        </mesh>
        <mesh position={[-0.1, 0.72, -0.1]} rotation={[0.22, 0.18, 0.12]}>
          <capsuleGeometry args={[0.08, 0.52, 4, 8]} />
          <meshStandardMaterial color={HAIR_LIT} roughness={0.32} />
        </mesh>
        <mesh position={[0.1, 0.72, -0.1]} rotation={[0.22, -0.18, -0.12]}>
          <capsuleGeometry args={[0.08, 0.52, 4, 8]} />
          <meshStandardMaterial color={HAIR} roughness={0.32} />
        </mesh>
        <mesh position={[-0.16, 0.95, 0.02]} rotation={[0.1, 0.2, 0.55]}>
          <capsuleGeometry args={[0.05, 0.28, 4, 8]} />
          <meshStandardMaterial color={HAIR} />
        </mesh>
        <mesh position={[0.16, 0.95, 0.02]} rotation={[0.1, -0.2, -0.55]}>
          <capsuleGeometry args={[0.05, 0.28, 4, 8]} />
          <meshStandardMaterial color={HAIR} />
        </mesh>
      </group>

      <mesh position={[-0.1, 1.34, 0.06]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial color="#ffb7c9" emissive="#ff8aaa" emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[-0.1, 1.34, 0.06]} rotation={[0.4, 0.2, 0.3]} scale={[1.4, 0.35, 0.7]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#f4e0ea" />
      </mesh>
    </group>
  )
}
