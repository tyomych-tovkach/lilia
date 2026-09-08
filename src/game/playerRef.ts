import * as THREE from 'three'
import { SPAWN } from './layout'

export const playerPos = new THREE.Vector3(SPAWN[0], SPAWN[1], SPAWN[2])
export const playerYaw = { current: Math.PI }
