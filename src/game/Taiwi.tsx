import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { copy, TAIWI_NAME } from '../content/evening'
import type { LocationId } from '../content/types'
import { RuSign } from './Craft'
import { Interactable } from './Interactable'
import { playerPos } from './playerRef'
import { emitTalk } from './talkBus'
import { useInvite } from '../state'

const BODY = '#f0e6cf'
const BODY_SHADE = '#d4c4a4'
const BELLY = '#fff6ea'
const TEAL = '#2f8f88'
const TEAL_DEEP = '#1a5c58'
const MEMBRANE = '#5eb8b0'
const GOLD = '#d4b06a'
const GOLD_LIT = '#f0d48a'
const EYE_WHITE = '#fffdf6'
const IRIS = '#163e3c'
const PUPIL = '#071212'
const GLOW = '#b8efe6'

function Wing({ side }: { side: 1 | -1 }) {
  return (
    <>
      <mesh position={[0.07 * side, 0, 0]} rotation={[0, 0, (Math.PI / 2) * side]}>
        <cylinderGeometry args={[0.012, 0.009, 0.15, 8]} />
        <meshStandardMaterial color={TEAL} roughness={0.4} metalness={0.08} />
      </mesh>
      <mesh position={[0.16 * side, 0.02, -0.04]} rotation={[0.2, 0.4 * side, -0.1 * side]}>
        <cylinderGeometry args={[0.009, 0.006, 0.12, 8]} />
        <meshStandardMaterial color={TEAL} roughness={0.4} />
      </mesh>
      <mesh position={[0.14 * side, -0.03, -0.02]} rotation={[0.5, 0.15 * side, 0.2 * side]}>
        <cylinderGeometry args={[0.008, 0.005, 0.1, 8]} />
        <meshStandardMaterial color={TEAL} roughness={0.4} />
      </mesh>
      <mesh position={[0.12 * side, -0.02, -0.01]} rotation={[0.35, 0.25 * side, -0.4 * side]}>
        <planeGeometry args={[0.18, 0.14, 4, 3]} />
        <meshStandardMaterial
          color={MEMBRANE}
          roughness={0.22}
          transparent
          opacity={0.34}
          emissive="#4aa8a0"
          emissiveIntensity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0.1 * side, -0.05, 0.01]} rotation={[0.7, 0.1 * side, -0.2 * side]}>
        <planeGeometry args={[0.14, 0.11, 3, 3]} />
        <meshStandardMaterial
          color={MEMBRANE}
          roughness={0.22}
          transparent
          opacity={0.34}
          emissive="#4aa8a0"
          emissiveIntensity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

