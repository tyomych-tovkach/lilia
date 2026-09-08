import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { consumeInteract } from './input'
import { playerPos } from './playerRef'

type Rec = {
  id: string
  position: THREE.Vector3
  radius: number
  enabled: boolean
  color: string
  onInteract: () => void
}

const registry = new Map<string, Rec>()

export function Interactable({
  id,
  position,
  radius = 1.75,
  enabled = true,
  color = '#2de2ff',
  onInteract,
  children,
}: {
  id: string
  position: [number, number, number]
  radius?: number
  enabled?: boolean
  color?: string
  onInteract: () => void
  children: ReactNode
}) {
  const rec = useRef<Rec>({
    id,
    position: new THREE.Vector3(...position),
    radius,
    enabled,
    color,
    onInteract,
  })
  rec.current.position.set(...position)
  rec.current.radius = radius
  rec.current.enabled = enabled
  rec.current.color = color
  rec.current.onInteract = onInteract

  const [hot, setHot] = useState(false)
  const extra = rec.current as Rec & { setHot: (v: boolean) => void }
  extra.setHot = setHot

  useEffect(() => {
    registry.set(id, extra)
    return () => {
      registry.delete(id)
    }
  }, [id, extra])

  return (
    <group position={position}>
      <group
        onClick={(e) => {
          e.stopPropagation()
          if (enabled && playerPos.distanceTo(rec.current.position) < radius + 0.5) onInteract()
        }}
      >
        {children}
      </group>
      {enabled && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[0.52, hot ? 0.82 : 0.64, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hot ? 0.7 : 0.14}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
      {hot && enabled && (
        <Text
          position={[0, 1.55, 0]}
          fontSize={0.2}
          color={color}
          anchorX="center"
          outlineWidth={0.015}
          outlineColor="#050414"
          overflowWrap="break-word"
          maxWidth={0.8}
        >
          E
        </Text>
      )}
    </group>
  )
}

export function InteractionDriver() {
  const prev = useRef<string | null>(null)
  useFrame(() => {
    let best: (Rec & { setHot?: (v: boolean) => void }) | null = null
    let bestD = Infinity
    for (const rec of registry.values()) {
      if (!rec.enabled) continue
      const d = playerPos.distanceTo(rec.position)
      if (d < rec.radius && d < bestD) {
        best = rec
        bestD = d
      }
    }
    const id = best?.id ?? null
    if (id !== prev.current) {
      for (const rec of registry.values()) {
        ;(rec as Rec & { setHot?: (v: boolean) => void }).setHot?.(rec.id === id)
      }
      prev.current = id
    }
    const pressed = consumeInteract()
    if (pressed && best) best.onInteract()
  })
  return null
}
