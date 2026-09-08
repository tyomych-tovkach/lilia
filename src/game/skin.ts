import * as THREE from 'three'

export type SkinKind = 'wood' | 'plaster' | 'cloth' | 'tatami' | 'paper' | 'tile' | 'stone' | 'grass' | 'carpet' | 'lacquer'

const cache = new Map<string, THREE.CanvasTexture>()

function clamp(n: number) {
  return n < 0 ? 0 : n > 255 ? 255 : n
}

function rgb(hex: string) {
  const c = new THREE.Color(hex)
  return [c.r * 255, c.g * 255, c.b * 255] as const
}

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function put(data: Uint8ClampedArray, i: number, r: number, g: number, b: number, a = 255) {
  const p = i * 4
  data[p] = clamp(r)
  data[p + 1] = clamp(g)
  data[p + 2] = clamp(b)
  data[p + 3] = a
}

function paint(kind: SkinKind, hex: string, size = 128) {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(size, size)
  const d = img.data
  const [br, bg, bb] = rgb(hex)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x
      let k = 1
      if (kind === 'wood') {
        const grain = Math.sin(x * 0.28 + Math.sin(y * 0.045) * 3.2)
        const ring = Math.sin((x + y * 0.08) * 0.11)
        k = 0.72 + grain * 0.12 + ring * 0.08 + hash(x * 0.7 + y * 3.1) * 0.08
      } else if (kind === 'plaster') {
        k = 0.86 + hash(x * 1.7 + y * 2.3) * 0.12 + hash(x * 0.2 + y * 0.3) * 0.06
        if (hash(x * 0.11 + y * 4.2) > 0.992) k *= 0.72
      } else if (kind === 'cloth') {
        const weave = ((x >> 2) + (y >> 2)) % 2 === 0 ? 1.06 : 0.92
        k = weave * (0.9 + hash(x + y * 17) * 0.08)
      } else if (kind === 'tatami') {
        const band = Math.floor(y / 18)
        const bind = y % 18 < 2
        const straw = 0.88 + Math.sin(x * 0.9) * 0.06 + hash(x * 2 + y) * 0.08
        k = bind ? 0.62 : straw * (band % 2 === 0 ? 1 : 0.94)
      } else if (kind === 'paper') {
        k = 0.9 + hash(x * 3.1 + y * 1.4) * 0.1 + Math.sin((x + y) * 0.4) * 0.03
      } else if (kind === 'tile') {
        const gx = x % 32
        const gy = y % 32
        const grout = gx < 2 || gy < 2
        const tile = hash(Math.floor(x / 32) * 11 + Math.floor(y / 32) * 19)
        k = grout ? 0.55 : 0.86 + tile * 0.12
      } else if (kind === 'stone') {
        k = 0.78 + hash(x * 0.4 + y * 0.9) * 0.16 + hash(x * 2.2 + y * 0.3) * 0.08
      } else if (kind === 'grass') {
        const blade = 0.82 + Math.sin(x * 0.8 + y * 0.15) * 0.08 + hash(x + y * 9) * 0.12
        k = blade * (hash(y * 0.2 + x * 0.05) > 0.7 ? 1.08 : 0.95)
      } else if (kind === 'carpet') {
        const stripe = Math.sin(x * 0.2) * 0.06
        k = 0.84 + stripe + hash(x * 1.2 + y * 1.2) * 0.1
      } else {
        k = 0.78 + Math.sin(x * 0.15) * 0.08 + hash(x * 0.5 + y) * 0.06
      }
      put(d, i, br * k, bg * k, bb * k)
    }
  }
  ctx.putImageData(img, 0, 0)
  return c
}

export function skin(kind: SkinKind, hex: string, repeat: [number, number] = [1, 1]) {
  const key = `${kind}|${hex}|${repeat[0]}x${repeat[1]}`
  const hit = cache.get(key)
  if (hit) return hit
  const tex = new THREE.CanvasTexture(paint(kind, hex))
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat[0], repeat[1])
  tex.anisotropy = 8
  tex.needsUpdate = true
  cache.set(key, tex)
  return tex
}
