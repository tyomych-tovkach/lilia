export const FONT = './fonts/cjk.ttf'
export const RU_FONT = './fonts/ru.ttf'

export const SPAWN: [number, number, number] = [0, 1.02, 19.15]
export const STREET_X = 2.62

export const GATES = {
  toArcade: 11.55,
  toMatch: 0.85,
  toPortals: -7.55,
  toMail: -16.05,
} as const

export const SPOTS = {
  envelope: [0, 0, 17.35] as [number, number, number],
  letter: [0, 0, 16.55] as [number, number, number],
  dance: [-2.05, 0, 8.15] as [number, number, number],
  japan: [-1.55, 0, 7.15] as [number, number, number],
  sport: [1.55, 0, 5.55] as [number, number, number],
  secret: [0, 0, 3.45] as [number, number, number],
  kubgu: [-2.28, 0, 9.55] as [number, number, number],
  vkusno: [2.28, 0, 9.55] as [number, number, number],
  board: [0, 0, -3.15] as [number, number, number],
  portalCalm: [-1.55, 1.32, -10.15] as [number, number, number],
  portalPlay: [0, 1.32, -10.85] as [number, number, number],
  portalJapan: [1.55, 1.32, -10.15] as [number, number, number],
  mailbox: [0, 0, -19.05] as [number, number, number],
}

export const WORLD = {
  x: 2.62,
  zMax: 20.35,
  zMin: -22.85,
}
