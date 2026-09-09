import * as THREE from 'three'

const cache = new Map<string, THREE.CanvasTexture>()

function tex(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const hit = cache.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  draw(ctx, w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  t.needsUpdate = true
  cache.set(key, t)
  return t
}

function blossom(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, pink: string) {
  ctx.fillStyle = pink
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    ctx.beginPath()
    ctx.ellipse(x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45, r * 0.42, r * 0.28, a, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = '#f7e6b0'
  ctx.beginPath()
  ctx.arc(x, y, r * 0.16, 0, Math.PI * 2)
  ctx.fill()
}

export function sakuraScrollTex() {
  return tex('scroll', 256, 512, (ctx, w, h) => {
    ctx.fillStyle = '#f4e6d8'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(232, 180, 196, 0.18)'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#5a3a28'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(40, 480)
    ctx.quadraticCurveTo(70, 280, 90, 80)
    ctx.quadraticCurveTo(130, 160, 180, 90)
    ctx.stroke()
    ctx.strokeStyle = '#7a5a40'
    ctx.lineWidth = 2.2
    ctx.beginPath()
    ctx.moveTo(90, 200)
    ctx.quadraticCurveTo(40, 170, 30, 120)
    ctx.moveTo(120, 140)
    ctx.quadraticCurveTo(190, 110, 220, 70)
    ctx.stroke()
    const pinks = ['#f4b6c8', '#e8a0b4', '#ffd0dc', '#d4849a']
    for (let i = 0; i < 28; i++) {
      blossom(ctx, 36 + ((i * 67) % 190), 40 + ((i * 41) % 360), 10 + (i % 5), pinks[i % pinks.length])
    }
  })
}

export function wavePrintTex() {
  return tex('wave', 512, 320, (ctx, w, h) => {
    ctx.fillStyle = '#f7ebe4'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#c45c7a'
    for (let y = 30; y < h; y += 28) {
      ctx.lineWidth = 2 + ((y / 28) % 3)
      ctx.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const yy = y + Math.sin(x * 0.04 + y * 0.02) * 10
        if (x === 0) ctx.moveTo(x, yy)
        else ctx.lineTo(x, yy)
      }
      ctx.stroke()
    }
    ctx.fillStyle = '#e8a0b4'
    ctx.beginPath()
    ctx.arc(400, 70, 36, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#f4ead8'
    ctx.beginPath()
    ctx.arc(388, 62, 12, 0, Math.PI * 2)
    ctx.fill()
  })
}

export function cranePaperTex() {
  return tex('crane', 256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#f8eee8'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#e8b8c8'
    ctx.beginPath()
    ctx.moveTo(128, 40)
    ctx.lineTo(200, 150)
    ctx.lineTo(128, 210)
    ctx.lineTo(56, 150)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#f4d0dc'
    ctx.beginPath()
    ctx.moveTo(128, 70)
    ctx.lineTo(170, 140)
    ctx.lineTo(128, 170)
    ctx.closePath()
    ctx.fill()
  })
}

export function shojiTex() {
  return tex('shoji', 256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#f7f0e6'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(90, 50, 40, 0.22)'
    ctx.lineWidth = 6
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath()
      ctx.moveTo((i * w) / 4, 0)
      ctx.lineTo((i * w) / 4, h)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, (i * h) / 4)
      ctx.lineTo(w, (i * h) / 4)
      ctx.stroke()
    }
  })
}
