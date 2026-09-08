import type { LocationId } from '../content/types'

type Fn = (loc: LocationId) => void
let listener: Fn | null = null

export function emitTalk(loc: LocationId) {
  listener?.(loc)
}

export function onTalk(fn: Fn) {
  listener = fn
  return () => {
    if (listener === fn) listener = null
  }
}
