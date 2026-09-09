export const crashPulse = {
  at: 0,
  from: 0,
}

export function bumpCrash(stage: number) {
  crashPulse.at = typeof performance !== 'undefined' ? performance.now() : Date.now()
  crashPulse.from = stage
}
