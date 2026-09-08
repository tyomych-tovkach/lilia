import { clampToTown, gateFloor, wishXZ } from './move.ts'

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

function near(a: number, b: number, eps = 1e-6) {
  assert(Math.abs(a - b) < eps, `expected ${b}, got ${a}`)
}

{
  const w = wishXZ(0, -1, 0, 1)
  near(w.x, 0)
  near(w.z, -1)
}
{
  const s = wishXZ(0, -1, 0, -1)
  near(s.x, 0)
  near(s.z, 1)
}
{
  const d = wishXZ(0, -1, 1, 0)
  near(d.x, 1)
  near(d.z, 0)
}
{
  const a = wishXZ(0, -1, -1, 0)
  near(a.x, -1)
  near(a.z, 0)
}
{
  const w = wishXZ(1, 0, 0, 1)
  near(w.x, 1)
  near(w.z, 0)
}
{
  const d = wishXZ(1, 0, 1, 0)
  near(d.x, 0)
  near(d.z, 1)
}

{
  const p = clampToTown(9, -40, 2.6, -23, 20, 11.8)
  near(p.x, 2.6)
  near(p.z, 11.8)
}
{
  const p = clampToTown(0, 5, 2.6, -23, 20, -15.6)
  near(p.z, 5)
}

{
  const gates = { toArcade: 11.4, toMatch: 0.8, toPortals: -7.6, toMail: -16 }
  near(gateFloor(0, gates, -23), 11.8)
  near(gateFloor(1, gates, -23), 1.2)
  near(gateFloor(2, gates, -23), -7.2)
  near(gateFloor(3, gates, -23), -15.6)
  near(gateFloor(4, gates, -23), -23)
}

console.log('move mechanics: ok')
