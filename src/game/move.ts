/** Camera-look third-person wish on XZ. inputZ+ is W, inputX+ is D. */
export function wishXZ(
  camDirX: number,
  camDirZ: number,
  inputX: number,
  inputZ: number,
): { x: number; z: number } {
  let fx = camDirX
  let fz = camDirZ
  const fl = Math.hypot(fx, fz)
  if (fl < 1e-6) {
    fx = 0
    fz = -1
  } else {
    fx /= fl
    fz /= fl
  }
  const rx = -fz
  const rz = fx
  let x = fx * inputZ + rx * inputX
  let z = fz * inputZ + rz * inputX
  const len = Math.hypot(x, z)
  if (len > 1) {
    x /= len
    z /= len
  }
  return { x, z }
}

export function clampToTown(
  x: number,
  z: number,
  xLimit: number,
  zMin: number,
  zMax: number,
  zFloor: number,
): { x: number; z: number } {
  return {
    x: Math.min(xLimit, Math.max(-xLimit, x)),
    z: Math.min(zMax, Math.max(Math.max(zMin, zFloor), z)),
  }
}

export function gateFloor(openDistrict: number, gates: { toArcade: number; toMatch: number; toPortals: number; toMail: number }, worldZMin: number): number {
  if (openDistrict >= 4) return worldZMin
  if (openDistrict >= 3) return gates.toMail + 0.4
  if (openDistrict >= 2) return gates.toPortals + 0.4
  if (openDistrict >= 1) return gates.toMatch + 0.4
  return gates.toArcade + 0.4
}