export function Taiwi({ loc, position }: { loc: LocationId; position: [number, number, number] }) {
  const { state } = useInvite()
  const root = useRef<THREE.Group>(null)
  const hover = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const lWing = useRef<THREE.Group>(null)
  const rWing = useRef<THREE.Group>(null)
  const tail0 = useRef<THREE.Group>(null)
  const tail1 = useRef<THREE.Group>(null)
  const tail2 = useRef<THREE.Group>(null)
  const tail3 = useRef<THREE.Group>(null)
  const tail4 = useRef<THREE.Group>(null)
  const blob = useRef<THREE.Mesh>(null)
  const locked = loc === 'yesno' && state.crashStage >= 3 && !state.saidYes
  const lean = loc === 'yesno' && state.crashStage >= 1 && !state.saidYes

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime
    if (hover.current) {
      hover.current.position.y = 0.92 + Math.sin(t * 1.75) * 0.048
      hover.current.rotation.z = (lean ? -0.12 : 0) + Math.sin(t * 1.15) * 0.045
      hover.current.rotation.x = (lean ? 0.06 : 0) + Math.sin(t * 0.92) * 0.028
    }
    const flap = Math.sin(t * 4.35)
    if (lWing.current) {
      lWing.current.rotation.z = 0.55 + flap * 0.48
      lWing.current.rotation.y = 0.15 + flap * 0.1
      lWing.current.rotation.x = Math.sin(t * 4.35 + 0.4) * 0.08
    }
    if (rWing.current) {
      rWing.current.rotation.z = -0.55 - flap * 0.48
      rWing.current.rotation.y = -0.15 - flap * 0.1
      rWing.current.rotation.x = Math.sin(t * 4.35 + 0.4) * 0.08
    }
    if (tail0.current) {
      tail0.current.rotation.y = Math.sin(t * 1.85) * 0.38
      tail0.current.rotation.x = 0.35 + Math.sin(t * 1.4) * 0.14
    }
    if (tail1.current) {
      tail1.current.rotation.y = Math.sin(t * 1.85 + 0.55) * 0.42
      tail1.current.rotation.x = Math.sin(t * 1.4 + 0.4) * 0.12
    }
    if (tail2.current) tail2.current.rotation.y = Math.sin(t * 1.85 + 1.1) * 0.5
    if (tail3.current) tail3.current.rotation.y = Math.sin(t * 1.85 + 1.65) * 0.55
    if (tail4.current) tail4.current.rotation.y = Math.sin(t * 1.85 + 2.2) * 0.4
    if (root.current) {
      const dx = playerPos.x - position[0]
      const dz = playerPos.z - position[2]
      const target = Math.atan2(dx, dz)
      let d = target - root.current.rotation.y
      while (d > Math.PI) d -= Math.PI * 2
      while (d < -Math.PI) d += Math.PI * 2
      root.current.rotation.y += d * Math.min(1, dt * 3)
      if (head.current) {
        head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, THREE.MathUtils.clamp(d, -0.18, 0.18), 4, dt)
        head.current.rotation.x = Math.sin(t * 2.1) * 0.04
      }
    }
    if (blob.current) {
      const s = 1 + Math.sin(t * 1.75) * 0.08
      blob.current.scale.set(s, 1, s)
    }
  })

  return (
    <Interactable
      id={`taiwi-${loc}`}
      position={position}
      radius={1.6}
      enabled={!locked}
      color="#7ec8c4"
      prompt={copy.talkPrompt}
      onInteract={() => emitTalk(loc)}
    >
      <group ref={root}>
        <mesh ref={blob} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[0.22, 20]} />
          <meshBasicMaterial color="#000" transparent opacity={0.2} />
        </mesh>
        <RuSign text={TAIWI_NAME} position={[0, 1.48, 0]} size={0.11} color="#e8d5a0" />
        <group ref={hover}>
          <pointLight color="#a8e8dc" intensity={0.32} distance={1.9} position={[0, 0.02, 0.04]} />
          <mesh scale={[1.26, 1, 1.14]}>
            <sphereGeometry args={[0.2, 32, 24]} />
            <meshStandardMaterial color={BODY} roughness={0.38} transparent opacity={0.92} emissive="#c8e8e0" emissiveIntensity={0.14} />
          </mesh>
          <mesh position={[0, -0.05, 0.09]} scale={[0.78, 0.58, 0.5]}>
            <sphereGeometry args={[0.18, 24, 18]} />
            <meshStandardMaterial color={BELLY} roughness={0.28} transparent opacity={0.96} emissive="#e8f6f0" emissiveIntensity={0.1} />
          </mesh>
          <mesh position={[0, 0.06, -0.08]} scale={[0.72, 0.42, 0.55]}>
            <sphereGeometry args={[0.16, 20, 16]} />
            <meshStandardMaterial color={BODY_SHADE} roughness={0.45} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0.01, 0.03]}>
            <sphereGeometry args={[0.09, 16, 12]} />
            <meshStandardMaterial color={GLOW} roughness={0.15} transparent opacity={0.42} emissive="#9ee8de" emissiveIntensity={0.9} depthWrite={false} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[0, 0.16 - i * 0.02, -0.04 - i * 0.035]} rotation={[-0.35 - i * 0.12, 0, 0]}>
              <coneGeometry args={[0.016 - i * 0.002, 0.055 - i * 0.006, 10]} />
              <meshStandardMaterial color={GOLD} roughness={0.25} metalness={0.42} emissive="#c4a050" emissiveIntensity={0.22} />
            </mesh>
          ))}
          <group ref={head} position={[0, 0.15, 0.12]}>
            <mesh scale={[1.05, 0.92, 1]}>
              <sphereGeometry args={[0.135, 28, 22]} />
              <meshStandardMaterial color={BODY} roughness={0.38} transparent opacity={0.92} emissive="#c8e8e0" emissiveIntensity={0.14} />
            </mesh>
            <mesh position={[-0.08, -0.02, 0.06]} scale={[1, 0.85, 0.9]}>
              <sphereGeometry args={[0.055, 16, 12]} />
              <meshStandardMaterial color={BODY} roughness={0.38} transparent opacity={0.92} />
            </mesh>
            <mesh position={[0.08, -0.02, 0.06]} scale={[1, 0.85, 0.9]}>
              <sphereGeometry args={[0.055, 16, 12]} />
              <meshStandardMaterial color={BODY} roughness={0.38} transparent opacity={0.92} />
            </mesh>
            <mesh position={[0, -0.02, 0.12]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.85]}>
              <coneGeometry args={[0.062, 0.11, 16]} />
              <meshStandardMaterial color={BODY} roughness={0.38} transparent opacity={0.92} />
            </mesh>
            <mesh position={[0, -0.01, 0.175]} scale={[1.15, 0.75, 1]}>
              <sphereGeometry args={[0.042, 16, 12]} />
              <meshStandardMaterial color={BELLY} roughness={0.28} />
            </mesh>
            {([-1, 1] as const).map((s) => (
              <group key={s}>
                <mesh position={[0.048 * s, 0.028, 0.118]}>
                  <sphereGeometry args={[0.032, 16, 12]} />
                  <meshStandardMaterial color={EYE_WHITE} roughness={0.18} />
                </mesh>
                <mesh position={[0.048 * s, 0.026, 0.14]}>
                  <sphereGeometry args={[0.018, 14, 12]} />
                  <meshStandardMaterial color={IRIS} roughness={0.22} emissive="#2a8a82" emissiveIntensity={0.45} />
                </mesh>
                <mesh position={[0.048 * s, 0.026, 0.152]}>
                  <sphereGeometry args={[0.008, 10, 8]} />
                  <meshStandardMaterial color={PUPIL} />
                </mesh>
                <mesh position={[0.048 * s - 0.008, 0.036, 0.148]}>
                  <sphereGeometry args={[0.006, 8, 8]} />
                  <meshStandardMaterial color="#fff" />
                </mesh>
                <mesh position={[0.048 * s, 0.055, 0.1]} rotation={[0.2, 0.3 * s, 0.15 * s]} scale={[1.4, 0.35, 0.7]}>
                  <sphereGeometry args={[0.032, 12, 8]} />
                  <meshStandardMaterial color={TEAL} />
                </mesh>
                <group position={[0.055 * s, 0.1, -0.02]} rotation={[0.18, 0, -0.38 * s]}>
                  <mesh position={[0, 0.04, 0]}>
                    <coneGeometry args={[0.022, 0.08, 12]} />
                    <meshStandardMaterial color={GOLD} roughness={0.25} metalness={0.42} emissive="#c4a050" emissiveIntensity={0.22} />
                  </mesh>
                  <mesh position={[0, 0.1, -0.012]} rotation={[-0.35, 0, 0]}>
                    <coneGeometry args={[0.01, 0.07, 10]} />
                    <meshStandardMaterial color={GOLD_LIT} roughness={0.25} metalness={0.42} />
                  </mesh>
                </group>
                <mesh position={[0.07 * s, -0.01, 0.14]} rotation={[0.4, 0.7 * s, 0]}>
                  <cylinderGeometry args={[0.004, 0.004, 0.16, 6]} />
                  <meshStandardMaterial color={TEAL_DEEP} />
                </mesh>
                <mesh position={[0.14 * s, -0.05, 0.22]}>
                  <sphereGeometry args={[0.012, 10, 8]} />
                  <meshStandardMaterial color={GOLD} metalness={0.42} />
                </mesh>
                <mesh position={[0.12 * s, 0.06, 0]} rotation={[0, 0, 0.85 * s]} scale={[0.35, 1, 0.7]}>
                  <coneGeometry args={[0.05, 0.09, 10]} />
                  <meshStandardMaterial color={TEAL} />
                </mesh>
              </group>
            ))}
          </group>
          <group ref={lWing} position={[-0.18, 0.06, -0.02]} rotation={[0, 0.15, 0.55]}>
            <Wing side={-1} />
          </group>
          <group ref={rWing} position={[0.18, 0.06, -0.02]} rotation={[0, -0.15, -0.55]}>
            <Wing side={1} />
          </group>
          <group ref={tail0} position={[0, -0.04, -0.16]}>
            <mesh scale={[1.2, 0.85, 1.3]}>
              <sphereGeometry args={[0.055, 16, 12]} />
              <meshStandardMaterial color={BODY} roughness={0.38} transparent opacity={0.92} />
            </mesh>
            <group ref={tail1} position={[0, 0, -0.11]}>
              <mesh>
                <sphereGeometry args={[0.046, 14, 12]} />
                <meshStandardMaterial color={BODY} roughness={0.38} transparent opacity={0.92} />
              </mesh>
              <group ref={tail2} position={[0, 0, -0.1]}>
                <mesh>
                  <sphereGeometry args={[0.038, 14, 12]} />
                  <meshStandardMaterial color={BODY_SHADE} roughness={0.45} transparent opacity={0.9} />
                </mesh>
                <group ref={tail3} position={[0, 0, -0.09]}>
                  <mesh>
                    <sphereGeometry args={[0.028, 12, 10]} />
                    <meshStandardMaterial color={TEAL} />
                  </mesh>
                  <group ref={tail4} position={[0, 0, -0.08]}>
                    <mesh>
                      <sphereGeometry args={[0.02, 12, 10]} />
                      <meshStandardMaterial color={TEAL_DEEP} />
                    </mesh>
                    <mesh position={[0, 0, -0.05]}>
                      <sphereGeometry args={[0.024, 12, 10]} />
                      <meshStandardMaterial color={GOLD_LIT} emissive={GOLD} emissiveIntensity={0.35} />
                    </mesh>
                    <mesh position={[0, 0, -0.07]} rotation={[Math.PI, 0, 0]}>
                      <coneGeometry args={[0.016, 0.06, 10]} />
                      <meshStandardMaterial color={MEMBRANE} transparent opacity={0.45} depthWrite={false} />
                    </mesh>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </Interactable>
  )
}
