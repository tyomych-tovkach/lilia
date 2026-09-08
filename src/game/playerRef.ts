import * as THREE from 'three'
import type { LocationId } from '../content/types'

export const playerPos = new THREE.Vector3(0, 1, 5)
export const playerYaw = { current: Math.PI }
export const talkLock = { current: false }
export const groundedRef = { current: true }
export const vyRef = { current: 0 }

export const PLACE: Record<LocationId, { half: number; spawn: [number, number, number] }> = {
  hub: { half: 9.2, spawn: [0, 0.05, 6.4] },
  letter: { half: 7.4, spawn: [0, 0.05, 5.2] },
  japan: { half: 7.2, spawn: [0, 0.05, 5] },
  sport: { half: 7.4, spawn: [0, 0.05, 5.2] },
  secret: { half: 7, spawn: [0, 0.05, 4.8] },
  yesno: { half: 7.2, spawn: [0, 0.05, 5] },
  date: { half: 7.2, spawn: [0, 0.05, 5] },
  send: { half: 6.8, spawn: [0, 0.05, 4.6] },
  kubgu: { half: 8, spawn: [0, 0.05, 6] },
  vkusno: { half: 7.6, spawn: [0, 0.05, 5.4] },
}
